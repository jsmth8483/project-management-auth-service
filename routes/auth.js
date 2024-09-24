const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
	generateJWT,
	clearTokens,
	refreshAccessToken,
} = require('../utils/tokenUtil');
const { isAuthenticated, generateAuthTokens } = require('../middlewares/auth');
const app = express();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res, next) => {
	const { fullName, email, password } = req.body;

	const existingUser = await User.findOne({ email: email }).exec();
	if (existingUser) {
		res.status(400).json({
			message: 'User already exists',
		});
	} else {
		if (password.length < 6) {
			return res.status(400).json({
				message:
					'Password does not meet required length of 6 characters',
			});
		}

		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);
			await User.create({ name: fullName, email, password: hash }).then(
				(user) => {
					res.status(201).json({
						message: 'User successfully created.',
						user: user._id,
					});
				}
			);
		} catch (err) {
			console.log(err.message);
			res.status(401).json({
				message: 'User registration failed',
			});
		}
	}
});

router.post(
	'/login',
	async (req, res, next) => {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				message: 'Email or password missing',
			});
		}

		try {
			const user = await User.findOne({ email: email }).exec();
			if (user) {
				let result = await bcrypt.compare(password, user.password);
				if (!result) {
					console.error('Passwords do not match');
					return res
						.status(401)
						.json({ message: 'Email or password is incorrect' });
				}
				console.info('User successfully logged in');
				req.userId = user._id;
				next();
			} else {
				console.error('User not found');
				const error = createError.Unauthorized('User not found');
				throw error;
			}
		} catch (err) {
			console.log(`An error occurred: ${err.message}`);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},
	generateAuthTokens
);

router.post('/logout', isAuthenticated, async (req, res, next) => {
	clearTokens(req, res, next);
	res.status(204).json({ message: 'User as been logged out' });
});

router.post('/refresh', refreshAccessToken);

module.exports = router;
