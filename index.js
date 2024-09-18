const express = require('express');
const connectDatabase = require('./db');
const cors = require('cors');
const authRouter = require('./routes/auth');
const app = express();

const PORT = 5001;

const db = connectDatabase();

app.use('*', cors());

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
