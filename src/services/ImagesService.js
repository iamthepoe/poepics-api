require('dotenv').config();
const path = require('path');
const url = process.env.SITE_URL;

class ImageService {
	constructor({ ImageRepository }) {
		this.ImageRepository = ImageRepository;
	}

	async create(title, description, privacy, file, user) {
		if (!file)
			return {
				error: true,
				status: 403,
				message: 'Only images are allowed!',
			};
		if (!user?.trim())
			return { error: true, status: 403, message: 'Invalid user.' };

		if (
			!privacy?.trim() ||
			privacy != ('public' || 'private' || 'unlisted')
		)
			return {
				error: true,
				status: 403,
				message: `The privacy of image only can be "public", "private" or "unlisted"!`,
			};

		if (!title?.trim()) title = file.filename;
		if (!description?.trim()) description = ' ';

		try {
			await this.ImageRepository.create(
				title,
				description,
				privacy,
				file.filename,
				path.extname(file.originalname),
				user
			);

			return {
				error: false,
				status: 201,
				data: {
					link: `${url}/uploads/${file.filename}`,
				},
				message: 'Created.',
			};
		} catch (e) {
			return {
				error: true,
				status: 400,
				message: 'Something wrong occurred with your upload: \n' + e,
			};
		}
	}
}

module.exports = ImageService;
