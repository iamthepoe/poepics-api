const express = require('express');
const app = express();
const UsersRoutes = require('./routes/UsersRoutes.js');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
	return res.sendStatus(200);
});

app.use('/', UsersRoutes);

module.exports = app;
