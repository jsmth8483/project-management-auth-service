const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		minLength: 6,
	},
	role: {
		type: String,
		default: 'Contributer',
		required: true,
	},
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
