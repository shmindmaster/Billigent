import request from "supertest";
import assert from "assert";
import app from "../index";

(async () => {
  // Empty snapshot
  const res = await request(app).get("/api/strategy/metrics/snapshot");
  assert.equal(res.status, 200);
  assert.ok(typeof res.body.http.count === "number");

  // Trigger evidence route to generate events
  await request(app)
    .get("/api/strategy/evidence/DEN:PAYERA:CO45/ENC:demo1")
    .expect(200);
  const snapshot = await request(app)
    .get("/api/strategy/metrics/snapshot")
    .expect(200);
  assert.ok(snapshot.body.http.count > 0);
  const byOp = snapshot.body.byOperation || {};
  assert.ok(Object.keys(byOp).some((k) => k === "bundle_build"));
  assert.ok(snapshot.body.citations);
  assert.ok(snapshot.body.citations.byTier || snapshot.body.citations.error);
  console.log("Metrics snapshot test passed");
})();
