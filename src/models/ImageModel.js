const ImageSchema = require('../schemas/Images.js');
const mongoose = require('mongoose');
const ImageModel = mongoose.model('Image', ImageSchema);
module.exports = ImageModel;
