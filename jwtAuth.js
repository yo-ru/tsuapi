const nJwt = require('njwt');
const config = require('./config.json');


function jwtAuth(req, res, next) {
	// Forbidden
	if (!req.token) return res.status(403).json({status: 'forbidden', auth: false});

	// Authorization
	nJwt.verify(req.token, config.secret, function(err, decoded) {
		// Error
		if (err) return res.status(500).json({status: 'error', auth: false});
		// Authorized
		req.userId = decoded.body.id;
		next();
	});
}

modules.exports = jwtAuth;
