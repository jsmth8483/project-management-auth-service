const jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV === 'development';

const generateJWT = (userId, secret, maxAge) => {
	return jwt.sign({ userId }, secret, { expiresIn: maxAge });
};

const clearTokens = async (req, res) => {
	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: !dev,
		signed: true,
	});
};

module.exports = {
	generateJWT,
	clearTokens,
};
