const nJwt = require('njwt');


function jwtAuth(req, res, next) {
	// Forbidden
	if (!req.token) return res.status(403).json({status: 'forbidden', auth: false});

	// Authorization
	nJwt.verify(req.token, "JvjPeHEkNg", function(err, decoded) {
		// Error
		if (err) return res.status(500).json({status: 'error', auth: false});
		// Authorized
		req.userId = decoded.body.id;
		next();
	});
}

modules.exports = jwtAuth;
