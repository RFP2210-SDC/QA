import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const RPS = 1000;
const scenarios = {};
const scenario = {
  executor: 'ramping-arrival-rate',
  preAllocatedVUs: 3,
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
    name: 'getAnswers',
  },
};

export default function () {
  const lastQuestionId = 3518888;
  const questionId = randomIntBetween(0.9*lastQuestionId, lastQuestionId);
  const url = `http://localhost:3000/answers?page=1&count=100&question_id=${questionId}`;
  http.get(url);
}