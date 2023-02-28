const ImageModel = require('../models/ImageModel.js');
const ImageRepository = require('../repositories/ImageRepository.js');
const ImageService = require('../services/ImagesService.js');

const generateInstance = () => {
	const imageRepository = new ImageRepository({ ImageModel });
	const imageService = new ImageService({ ImageRepository: imageRepository });
	return imageService;
};

module.exports = { generateInstance };
