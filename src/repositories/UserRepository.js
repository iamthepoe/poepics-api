class UserRepository {
	constructor({ UserModel }) {
		this.UserModel = UserModel;
	}

	async create(name, email, password) {
		try {
			let newUser = new this.UserModel({
				name,
				email,
				password,
			});

			await newUser.save();

			return true;
		} catch (e) {
			throw new Error(e);
		}
	}

	async findOneAndUpdate(newData) {
		try {
			await this.UserModel.findOneAndUpdate(newData);
		} catch (e) {
			throw new Error(e);
		}
	}

	async deleteOne(property) {
		try {
			await this.UserModel.findOneAndDelete({ property });
			return true;
		} catch (e) {
			throw new Error(e);
		}
	}

	async findAll() {
		try {
			const users = await this.UserModel.find({});
			return users;
		} catch (e) {
			throw new Error(e);
		}
	}

	async findById(id) {
		try {
			const user = await this.UserModel.findById(id);
			return user;
		} catch (e) {
			throw new Error(e);
		}
	}

	async findByEmail(email) {
		try {
			const user = await this.UserModel.findOne({ email });
			return user;
		} catch (e) {
			throw new Error(e);
		}
	}
}

module.exports = UserRepository;
