// require('dotenv').config();

const express = require('express');

const app = express();
const path = require('path');
const router = require('./questionsAnswers/router.js');

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.json());

app.use(router);

app.listen(3000, (err) => {
  if (err) {
    console.log('There is no server at ', 3000);
  } else {
    console.log('Listening on Port ', 3000);
  }
});
