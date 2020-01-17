const express = require('express');
const bcrypt = require('bcryptjs');
const nJwt = require('njwt');
const config = require('./config.json');

function createRouter(db) {
	const router = express.Router();

	/* Routes */
	// Register
	router.post('/api/register', function(req, res) {
		// Invalid Post Data
		if (!req.body.name || !req.body.email || !req.body.password) return res.status(400).json({status: 'invalid post data'});

		// Hash Password
		var hashedPassword = bcrypt.hashSync(req.body.password, 8);

		// Insert New User
		db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [req.body.name, req.body.email, hashedPassword], function(error) {
			if (error) {
				// User Already Exists
				if (error.errno == 1062) return res.status(400).json({status: 'user already exists'});

				// MySQL Unhandled Errors
				console.error(error);
				res.status(500).json({status: 'internal server error'});
			} else {
				// User Doesn't Exist, Create Account
				res.status(200).json({status: 'account created'});
			}
		});
	});

	// Login
	router.post('/api/login', function(req, res) {
		// Invalid Post Data
		if (!req.body.email || !req.body.password) return res.status(400).json({status: 'invalid post data'});

		// Select Existing User
		db.query("SELECT id, name, email, password FROM users WHERE email=?", [req.body.email], function(error, user) {
			// Server Side Error
			if (error) return res.status(500).json({status: 'internal server error'});
			// User Not Found
			if (!user[0]) return res.status(404).json({status: 'user not found'});
			// Unauthorized - Incorrect Password
			if (!bcrypt.compareSync(req.body.password, user[0].password)) return res.status(401).json({status: 'unauthorized', auth: false, token: null});
			// Authorized - Correct Password
			var jwt = nJwt.create({id: user[0].id}, config.secret);
			jwt.setExpiration(new Date().getTime() + (24*60*60*1000));
			res.status(200).json({status: 'authorized', auth: true, token: jwt.compact()});
		});
	});

	return router;
}

module.exports = createRouter;
