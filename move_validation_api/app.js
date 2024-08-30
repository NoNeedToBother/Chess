const express = require('express');
const logger = require('morgan');

const validationRouter = require('./routes/validation');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/validate', validationRouter);

const port = 3333
app.listen(port, () => console.log("Server is running on http://localhost:" + port))

module.exports = app;
