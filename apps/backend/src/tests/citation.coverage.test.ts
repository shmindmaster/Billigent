import assert from 'assert';
import request from 'supertest';
import app from '../index';

(async () => {
  const res = await request(app).get('/api/strategy/metrics/citation');
  assert.equal(res.status, 200);
  assert(res.body.normalizedSourceCounts, 'Expected normalizedSourceCounts');
  if (res.body.evidenceSample) {
    const { authoritativePct } = res.body.evidenceSample;
    assert(authoritativePct >= 0 && authoritativePct <= 1, 'authoritativePct within [0,1]');
  }
  console.log('Citation coverage route test passed');
})();
