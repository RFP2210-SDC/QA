require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/testDb2');

const QASchema = new mongoose.Schema(
  product_id: String,
  results: [{
        question_id: Number,
        question_body: String,
        question_date: String,
        asker_name: String,
        question_helpfulness: Number,
        reported: Boolean,
        answers: {
          id: Number,
          body: String,
          date: String,
          answerer_name: String,
          helpfulness: Number,
          photos: [{
            id: Number,
            url: String,
          }],
        }
      }
  ]
  { timestamps: true }
);

const QuestionsAnswers = mongoose.model('QA', QASchema);

console.log(QuestionsAnswers);