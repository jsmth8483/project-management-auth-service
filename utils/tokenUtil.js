const jwt = require('jsonwebtoken');
const User = require('../models/user');
const createError = require('http-errors');
const ms = require('ms');

const dev = process.env.NODE_ENV === 'development';

const generateJWT = (userId, secret, maxAge) => {
	return jwt.sign({ userId }, secret, { expiresIn: maxAge });
};

const clearTokens = async (req, res, next) => {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: !dev,
	});
};

const refreshAccessToken = async (req, res, next) => {
	const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_TTL } =
		process.env;

	const { signedCookies } = req;
	const { refreshToken } = signedCookies;

	if (!refreshToken) {
		return res.sendStatus(204);
	}

	try {
		const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
		const { userId } = decodedToken;
		const user = User.findOne({ _id: userId });

		if (!user) {
			await clearTokens(req, res, next);
			const error = createError('Invalid Credentials', 401);
		}

		const accessToken = generateJWT(
			user._id,
			ACCESS_TOKEN_SECRET,
			ACCESS_TOKEN_TTL
		);

		return res.status(200).json({
			userId,
			accessToken,
			expiresAt: new Date(Date.now() + ms(ACCESS_TOKEN_TTL)),
		});
	} catch (err) {
		return next(err);
	}
};

module.exports = {
	generateJWT,
	clearTokens,
	refreshAccessToken,
};
