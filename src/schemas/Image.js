const mongoose = require('../database/connection.js');

const Images = new mongoose.Schema({
	title: String,
	description: String,
	privacy: String,
	fileName: { type: String, required: true },
	contentType: { type: String, required: true },
	user: { type: String, required: true },
});

module.exports = Images;
