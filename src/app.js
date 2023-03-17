const express = require('express');
const app = express();
const path = require('path');
const UsersRoutes = require('./routes/UsersRoutes.js');
const ImagesRoutes = require('./routes/ImagesRoutes.js');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
	return res.sendStatus(200);
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/', UsersRoutes);
app.use('/', ImagesRoutes);

module.exports = app;
