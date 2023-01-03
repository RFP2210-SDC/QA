const { Client, Pool } = require('pg');

const db = new Client({
  host: 'localhost',
  port: 5432,
  // user: 'tbd',
  // password: 'tbd',
  // database: 'tbd'
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
  const page = params.page || 1;
  const count = params.count || 5;
  const product_id = params.product_id;
  const query = (
    `SELECT questions.id AS question_id, questions.body AS question_body, questions.date_written AS question_date, questions.asker_name, questions.helpful AS question_helpfulness, questions.reported, json_build_object(answers.answer_id, json_build_object('id', answers.answer_id, 'body', answers.body, 'date', answers.date_written, 'answerer_name', answers.answerer_name, 'helpfulness', answers.helpful, 'photos', json_build_array(json_build_object('id', answers_photos.photo_id, 'url', answers_photos.url)))) AS answers
    FROM questions
    INNER JOIN answers ON questions.id=answers.question_id
    LEFT JOIN answers_photos ON answers.answer_id=answers_photos.answer_id
    WHERE questions.product_id = ${product_id}
    ORDER BY question_id
    LIMIT ${count}`
  );
  db.query(query)
    .then((res) => {
      const results = res.rows.map((question) => ({
        question_id: question.question_id,
        question_body: question.question_body,
        question_date: question.question_date,
        asker_name: question.asker_name,
        question_helpfulness: question.question_helpfulness,
        reported: question.reported,
        answers: question.answers
      }));
      const result = {
        product_id: product_id,
        page: parseInt(page, 10),
        count: parseInt(count, 10),
        results: results,
      };
      return result;
    });
};

exports.getAllAnswers = (params) => {
  const question_id = params.question_id;
  const page = params.page || 1;
  const count = params.count || 5;
  const query = (
    `SELECT answers.answer_id, answers.body, answers.date_written AS date, answers.answerer_name, answers.helpful AS helpfulness, json_build_object('id', answers_photos.photo_id, 'url', answers_photos.url) AS photos
    FROM answers JOIN answers_photos ON answers.answer_id=answers_photos.answer_id
    WHERE answers.question_id = ${question_id} ORDER BY answers.answer_id LIMIT ${count}`
  );
  db.query(query)
    .then((res) => {
      const results = res.rows.map((answer) => (
        {
          answer_id: answer.answer_id,
          body: answer.body,
          date: answer.date,
          answerer_name: answer.answerer_name,
          helpfulness: answer.helpfulness,
          photos: [answer.photos]
        }
      ));
      const result = {
        question_id: question_id,
        page: parseInt(page, 10),
        count: parseInt(count, 10),
        results: results,
      };
      return result;
    });
};

exports.postNewAnswer = (params) => {
  const question_id = params.question_id;
  const answer_id = params.answer_id;
  const body = params.body;
  const date_written = params.date_written;
  const answerer_name = params.answerer_name;
  const answerer_email = params.answerer_email;
  const reported = params.reported;
  const helpful = params.helpful;
  const query = (
    `INSERT INTO answers (answer_id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
    VALUES (${answer_id}, ${question_id}, '${body}', '${date_written}', '${answerer_name}', '${answerer_email}', ${reported}, ${helpful})
    RETURNING answer_id`
  );
  // also need to post photos to answers_photos
  db.query(query)
    .then((res) => {
      return res;
    });
};

exports.postNewQuestion = (params) => {
  const id = params.id;
  const product_id = params.product_id;
  const body = params.body;
  const date_written = params.date_written;
  const asker_name = params.asker_name;
  const asker_email = params.asker_email;
  const reported = params.reported;
  const helpful = params.helpful;
  const query = (
    `INSERT INTO questions (id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
    VALUES (${id}, ${product_id}, '${body}', '${date_written}', '${asker_name}', '${asker_email}', ${reported}, ${helpful})
    RETURNING id`
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
