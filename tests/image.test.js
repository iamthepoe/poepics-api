require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('../src/app.js');
const supertest = require('supertest');
const request = supertest(app);
const { fail } = require('./helpers.js');
const jwt = require('jsonwebtoken');
const JWTSecret = process.env.JWT_SECRET;
var token, fileStream;

beforeAll(async () => {
	const filePath = path.join(__dirname, 'assets', 'joy.png');
	try {
		fileStream = await fs.createReadStream(filePath);
		token = await jwt.sign(
			{ email: 'imjustaregularuser@user.app', id: 'aasdaosdjp' },
			JWTSecret
		);
	} catch (e) {
		fail(e);
	}
});

describe('CREATE Tests', () => {
	it('should upload a image if success', () => {
		return request
			.post('/images')
			.set('Authorization', `Bearer ${token}`)
			.set('Content-Type', 'multipart/form-data')
			.field('privacy', 'public')
			.attach('file', fileStream)
			.then((res) => {
				expect(res.statusCode).toEqual(201);
				expect(res.body?.data?.link).toBeDefined();
			})
			.catch((e) => {
				fail(e);
			});
	});

	it('should prevent user from uploading an image without token', () => {
		return request
			.post('/images')
			.set('Content-Type', 'multipart/form-data')
			.field('privacy', 'public')
			.attach('file', fileStream)
			.then((res) => {
				expect(res.statusCode).toEqual(403);
				expect(res.body?.data?.link).toBeUndefined();
			})
			.catch((e) => {
				fail(e);
			});
	});
});
