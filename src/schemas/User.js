const mongoose = require('../database/connection.js');

const User = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
});

module.exports = User;
