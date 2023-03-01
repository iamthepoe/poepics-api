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
}

module.exports = ImageRepository;
