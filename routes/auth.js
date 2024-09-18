const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const app = express();
const router = express.Router();

router.post('/register', async (req, res, next) => {
	const { email, password } = req.body;

	const existingUser = await User.findOne({ email: email }).exec();
	if (existingUser) {
		res.status(400).json({
			message: 'User already exists',
		});
	} else {
		if (password.length < 6) {
			res.status(400).json({
				message:
					'Password does not meet required length of 6 characters',
			});
		}

		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);
			await User.create({ email, password: hash }).then((user) => {
				res.status(200).json({
					message: 'User successfully created.',
					user,
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

module.exports = router;
