import request from "supertest";

import app from "../server.testing";

const prefix = "/api/v1/auth";

describe("User verify email", () => {
  it("User verify email success", async () => {
    const res = await request(app)
      .post(`${prefix}/verify-email`)
      .send({ email: "admin@stageholder.com" });
    expect(res.status).toEqual(200);
  });

  it("User verify email failed, email not registered", async () => {
    const res = await request(app)
      .post(`${prefix}/verify-email`)
      .send({ email: "random@stageholder.com" });
    expect(res.status).toEqual(422);
  });
});
