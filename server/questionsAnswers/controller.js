const { getAllQuestions, getAllAnswers, postNewAnswer, postNewQuestion, setQuestionHelpfulness, setQuestionReported, setAnswerHelpfulness, setAnswerReported } = require('../../database/index.js')

module.exports = {
  getQuestions: (req, res) => {
    const { query: { product_id } } = req;
    const { query: { page } } = req;
    const { query: { count } } = req;
    const params = {
      product_id: product_id,
      page: page,
      count: count
    };
    return getAllQuestions(params)
    .then((response) => {
      res.status(200).send(response);
    });

  },
  getAnswers: (req, res) => {
    console.log(req);
    const { query: { question_id } } = req;
    const { query: { page } } = req;
    const { query: { count } } = req;
    const params = {
      question_id: question_id,
      page: page,
      count: count
    };
    return getAllAnswers(params)
    .then((response) => {
      res.status(200).send(response);
    })
  },
  postAnswer: (req, res) => {
    const { body: { question_id } } = req;
    const { body: { body } } = req;
    const { body: { answerer_name } } = req;
    const { body: { answerer_email } } = req;
    const { body: { url } } = req;
    const params = {
      question_id: question_id,
      body: body,
      date_written: new Date().toISOString(),
      answerer_name: answerer_name,
      answerer_email: answerer_email,
      url: url
    }
    const post = postNewAnswer(params);
    res.status(200).send(post);
  },
  postQuestion: (req, res) => {
    console.log(req.body);
    const { body: { product_id } } = req;
    const { body: { body } } = req;
    const { body: { asker_name } } = req;
    const { body: { asker_email } } = req;
    const params = {
      product_id: product_id,
      body: body,
      date_written: new Date().toISOString(),
      asker_name: asker_name,
      asker_email: asker_email,
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

