import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export default function () {
  const lastAnswerId = 6879206;
  const answerId = randomIntBetween(0.9*lastAnswerId, lastAnswerId);
  const url = 'http://localhost:3000/answer/helpful';
  const payload = JSON.stringify({
      answer_id: answerId
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.put(url, payload, params);
}