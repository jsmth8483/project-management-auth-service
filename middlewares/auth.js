const ms = require('ms');
const User = require('../models/user');
const { generateJWT } = require('../utils/tokenUtil');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const {
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	REFRESH_TOKEN_TTL,
	ACCESS_TOKEN_TTL,
	NODE_ENV,
} = process.env;

const dev = NODE_ENV === 'development';

const generateAuthTokens = async (req, res, next) => {
	try {
		const { userId } = req;
		const user = await User.findOne({ _id: userId }).exec();
		if (user) {
			const refreshToken = generateJWT(
				user._id,
				REFRESH_TOKEN_SECRET,
				REFRESH_TOKEN_TTL
			);

			const accessToken = generateJWT(
				user._id,
				ACCESS_TOKEN_SECRET,
				ACCESS_TOKEN_TTL
			);

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: !dev,
				signed: true,
				expires: new Date(Date.now() + ms(REFRESH_TOKEN_TTL)),
			});

			const accessTokenExpires = new Date(
				Date.now() + ms(ACCESS_TOKEN_TTL)
			);
			return res
				.status(200)
				.json({ user: user._id, accessToken, accessTokenExpires });
		} else {
			throw new Error('Invalid userId');
		}
	} catch (err) {
		return next(err);
	}
};

const isAuthenticated = async (req, res, next) => {
	try {
		const authToken = req.get('Authorization');
		const accessToken = authToken?.split('Bearer ')[1];
		if (!accessToken) {
			const error = createError.Unauthorized();
			throw error;
		}

		const { signedCookies = {} } = req;

		const { refreshToken } = signedCookies;
		if (!refreshToken) {
			const error = createError.Unauthorized();
			throw error;
		}

		let decodedToken;
		try {
			decodedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
		} catch (err) {
			const error = createError.Unauthorized();
			return next(error);
		}

		const { userId } = decodedToken;
		const user = User.findOne({ _id: userId });
		if (!user) {
			const error = createError.Unauthorized();
			return next(error);
		}

		req.userId = userId;
		return next();
	} catch (err) {
		return next(err);
	}
};

module.exports = {
	generateAuthTokens,
	isAuthenticated,
};
