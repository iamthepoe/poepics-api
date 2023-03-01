const upload = require('./modules/multer.js');

function sendPhoto(fieldname) {
	return function (req, res, next) {
		if (req.decodedToken != undefined) {
			upload.single(fieldname)(req, res, next);
		}
	};
}

module.exports = sendPhoto;
