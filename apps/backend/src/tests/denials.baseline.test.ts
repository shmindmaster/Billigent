import request from "supertest";
import assert from "assert";
import app from "../index";

(async () => {
  const res = await request(app).get("/api/denials/baseline");
  assert.equal(res.status, 200);
  assert.ok("totalDenials" in res.body);
  assert.ok(Array.isArray(res.body.topCauses));
  assert.ok(res.body.topCauses.length <= 5);
  console.log("Denials baseline metrics test passed");
})();
