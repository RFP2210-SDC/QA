const { getClient } = require('./index.js');

(async () => {
  const client = await getClient();
  let createAnswersTableQuery = `
    CREATE TABLE IF NOT EXISTS answers(
      id              INTEGER PRIMARY KEY NOT NULL,
      question_id     INTEGER,
      body            TEXT,
      date_written    TIMESTAMPTZ,
      answerer_name   TEXT,
      answerer_email  TEXT,
      reported        INTEGER,
      helpful         INTEGER,
      CONSTRAINT      fk_answers_questions
      FOREIGN KEY     (question_id)
      REFERENCES      questions(id)
    );
  `;
  const res = await client.query(createAnswersTableQuery);
  console.log(`Created answers table.`);
  await client.end();
})();