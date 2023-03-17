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
			!['public', 'private', 'unlisted'].includes(privacy)
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
					//change this to path with user id
					link: `${url}/images/file/${file.filename}`,
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

	async find(query) {
		try {
			let images = await this.ImageRepository.find(query);
			return {
				error: false,
				status: 200,
				data: { images },
				message: 'Finded.',
			};
		} catch (e) {
			return {
				error: true,
				status: 400,
				message: `Something wrong occurred with your search: \n` + e,
			};
		}
	}

	async findPath(user, filename) {
		return path.join(__dirname, `../../uploads/${user}/${filename}`);
	}

	async CanSeeImage(owner, requester, privacy) {
		if (privacy != 'private') return true;

		if (owner === requester) return true;

		return false;
	}
	async deleteOne(fileName, userId) {
		if (!fileName?.trim())
			return {
				error: true,
				status: 403,
				message: `You can't pass a empty filename.`,
			};

		try {
			await this.ImageRepository.deleteFile(
				path.join(__dirname + `../../../uploads/${userId}/${fileName}`)
			);
			await this.ImageRepository.findOneAndDelete(fileName);
			return {
				error: false,
				status: 200,
				message: 'Deleted.',
			};
		} catch (e) {
			return {
				error: true,
				status: 400,
				message: 'Something wrong occurred with your deletion: \n' + e,
			};
		}
	}
}

module.exports = ImageService;
