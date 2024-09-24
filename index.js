const express = require('express');
const connectDatabase = require('./db');
const cors = require('cors');
const authRouter = require('./routes/auth');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV === 'development';

const app = express();

const PORT = 5001;

const db = connectDatabase();

if (dev) {
	app.use(
		'*',
		cors({
			origin: ['http://localhost:5173', 'http://localhost:5001'],
			optionsSuccessStatus: 200,
			credentials: true,
		})
	);
}

app.use(cookieParser(process.env.COOKIE_SECRET));

const server = app.listen(PORT, () =>
	console.log(`Auth Service running on port ${PORT}`)
);

// Global Error Handler
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).send('Internal Server Error');
});

process.on('unhandledRejection', (err) => {
	console.log(`An error has occurred: ${err.message}`);
	server.close(() => process.exit(1));
});

app.use(express.json());

app.use('/api/auth', authRouter);
