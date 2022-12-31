const fs = require('fs');
const path = require('path');
const { parse, format } = require('fast-csv');

const inputFile = path.resolve(__dirname, '../../../QA/rawdata/answers.csv');
const outputFile = path.resolve(__dirname, '../../../QA/rawdata/transformed_answers.csv');

(async function transformCsv() {
  const writeStream = fs.createWriteStream(outputFile);

  const parseOpts = parse({
    ignoreEmpty: true,
    discardUnmappedColumns: true,
    headers: true,
  });

  const transform = format({ headers: true, quote: false })
    .transform((row) => (
      {
        answer_id: row.id,
        question_id: row.question_id,
        body: `"${row.body}"`,
        date_written: (new Date(Number(row.date_written))).toISOString(),
        answerer_name: `"${row.answerer_name}"`,
        answerer_email: `"${row.answerer_email}"`,
        reported: row.reported,
        helpful: row.helpful,
      }
    ));

  fs.createReadStream(inputFile)
    .pipe(parseOpts)
    .pipe(transform)
    .pipe(writeStream);
}());