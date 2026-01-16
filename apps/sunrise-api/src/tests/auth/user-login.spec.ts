import request from "supertest";

import app from "../server.testing";
import AuthService from "../../services/AuthService";
import HttpException from "../../exceptions/HttpException";

const prefix = "/api/v1/auth";

const generateRandomEmail = () => {
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${randomString}@test.com`;
};

describe("User Login", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("User login fails with incorrect form", async () => {
    const res = await request(app).post(`${prefix}/login`);
    expect(res.status).toEqual(422); // Expect "Unauthorized" status code
  });

  it("User login fails with incorrect credentials", async () => {
    const res = await request(app)
      .post(`${prefix}/login`)
      .send({ email: "user@user.com", password: "wrong" });
    expect(res.status).toEqual(401); // Expect "Unauthorized" status code
  });

  it("User filed to login, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(AuthService, "login").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/login`)
      .send({ email: "admin@stageholder.com", password: "demo" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to login, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(AuthService, "login").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/login`)
      .send({ email: "admin@stageholder.com", password: "demo" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User login succeeds with correct credentials", async () => {
    const res = await request(app)
      .post(`${prefix}/login`)
      .send({ email: "admin@stageholder.com", password: "demo" });
    const { body } = res;
    expect(res.status).toEqual(200); // Expect "OK" status code
    expect(body).toHaveProperty("data.access_token");
    expect(body).toHaveProperty("data.refresh_token");
    expect(body).toHaveProperty("data.profile");
    expect(body).toHaveProperty("success", true);
  });

  it("User registration fails with duplicate username", async () => {
    const res = await request(app)
      .post(`${prefix}/signup`)
      .send({ email: "admin@stageholder.com", password: "pass" });
    expect(res.status).toEqual(422);
  });

  it("User filed to registration, error service", async () => {
    const email = generateRandomEmail();
    // Make the service function throw an error
    jest.spyOn(AuthService, "signup").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/signup`)
      .send({ name: "random name", email, password: "pass6cracters" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to registration, error server", async () => {
    const email = generateRandomEmail();
    // Make the service function throw an error
    jest.spyOn(AuthService, "signup").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/signup`)
      .send({ name: "random name", email, password: "pass6cracters" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
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
