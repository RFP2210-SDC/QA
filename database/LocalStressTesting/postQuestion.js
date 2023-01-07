import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const RPS = 100;
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
    name: 'postQuestions',
  },
};

export default function () {
  const lastProductId = 1000011;
  const productId = randomIntBetween(0.9*lastProductId, lastProductId);
  const url = 'http://localhost:3000/questions';
  const payload = JSON.stringify({
      product_id: productId,
      body: "testBody",
      date_written: new Date().toISOString(),
      asker_name: "testName",
      asker_email: "testEmail",
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.post(url, payload, params);
}