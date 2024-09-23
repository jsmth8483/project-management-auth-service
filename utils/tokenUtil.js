const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV === 'development';

const generateJWT = (userId, secret, maxAge) => {
	return jwt.sign({ userId }, secret, { expiresIn: maxAge });
};

const clearTokens = async (req, res, next) => {
	res.clearCookie('jwt', {
		httpOnly: true,
		secure: !dev,
	});
};

module.exports = {
	generateJWT,
	clearTokens,
};
