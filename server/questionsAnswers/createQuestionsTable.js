const { getClient } = require('./index.js');

(async () => {
  const client = await getClient();
  let createQuestionsTableQuery = `
    CREATE TABLE IF NOT EXISTS questions(
      id            INTEGER PRIMARY KEY NOT NULL ,
      product_id    INTEGER,
      body          TEXT,
      date_written  TIMESTAMPTZ,
      asker_name    TEXT,
      asker_email   TEXT,
      reported      INTEGER,
      helpful       INTEGER
    );
  `;
  const res = await client.query(createQuestionsTableQuery);
  console.log(`Created questions table.`);
  await client.end();
})();