const { Client } = require('pg');
require('dotenv').config();

module.exports.getClient = async () => {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: 'questionsAnswers',
  });
  await client.connect();
  return client;
};