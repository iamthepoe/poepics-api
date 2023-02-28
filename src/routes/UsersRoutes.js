const UserFactory = require('../factories/UserFactory.js');
const userService = UserFactory.generateInstance();
const router = require('express').Router();
const adminAuth = require('../middlewares/adminAuth.js');
const tokenAuth = require('../middlewares/tokenAuth.js');

router.get('/users', adminAuth, async (req, res) => {
	let result = await userService.findAll();
	const { status, message, data } = result;
	return res.status(status).json({
		message,
		data: data || {},
	});
});

router.post('/users', async (req, res) => {
	const { name, email, password } = req.body;
	let result = await userService.create(name, email, password);
	const { status, message, data } = result;
	return res.status(status).json({ message, data: data || {} });
});

router.post('/user/auth', async (req, res) => {
	const { email, password } = req.body;
	let result = await userService.login(email, password);
	const { data, message, status } = result;
	return res.status(status).json({
		message,
		data: data || {},
	});
});

router.patch('/users/:email', tokenAuth, async (req, res) => {
	const userEmail = req.params.email;
	const token = req.headers['authorization'];
	const { email, password, name } = req.body;
	let result = await userService.update(token, userEmail, {
		email,
		password,
		name,
	});
	const { status, data, message } = result;
	return res.status(status).json({
		data: data || {},
		message,
	});
});

router.delete('/users/:email', async (req, res) => {
	const { email } = req.params;
	let result = await userService.deleteOne(email);
	const { status, message, data } = result;
	return res.status(status).json({ message, data: data || {} });
});

module.exports = router;
