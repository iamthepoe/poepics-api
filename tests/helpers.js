function fail(error = 'fail was called in a test.') {
	throw new Error(error);
}

module.exports = { fail };
