// Requirements
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const mysql = require('mysql');

// Routes
const auth = require('./auth');


// MySQL Connection
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'night',
	password: 'Superl1nus',
	database: 'tsumori'
});
connection.connect((err) => {
	if (err) {
		console.log('Failed to connect to database! Check SQL config and try again!');
		return;
	} else {
		console.log('Successfully connected to database!');
	}
});


// Port
const port = process.env.PORT || 8000;


// App
const app = express()
	.use(cors())
	.use(bodyParser.json())
	.use(bearerToken())

	// Routes
	.use('/', auth(connection));


// Listen
app.listen(port, () => {
	console.log(`Tsumori API listening on port ${port}`);
});
