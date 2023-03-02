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

	async findOneAndDelete(fileName) {
		try {
			await this.ImageModel.findOneAndDelete({ fileName });
			return true;
		} catch (e) {
			throw new Error(e);
		}
	}

	deleteFile(filePath) {
		fs.unlink(filePath, (e) => {
			if (e) {
				throw new Error(e);
			}
			return true;
		});
	}
}

module.exports = ImageRepository;
