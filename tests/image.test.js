require('dotenv').config();
const fs = require('fs');
const path = require('path');
const app = require('../src/app.js');
const supertest = require('supertest');
const request = supertest(app);
const { fail } = require('./helpers.js');
const jwt = require('jsonwebtoken');
const JWTSecret = process.env.JWT_SECRET;
var token, fileStream, notAImage;

beforeAll(async () => {
	try {
		fileStream = await fs.createReadStream(
			path.join(__dirname, 'assets', 'joy.png')
		);
		notAImage = await fs.readFileSync(
			path.join(__dirname, 'assets', 'notaimage.rs')
		);
		token = await jwt.sign(
			{ email: 'imjustaregularuser@user.app', id: 'aasdaosdjp' },
			JWTSecret
		);
		console.log(token);
	} catch (e) {
		fail(e);
	}
});

describe('CREATE Tests', () => {
	it('should upload a image with success', () => {
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

	it('should prevent a user from uploading a file who is not a image', () => {
		return request
			.post('/images')
			.set('Authorization', `Bearer ${token}`)
			.set('Content-Type', 'multipart/form-data')
			.field('privacy', 'public')
			.attach('file', notAImage)
			.then((res) => {
				expect(res.statusCode).toEqual(403);
				expect(res.body?.data?.link).toBeUndefined();
			})
			.catch((e) => {
				fail(e);
			});
	});
});

describe('READ Tests', () => {
	it('should return all public images', () => {
		return request.get('/images').then((res) => {
			expect(res.statusCode).toEqual(200);
			expect(res.body?.data?.images).toBeDefined();
		});
	});

	it('should return all images of user who is sending requisition', () => {
		return request
			.get('/users/images')
			.set('Authorization', `Bearer ${token}`)
			.then((res) => {
				expect(res.statusCode).toEqual(200);
				expect(res.body?.data?.images).toBeDefined();
			});
	});

	it('should return all images of user who is sending requisition, based on privacy param', () => {
		let privacy = 'private';
		return request
			.get('/users/images?privacy=' + privacy)
			.set('Authorization', `Bearer ${token}`)
			.then((res) => {
				expect(res.statusCode).toEqual(200);
				expect(res.body?.data?.images).toBeDefined();
			});
	});
});
