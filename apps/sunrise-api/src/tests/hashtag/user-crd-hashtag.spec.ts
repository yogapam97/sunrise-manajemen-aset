import request from "supertest";

import app from "../server.testing";
import HashtagService from "../../services/HashtagService"; // the service used by your controller
import HttpException from "../../exceptions/HttpException";

const prefix = "/api/v1";

describe("User CRD Hashtag", () => {
  let access_token: string;
  let workspace_id: string;
  let hashtag_id: string;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("User login to get an access token", async () => {
    const res = await request(app)
      .post(`${prefix}/auth/login`)
      .send({ email: "admin@stageholder.com", password: "demo" });
    expect(res.status).toEqual(200);
    const { access_token: thisToken } = res.body.data;
    access_token = thisToken;
  });

  it("User create workspace to get workspace_id", async () => {
    const res = await request(app)
      .post(`${prefix}/workspaces`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "test-workspace", currency: { code: "USD", symbol: "$" } });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    workspace_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // CREATE HASHTAG
  // -----------------------------------------------------

  it("User failed create hashtag, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/hashtags`);
    expect(res.status).toEqual(401);
  });

  it("User failed create hashtag, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/hashtags`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create hashtag", async () => {
    const res = await request(app)
      .post(`${prefix}/hashtags`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to get list hashtag, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(HashtagService, "createHashtag").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/hashtags`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-hashtag" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list hashtag, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(HashtagService, "createHashtag").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/hashtags`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-hashtag" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create hashtag", async () => {
    const res = await request(app)
      .post(`${prefix}/hashtags`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-hashtag" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-hashtag");
    hashtag_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ HASHTAG
  // -----------------------------------------------------

  it("User failed to get list of hashtag, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/hashtags`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list hashtag, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/hashtags`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list hashtag, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(HashtagService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/hashtags`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list hashtag, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(HashtagService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/hashtags`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of hashtag", async () => {
    const res = await request(app)
      .get(`${prefix}/hashtags`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail hashtag, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/hashtags/${hashtag_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail hashtag, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/hashtags/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail hashtag, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/hashtags/${hashtag_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get detail hashtag, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(HashtagService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/hashtags/${hashtag_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail hashtag, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(HashtagService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/hashtags/${hashtag_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail hashtag", async () => {
    const res = await request(app)
      .get(`${prefix}/hashtags/${hashtag_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.name", "test-hashtag");
  });

  // -----------------------------------------------------
  // DELETE HASHTAG
  // -----------------------------------------------------

  it("User failed to delete hashtag, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/hashtags/${hashtag_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted hashtag, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/hashtags/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete hashtag, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/hashtags/${hashtag_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to delete hashtag, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(HashtagService, "deleteHashtag").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/hashtags/${hashtag_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete hashtag, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(HashtagService, "deleteHashtag").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/hashtags/${hashtag_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete hashtag", async () => {
    const res = await request(app)
      .delete(`${prefix}/hashtags/${hashtag_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
