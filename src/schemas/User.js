const mongoose = require('../database/connection.js');

const User = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
});

module.exports = User;
