require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWTSecret = process.env.JWT_SECRET;

class UserService {
	constructor({ UserRepository }) {
		this.UserRepository = UserRepository;
	}

	async findAll() {
		try {
			let users = await this.UserRepository.findAll();
			return {
				error: false,
				data: { users },
				status: 200,
				message: 'Users finded.',
			};
		} catch (e) {
			return {
				error: true,
				status: 404,
				message: 'Something wrong happaned with your search: \n' + e,
			};
		}
	}

	async findById(id) {
		try {
			let user = await this.UserRepository.findById(id);
			if (user == false) {
				return {
					error: true,
					status: 404,
					message: 'Not found.',
				};
			}
			return {
				error: false,
				data: { user },
				status: 200,
				message: 'User finded',
			};
		} catch (e) {
			return {
				error: true,
				status: 400,
				message: 'Something wrong happaned with your search: \n' + e,
			};
		}
	}

	async findByEmail(email) {
		try {
			let user = await this.UserRepository.findByEmail(email);
			if (user == null) {
				return {
					error: true,
					status: 404,
					message: 'Not found',
				};
			}
			return {
				error: false,
				data: { user },
				status: 200,
				message: 'User finded.',
			};
		} catch (e) {
			return {
				error: true,
				status: 400,
				message: 'Something wrong happaned with your search: \n' + e,
			};
		}
	}

	async create(name, email, password) {
		if (!name.trim() || !email.trim() || !password.trim())
			return {
				error: true,
				status: 400,
				message: "You can't pass empty values",
			};

		let response = await this.findByEmail(email);

		if (response?.data?.user)
			return {
				error: true,
				status: 400,
				message: 'This email is already in use!',
			};

		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);
			await this.UserRepository.create(name, email, (password = hash));
			return {
				error: false,
				status: 201,
				message: 'User Created.',
			};
		} catch (e) {
			return {
				error: true,
				status: 500,
				message:
					'Something wrong occured with your requisition: \n' + e,
			};
		}
	}

	async update(token, email, newData) {
		try {
			const decoded = await jwt.verify(token.split(' ')[1], JWTSecret);

			if (decoded.email != email && !decoded.isAdmin)
				return {
					error: true,
					status: 403,
					message: 'only the user himself can update his email ',
				};

			let user = await this.UserRepository.findByEmail(email);

			if (newData?.name) user.name = newData.name;

			if (newData?.password) {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(newData.password, salt);
				user.password = hash;
			}

			if (newData?.email) {
				user.email = newData.email;
				var newToken = await jwt.sign({ email: user.email }, JWTSecret);
			}

			await user.save();

			if (newToken != undefined) {
				return {
					error: false,
					status: 200,
					data: {
						token: newToken,
					},
					message: 'Updated',
				};
			} else {
				return {
					error: false,
					status: 200,
					data: {},
					message: 'Updated',
				};
			}
		} catch (e) {
			console.log(e);
			return {
				error: true,
				status: 400,
				message: 'Something wron occurred with your update: \n' + e,
			};
		}
	}

	async deleteOne(property) {
		try {
			await this.UserRepository.deleteOne(property);
			return {
				error: false,
				status: 200,
				message: 'User deleted.',
			};
		} catch (e) {
			return {
				error: true,
				status: 400,
				message: 'Something wrong happaned with your deletion: \n' + e,
			};
		}
	}

	async login(email, password) {
		if (!email.trim() || !password.trim())
			return {
				error: true,
				status: 400,
				message: `You can't send empty data.`,
			};

		const response = await this.findByEmail(email);

		if (!response?.data?.user) {
			return response;
		}

		const { data } = response;

		let isCorrectPassword = await bcrypt.compareSync(
			password,
			data.user.password
		);

		if (!isCorrectPassword)
			return { error: true, message: 'Incorrect password', status: 403 };

		try {
			let res = await jwt.sign({ email, id: data.user._id }, JWTSecret, {
				expiresIn: '72h',
			});
			return {
				error: false,
				status: 200,
				data: {
					user: {
						name: data.user.name,
						email: data.user.email,
						token: res,
					},
				},
				message: 'Authenticated with success.',
			};
		} catch (e) {
			return {
				error: true,
				status: 500,
				message: 'Authentication failed: ' + e,
			};
		}
	}
}

module.exports = UserService;
