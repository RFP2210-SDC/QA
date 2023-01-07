import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const RPS = 1000;
const scenarios = {};
const scenario = {
  executor: 'ramping-arrival-rate',
  preAllocatedVUs: 300,
  startRate: 0,
  timeUnit: '1s',
  gracefulStop: '1s',
  stages: [
    { target: RPS, duration: '3s' },
    { target: RPS, duration: '27s' },
  ],
};
scenarios[`${RPS}RPS`] = scenario;

export const options = {
  scenarios,
  tags: {
    name: 'postAnswers',
  },
};

export default function () {
  const lastQuestionId = 3518888;
  const questionId = randomIntBetween(0.9*lastQuestionId, lastQuestionId);
  const url = 'http://localhost:3000/answers';
  const payload = JSON.stringify({
    question_id: questionId,
    body: "testBody",
    date_written: new Date().toISOString(),
    answerer_name: "testName",
    answerer_email: "testEmail",
    url: "testUrl"
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.post(url, payload, params);
}