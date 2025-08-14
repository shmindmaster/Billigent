import request from 'supertest';
import app from '../../index';

describe('Metrics & Telemetry Snapshot', () => {
  it('returns empty snapshot initially', async () => {
    const res = await request(app).get('/api/strategy/metrics/snapshot');
    expect(res.status).toBe(200);
    expect(res.body.http.count).toBeDefined();
  });

  it('records http_request and op_timing events after evidence access', async () => {
    await request(app).get('/api/strategy/evidence/DEN:PAYERA:CO45/ENC:demo1').expect(200);
    const snapshot = await request(app).get('/api/strategy/metrics/snapshot').expect(200);
    expect(snapshot.body.http.count).toBeGreaterThan(0);
    // operations summary should reflect bundle_build label
    const byOp = snapshot.body.byOperation || {};
    expect(Object.keys(byOp).some(k => k === 'bundle_build')).toBeTruthy();
  });
});
