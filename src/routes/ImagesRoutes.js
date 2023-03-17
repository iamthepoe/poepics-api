const ImageFactory = require('../factories/ImageFactory.js');
const imageService = ImageFactory.generateInstance();
const express = require('express');
const app = express();
const router = require('express').Router();
const upload = require('../middlewares/modules/multer.js');
const tokenAuth = require('../middlewares/tokenAuth.js');
const sendPhoto = require('../middlewares/sendphoto.js');
const path = require('path');

app.use(express.static(path.join(__dirname, '../../uploads')));

router.get('/images/file/:fileName', tokenAuth, async (req, res) => {
	const { fileName } = req.params;
	const result = await imageService.find({ fileName });
	const image = result.data.images[0];
	const requesterUser = req.decodedToken.id;
	const ownerUser = image.user;

	let isAllowedToSee = await imageService.CanSeeImage(
		ownerUser,
		requesterUser,
		image.privacy
	);

	if (!isAllowedToSee) return res.sendStatus(403);

	const imagepath = await imageService.findPath(ownerUser, image.fileName);

	res.sendFile(imagepath);
});

router.get('/images', async (req, res) => {
	let result = await imageService.find({ privacy: 'public' });
	const { status, message, data } = result;
	return res.status(status).json({ message, data: data || {} });
});

router.get('/users/images', tokenAuth, async (req, res) => {
	const user = req.decodedToken.id;
	const { privacy } = req.query;

	let result = await imageService.find({
		user,
		privacy: privacy || 'public',
	});

	const { status, message, data } = result;
	return res.status(status).json({ message, data: data || {} });
});

router.post('/images', tokenAuth, sendPhoto('file'), async (req, res) => {
	const { title, description, privacy } = req.body;
	let result = await imageService.create(
		title,
		description,
		privacy,
		req.file,
		req.decodedToken.id
	);
	const { status, message, data } = result;
	res.status(status).json({ message, data: data || {} });
});

router.delete('/images/:filename', tokenAuth, async (req, res) => {
	const { filename } = req.params;
	let result = await imageService.deleteOne(filename, req.decodedToken.id);
	const { status, message } = result;
	return res.status(status).json({ message });
});

module.exports = router;
