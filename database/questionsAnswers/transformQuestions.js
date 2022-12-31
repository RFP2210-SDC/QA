const fs = require('fs');
const path = require('path');
const { parse, format } = require('fast-csv');
console.log(__dirname);
const inputFile = path.resolve(__dirname, '../../../QA/rawdata/questions.csv');
const outputFile = path.resolve(__dirname, '../../../QA/rawdata/transformed_questions.csv');


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
        id: row.id,
        product_id: row.product_id,
        body: `"${row.body}"`,
        date_written: (new Date(Number(row.date_written))).toISOString(),
        asker_name: `"${row.asker_name}"`,
        asker_email: `"${row.asker_email}"`,
        reported: row.reported,
        helpful: row.helpful,
      }
    ));

  fs.createReadStream(inputFile)
    .pipe(parseOpts)
    .pipe(transform)
    .pipe(writeStream);
}());