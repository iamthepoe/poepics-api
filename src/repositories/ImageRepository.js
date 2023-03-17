const fs = require('fs');

class ImageRepository {
	constructor({ ImageModel }) {
		this.ImageModel = ImageModel;
	}

	async create(title, description, privacy, fileName, contentType, user) {
		try {
			await this.ImageModel.create({
				title,
				description,
				privacy,
				fileName,
				contentType,
				user,
			});
			return true;
		} catch (e) {
			throw new Error(e);
		}
	}

	async find(query) {
		try {
			const images = await this.ImageModel.find(query);
			return images;
		} catch (e) {
			throw new Error(e);
		}
	}

	async findOneAndDelete(fileName) {
		try {
			await this.ImageModel.findOneAndDelete({ fileName });
			return true;
		} catch (e) {
			throw new Error(e);
		}
	}

	async deleteFile(filePath) {
		try {
			await fs.promises.unlink(filePath);
			return true;
		} catch (e) {
			throw new Error(e);
		}
	}
}

module.exports = ImageRepository;
