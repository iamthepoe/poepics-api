const UserSchema = require('../schemas/User.js');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
