import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const RPS = 1;
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
    name: 'getQuestions',
  },
};

export default function () {
  const lastProductId = 1000011;
  const productId = randomIntBetween(0.9*lastProductId, lastProductId);
  const url = `http://localhost:3000/questions/?product_id=${lastProductId}&page=1&count=5`;
  http.get(url);
}