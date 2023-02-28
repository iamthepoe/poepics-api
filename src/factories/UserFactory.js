const UserModel = require('../models/UserModel.js');
const UserRepository = require('../repositories/UserRepository.js');
const UserService = require('../services/UsersService.js');

const generateInstance = () => {
	const userRepository = new UserRepository({ UserModel });
	const userService = new UserService({ UserRepository: userRepository });
	return userService;
};

module.exports = { generateInstance };
