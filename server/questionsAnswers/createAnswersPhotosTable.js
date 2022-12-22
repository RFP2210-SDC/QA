const { getClient } = require('./index.js');

(async () => {
  const client = await getClient();
  let createAnswersPhotosTableQuery = `
    CREATE TABLE IF NOT EXISTS answers_photos(
      id           INTEGER PRIMARY KEY NOT NULL ,
      answer_id    INTEGER,
      url          TEXT,
      CONSTRAINT   fk_answers_photos_answers
      FOREIGN KEY  (answer_id)
      REFERENCES   answers(id)
    );
  `;
  const res = await client.query(createAnswersPhotosTableQuery);
  console.log(`Created answers photos table.`);
  await client.end();
})();