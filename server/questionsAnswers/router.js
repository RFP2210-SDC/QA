const router = require('express').Router();
// const config = require('../config.js');

const QAController = require('./controller.js');

router.get('/questions', QAController.getQuestions);
router.get('/answers', QAController.getAnswers);
router.post('/questions', QAController.postQuestion);
router.post('/answers', QAController.postAnswer);
router.put('/question/helpful', QAController.setQuestionHelpful);
router.put('/question/report', QAController.reportQuestion);
router.put('/answer/helpful', QAController.setAnswerHelpful);
router.put('/answer/report', QAController.reportAnswer);


module.exports = router;
