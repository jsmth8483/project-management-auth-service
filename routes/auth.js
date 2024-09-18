const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res, next) => {
	const { email, password } = req.body;

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
			await User.create({ email, password: hash }).then((user) => {
				const maxAge = 3 * 60 * 60;
				const token = jwt.sign(
					{ id: user._id, email, role: user.role },
					JWT_SECRET,
					{ expiresIn: maxAge }
				);
				res.cookie('jwt', token, {
					httpOnly: true,
					maxAge: maxAge * 1000,
				});
				res.status(201).json({
					message: 'User successfully created.',
					user: user._id,
				});
			});
		} catch (err) {
			console.log(err.message);
			res.status(401).json({
				message: 'User registration failed',
			});
		}
	}
});

router.post('/login', async (req, res, next) => {
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
			const maxAge = 3 * 60 * 60;
			const token = jwt.sign(
				{ id: user._id, email, role: user.role },
				JWT_SECRET,
				{ expiresIn: maxAge }
			);
			res.cookie('jwt', token, {
				httpOnly: true,
				maxAge: maxAge * 1000,
			});
			console.info('User successfully logged in');
			res.status(201).json('Successfully logged in');
		} else {
			console.error('User not found');
			return res
				.status(404)
				.json({ message: 'Email or password incorrect' });
		}
	} catch (err) {
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

module.exports = router;
