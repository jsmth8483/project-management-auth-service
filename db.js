require('@dotenvx/dotenvx').config();
const mongoose = require('mongoose');
const dbUrl = process.env.MONGO_URL;

const connectDatabase = async () => {
	await mongoose.connect(dbUrl, { dbName: 'UsersDB' });
	console.log('MongoDB Connected.');
};

module.exports = connectDatabase;
