const ImageSchema = require('../schemas/Image.js');
const mongoose = require('mongoose');
const ImageModel = mongoose.model('Image', ImageSchema);
module.exports = ImageModel;
