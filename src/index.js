const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

const {
  DB_USER,
  DB_PASS,
  DB_DEV,
  DB_TEST,
  DB_HOST,
  PORT,
  NODE_ENV
} = process.env;

const db_name = NODE_ENV === 'test' ? DB_TEST: DB_DEV;
const url = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}/${db_name}`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`MongoDB is connected on ${DB_HOST}/${db_name}`);
  })
  .catch((err) => {
    console.log('Error on connecting to MongoDB', err);
  });

const app = express();
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;