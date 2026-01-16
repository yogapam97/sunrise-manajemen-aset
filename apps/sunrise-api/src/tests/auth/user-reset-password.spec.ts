import request from "supertest";

import app from "../server.testing";

const prefix = "/api/v1/auth";

describe("User Reset Passowrd", () => {
  it("User reset password success", async () => {
    const res = await request(app)
      .post(`${prefix}/reset-password`)
      .send({ email: "admin@stageholder.com" });
    expect(res.status).toEqual(200);
  });

  it("User reset password failed, email not registered", async () => {
    const res = await request(app)
      .post(`${prefix}/reset-password`)
      .send({ email: "random@stageholder.com" });
    expect(res.status).toEqual(422);
  });
});
