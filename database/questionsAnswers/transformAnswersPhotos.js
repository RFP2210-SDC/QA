const fs = require('fs');
const path = require('path');
const { parse, format } = require('fast-csv');

const inputFile = path.resolve(__dirname, '../../../QA/rawdata/answers_photos.csv');
const outputFile = path.resolve(__dirname, '../../../QA/rawdata/transformed_answers_photos.csv');

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
        photo_id: row.id,
        answer_id: row.answer_id,
        url: `"${row.url}"`,
      }
    ));

  fs.createReadStream(inputFile)
    .pipe(parseOpts)
    .pipe(transform)
    .pipe(writeStream);
}());