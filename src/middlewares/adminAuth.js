require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

async function adminAuth(req, res, next) {
	const authToken = req.headers['authorization'].split(' ')[1];
	try {
		const decoded = jwt.verify(authToken, secret);
		if (decoded.isAdmin) {
			next();
		} else {
			res.sendStatus(403);
		}
	} catch (e) {
		return res.sendStatus(401);
	}
}

module.exports = adminAuth;
