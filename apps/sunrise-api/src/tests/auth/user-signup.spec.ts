import request from "supertest";

import app from "../server.testing";

const prefix = "/api/v1/auth";

const generateRandomEmail = () => {
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${randomString}@test.com`;
};

describe("User Signup", () => {
  it("User registration fails with duplicate username", async () => {
    const res = await request(app)
      .post(`${prefix}/signup`)
      .send({ email: "admin@stageholder.com", password: "pass" });
    expect(res.status).toEqual(422);
  });

  it("User registration success", async () => {
    const email = generateRandomEmail();
    const res = await request(app)
      .post(`${prefix}/signup`)
      .send({ name: "random name", email, password: "pass6cracters" });
    const { body } = res;
    expect(res.status).toEqual(200); // Expect "OK" status code
    expect(body).toHaveProperty("data.access_token");
    expect(body).toHaveProperty("data.refresh_token");
    expect(body).toHaveProperty("data.profile");
    expect(body).toHaveProperty("success", true);
  });
});
