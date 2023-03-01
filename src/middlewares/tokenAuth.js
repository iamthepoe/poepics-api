require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

async function tokenAuth(req, res, next) {
	const authToken = req.headers['authorization'];
	if (authToken != undefined) {
		const token = authToken.split(' ')[1];
		try {
			const decoded = await jwt.verify(token, secret);
			req.decodedToken = decoded;
			next();
		} catch (e) {
			return res
				.status(403)
				.json({ error: 'true', message: 'Invalid token!' });
		}
	} else {
		return res.status(403).json({ error: true, message: 'Invalid token!' });
	}
}

module.exports = tokenAuth;
