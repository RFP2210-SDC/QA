const { Client, Pool } = require('pg');

const db = new Client({
  host: 'localhost',
  port: 5432,
});

db.connect();

exports.db = db;

const pool = new Pool({ idleTimeoutMillis: 30000 });

exports.getConnection = (callback) => {
  pool.connect((err, client, release) => {
    if (err) {
      callback(err.stack);
    } else {
      callback(null, client, release);
    }
  });
};

exports.getAllQuestions = (params) => {
  const page = params.page;
  const count = params.count;
  const product_id = params.product_id;
  const offset = (page-1) * count;

  const query = (
    `SELECT questions.id AS question_id, questions.body AS question_body, questions.date_written AS question_date, questions.asker_name, questions.helpful AS question_helpfulness, questions.reported, json_object_agg(answers.answer_id, json_build_object('id', answers.answer_id, 'body', answers.body, 'date', answers.date_written, 'answerer_name', answers.answerer_name, 'helpfulness', answers.helpful)) AS answers
    FROM questions
    LEFT JOIN answers ON questions.id=answers.question_id
    WHERE questions.product_id = ${product_id} AND answers.answer_id IS NOT NULL
    GROUP BY questions.id, answers.answer_id
    ORDER BY questions.id
    LIMIT ${count} OFFSET ${offset}`
  );

  const query2 = (
    `SELECT answers.answer_id, answers.body, answers.date_written, answers.answerer_name, answers.helpful, json_agg(json_build_object('id', answers_photos.photo_id, 'url', answers_photos.url)) AS photos
    FROM answers
    LEFT JOIN answers_photos ON answers_photos.answer_id = answers.answer_id
    WHERE question_id IN
    (SELECT questions.id FROM questions WHERE questions.product_id = ${product_id})
    GROUP BY answers.answer_id`
  );

  let queryResult = db.query(query2)
    .then((res) => {

      const result = res.rows.map((answer) => (
        {
        id: answer.answer_id,
        body: answer.body,
        date: answer.date_written,
        answerer_name: answer.answerer_name,
        helpfulness: answer.helpful,
        photos: answer.photos
      }))

      var temp = {};
      for (var i = 0; i < result.length; i++) {
        temp[result[i].id] = result[i];
      }
        let questionQuery = db.query(query)
          .then((res) => {
            const result2 = res.rows.map((question) => (
              {
                question_id: question.question_id,
                question_body: question.question_body,
                question_date: question.question_date,
                asker_name: question.asker_name,
                question_helpfulness: question.question_helpfulness,
                reported: question.reported,
                answers: temp
              }))
              var resultFinal = {
                product_id: product_id,
                page: parseInt(page, 10),
                count: parseInt(count, 10),
                results: result2,
              };
              return resultFinal;
          })
          return questionQuery;
    })

  return queryResult;

}

exports.getAllAnswers = (params) => {
  const question_id = params.question_id;
  const page = params.page;
  const count = params.count;
  const offset = (page -1) * count;

  console.log(params);

  const query = (
    `SELECT answers.answer_id, answers.body, answers.date_written AS date, answers.answerer_name, answers.helpful AS helpfulness, json_agg(json_build_object('id', answers_photos.photo_id, 'url', answers_photos.url)) AS photos
    FROM answers
    LEFT JOIN answers_photos ON answers.answer_id=answers_photos.answer_id
    WHERE answers.question_id = 40346
    GROUP BY answers.answer_id
    ORDER BY answers.answer_id
    LIMIT 5 OFFSET 0`
  );

  var result;
  let queryResult = db.query(query)
    .then((res) => {
      const results = res.rows.map((answer) => (
        {
          answer_id: answer.answer_id,
          body: answer.body,
          date: answer.date,
          answerer_name: answer.answerer_name,
          helpfulness: answer.helpfulness,
          photos: answer.photos
        }
      ));
      result = {
        question_id: question_id,
        page: parseInt(page, 10),
        count: parseInt(count, 10),
        results: results,
      };
      return result;
    });
    return queryResult;
};

exports.postNewAnswer = (params) => {
  const question_id = params.question_id;
  const answer_id = params.answer_id;
  const body = params.body;
  const date_written = params.date_written;
  const answerer_name = params.answerer_name;
  const answerer_email = params.answerer_email;
  const url = params.url;
  const query = (
    `INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email)
    VALUES (${question_id}, '${body}', '${date_written}', '${answerer_name}', '${answerer_email}')
    RETURNING *`
  );
  const query2 = (
    `INSERT INTO answers_photos (answer_id, url)
    VALUES (${answer_id}, '${url}')`
  );

  var answerQuery = db.query(query)
    .then((res) => {
      const result = res.rows.map((answer) => ({
        id: answer.answer_id,
      }))

      var answer_id = result[0].id

      const query2 = (
        `INSERT INTO answers_photos (answer_id, url)
        VALUES (${answer_id}, '${url}')
        RETURNING *`
      );

    var photoQuery = db.query(query2)
      .then((res) => {
        console.log(res);
        return res;
      });

    return photoQuery;
    });
  return answerQuery;
};

exports.postNewQuestion = (params) => {
  const product_id = params.product_id;
  const body = params.body;
  const date_written = params.date_written;
  const asker_name = params.asker_name;
  const asker_email = params.asker_email;

  console.log(params);
  const query = (
    `INSERT INTO questions (product_id, body, date_written, asker_name, asker_email)
    VALUES (${product_id}, '${body}', '${date_written}', '${asker_name}', '${asker_email}')
    RETURNING product_id`
  );
  db.query(query)
    .then((res) => {
      return res;
    });
};

exports.setQuestionHelpfulness = (params) => {
  const question_id = params.question_id;
  const query = (
    `UPDATE questions
    SET helpful = helpful + 1
    WHERE id=${question_id}
    RETURNING helpful`
  );
  db.query(query)
    .then((res) => {
      return res;
    });
};

exports.setQuestionReported = (params) => {
  const question_id = params.question_id;
  const query = (
    `UPDATE questions
    SET reported = true
    WHERE id=${question_id}
    RETURNING reported`
  );
  db.query(query)
    .then((res) => {
      return res;
    });
  };

exports.setAnswerHelpfulness = (params) => {
  const answer_id = params.answer_id;
  const query = (
    `UPDATE answers
    SET helpful = helpful + 1
    WHERE answer_id=${answer_id}
    RETURNING helpful`
  );
  db.query(query)
    .then((res) => {
      return res;
    });
};

exports.setAnswerReported = (params) => {
  const answer_id = params.answer_id;
  const query = (
    `UPDATE answers
    SET reported = true
    WHERE answer_id=${answer_id}
    RETURNING reported`
  );
  db.query(query)
    .then((res) => {
      return res;
    });
};
