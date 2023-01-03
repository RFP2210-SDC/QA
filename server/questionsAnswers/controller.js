const { getAllQuestions, getAllAnswers, postNewAnswer, postNewQuestion, setQuestionHelpfulness, setQuestionReported } = require('../../database/index.js')

module.exports = {
  getQuestions: (req, res) => {
    const { query: { product_id } } = req || 2;
    const { query: { page } } = req || 1;
    const { query: { count } } = req || 5;
    const get = getAllQuestions(params);
    res.status(200).send(get);
  },
  getAnswers: (req, res) => {
    const { query: { question_id } } = req || 2;
    const { query: { page } } = req || 1;
    const { query: { count } } = req || 5;
    const get = getAllAnswers(params);
    res.status(200).send(get);
  },
  postAnswer: (req, res) => {
    const { query: { question_id } } = req;
    const { query: { answer_id } } = req;
    const { query: { body } } = req;
    const { query: { date_written } } = req;
    const { query: { answerer_name } } = req;
    const { query: { answerer_email } } = req;
    const { query: { reported } } = req || false;
    const { query: { helpful } } = req || 0;
    const params = {
      question_id: question_id,
      answer_id: answer_id,
      body: body,
      date_written: date_written, // new Date().toISOString(),
      answerer_name: answerer_name,
      answerer_email: answerer_email,
      reported: reported,
      helpful: helpful,
    }
    const post = postNewAnswer(params);
    res.status(200).send(post);
  },
  postQuestion: (req, res) => {
    const { query: { id } } = req;
    const { query: { product_id } } = req;
    const { query: { body } } = req;
    const { query: { date_written } } = req;
    const { query: { asker_name } } = req;
    const { query: { asker_email } } = req;
    const { query: { reported } } = req || false;
    const { query: { helpful } } = req || 0;
    const params = {
      id: id,
      product_id: product_id,
      body: body,
      date_written: date_written // new Date().toISOString(),
      asker_name: asker_name,
      asker_email: asker_email,
      reported: reported,
      helpful: helpful,
    }
    const post = postNewQuestion(params);
    res.status(200).send(post);
  },
  setQuestionHelpful: (req, res) => {
    const { body: { question_id } } = req;
    const params = {
      question_id: question_id,
    }
    const put = setQuestionHelpfulness(params);
    res.status(200).send(put);
  },
  reportQuestion: (req, res) => {
    const { body: { question_id } } = req;
    const params = {
      question_id: question_id,
    }
    const put = setQuestionReported(params);
    res.status(200).send(put);
  },
  setAnswerHelpful: (req, res) => {
    const { body: { answer_id } } = req;
    const params = {
      answer_id: answer_id,
    }
    const put = setAnswerHelpfulness(params);
    res.status(200).send(put);
  },
  reportAnswer: (req, res) => {
    const { body: { answer_id } } = req;
    const params = {
      answer_id: answer_id,
    };
    const put = setAnswerReported(params);
    res.status(200).send(put);
  }
};

