import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function () {
  const lastQuestionId = 3518888;
  const questionId = randomIntBetween(0.9*lastQuestionId, lastQuestionId);
  const url = 'http://localhost:3000/question/helpful';
  const payload = JSON.stringify({
      question_id: questionId
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.put(url, payload, params);
}
