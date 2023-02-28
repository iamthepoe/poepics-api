require('dotenv').config();
const app = require('../src/app.js');
const supertest = require('supertest');
const request = supertest(app);
const { fail } = require('./helpers.js');
const jwt = require('jsonwebtoken');

let mainUser = {
	name: 'George Boole',
	email: 'george@boole.math',
	password: 'nand???',
};

let adminToken = jwt.sign(
	{ email: 'admin@api.root', isAdmin: true },
	process.env.JWT_SECRET
);

beforeAll(async () => {
	try {
		await request.post('/users').send(mainUser);
	} catch (error) {
		console.log(error);
	}
});

afterAll(async () => {
	try {
		await request.delete('/users/' + mainUser.email);
	} catch (error) {
		console.log(error);
	}
});

describe('CREATE tests', () => {
	it('should realize signup a user with success', () => {
		let user = {
			name: 'John Galt',
			email: `${Date.now()}@.com`,
			password: 'RANDom222',
		};

		return request
			.post('/users')
			.send(user)
			.then((res) => {
				expect(res.statusCode).toEqual(201);
			})
			.catch((e) => {
				fail(e);
			});
	});

	it('should prevent empty data from being inserted', () => {
		let user = { name: ' ', email: ' ', password: ' ' };
		return request
			.post('/users')
			.send(user)
			.then((res) => {
				expect(res.statusCode).toEqual(400);
			})
			.catch((e) => {
				fail(e);
			});
	});

	it('should prevent a duplicated email from being inserted', async () => {
		try {
			await request.post('/users').send(mainUser);
			let res = await request.post('/users').send(mainUser);
			expect(res.statusCode).toEqual(400);
		} catch (e) {
			fail(e);
		}
	});
});

describe('READ tests', () => {
	it('should return all users', () => {
		return request
			.get('/users')
			.set('Authorization', `Bearer ${adminToken}`)
			.then((res) => {
				expect(res.statusCode).toEqual(200);
				expect(res.body.data.users).toBeDefined();
			})
			.catch((e) => {
				fail(e);
			});
	});

	it('should reject a non-admin requisition', () => {
		let normalToken = jwt.sign(
			{ email: 'normal@user.api' },
			process.env.JWT_SECRET
		);
		return request
			.get('/users')
			.set('Authorization', `Bearer ${normalToken}`)
			.then((res) => {
				expect(res.statusCode).toEqual(403 || 401);
				expect(res.body?.data?.users).toBeUndefined();
			})
			.catch((e) => {
				fail(e);
			});
	});
});

describe('authentication tests', () => {
	it('should return a token when user does login', () => {
		let { email, password } = mainUser;
		return request
			.post('/user/auth')
			.send({ email, password })
			.then((res) => {
				expect(res.statusCode).toEqual(200);
				expect(res.body.data.user.token).toBeDefined();
			})
			.catch((error) => {
				fail(error);
			});
	});

	it('should prevent a non-existent user to login', () => {
		let email = `${Date.now}IDONTEXIST@ThisIsA.lie`;
		let password = 'liar';
		return request
			.post('/user/auth')
			.send({ email, password })
			.then((res) => {
				expect(res.statusCode).toEqual(404);
				expect(res?.data?.user.token).toBeUndefined();
			})
			.catch((error) => {
				fail(error);
			});
	});

	it('should prevent a user to send empty data', () => {
		let email = '    ';
		let password = '    ';
		return request
			.post('/user/auth')
			.send({ email, password })
			.then((res) => {
				expect(res.statusCode).toEqual(400);
				expect(res?.data?.token).toBeUndefined();
			})
			.catch((error) => {
				fail(error);
			});
	});

	it('should prevent a user to login with a incorrect password', () => {
		let email = mainUser.email;
		let password = 'im wrong, sir.';
		return request
			.post('/user/auth')
			.send({ email, password })
			.then((res) => {
				expect(res.statusCode).toEqual(403);
				expect(res?.data?.token).toBeUndefined();
			})
			.catch((error) => {
				fail(error);
			});
	});
});

describe('UPDATE tests', () => {
	it('should update the user if that same user sends the request. ', () => {
		const token = jwt.sign(
			{ email: mainUser.email },
			process.env.JWT_SECRET
		);
		request
			.patch('/users/' + mainUser.email)
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Boole George',
				email: 'boole@george.math',
				password: 'newpasswordofgeorgeboole',
			})
			.then((res) => {
				expect(res.statusCode).toEqual(200);
				expect(res.body.data.token).toBeDefined();
			})
			.catch((error) => {
				fail(error);
			});

		mainUser.email = 'boole@george.math';
	});

	it('should update the user if admin sends that request. ', () => {
		request
			.patch('/users/' + mainUser.email)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Boole George - By Admin',
				email: 'boole@george.math',
				password: 'newpasswordofgeorgeboole',
			})
			.then((res) => {
				expect(res.statusCode).toEqual(200);
				expect(res.body.data.token).toBeDefined();
			})
			.catch((error) => {
				fail(error);
			});
	});

	it('should reject the update if is not user or admin sending the request', () => {
		let token = jwt.sign(
			{ email: 'imtrolling@hehe.troll' },
			process.env.JWT_SECRET
		);

		request
			.patch('/users/' + mainUser.email)
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Boole George - By Troll',
				email: 'boole@george.math',
				password: 'newpasswordofgeorgeboole',
			})
			.then((res) => {
				expect(res.statusCode).toEqual(403);
				expect(res.body?.data?.token).toBeUndefined();
			})
			.catch((error) => {
				fail(error);
			});
	});
});
