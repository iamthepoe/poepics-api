const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = `uploads/${req.decodedToken.id}`;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});

const imageFilter = function (req, file, cb) {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return cb(new Error('Only images are allowed!'), false);
	}
	cb(null, true);
};

const upload = multer({ storage, imageFilter });

module.exports = upload;
