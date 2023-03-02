const ImageFactory = require('../factories/ImageFactory.js');
const imageService = ImageFactory.generateInstance();
const router = require('express').Router();
const upload = require('../middlewares/modules/multer.js');
const tokenAuth = require('../middlewares/tokenAuth.js');
const sendPhoto = require('../middlewares/sendphoto.js');

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
