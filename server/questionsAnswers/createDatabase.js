const { getClient } = require('./index.js');

(async () => {
  const client = await getClient();
  let createDatabaseQuery = `
  CREATE DATABASE questionsAnswers
  `;
  const res = await client.query(createDatabaseQuery);
  console.log(`Created questionsAnswers database.`);
  await client.end();
})();