import request from "supertest";

import app from "../server.testing";
import MetricService from "../../services/MetricService"; // the service used by your controller
import HttpException from "../../exceptions/HttpException";

const prefix = "/api/v1";

describe("User CRUD Metric", () => {
  let access_token: string;
  let workspace_id: string;
  let metric_id: string;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("User login to get an access token", async () => {
    const res = await request(app)
      .post(`${prefix}/auth/login`)
      .send({ email: "admin@stageholder.com", password: "demo" });
    expect(res.status).toEqual(200);
    const { access_token: responseToken } = res.body.data;
    access_token = responseToken;
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
  // CREATE METRIC
  // -----------------------------------------------------

  it("User failed create metric, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/metrics`);
    expect(res.status).toEqual(401);
  });

  it("User failed create metric, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create metric", async () => {
    const res = await request(app)
      .post(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to get list metric, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "createMetric").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-metric", type: "numerical" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list metric, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "createMetric").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-metric", type: "numerical" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create metric", async () => {
    const res = await request(app)
      .post(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-metric", type: "numerical" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-metric");
    metric_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ METRIC
  // -----------------------------------------------------

  it("User failed to get list of metric, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/metrics`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list metric, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list metric, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list metric, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of metric", async () => {
    const res = await request(app)
      .get(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail metric, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/metrics/${metric_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail metric, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/metrics/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail metric, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get detail metric, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail metric, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail metric", async () => {
    const res = await request(app)
      .get(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.name", "test-metric");
  });

  // -----------------------------------------------------
  // UPDATE METRIC
  // -----------------------------------------------------
  it("User failed to update metric, unauthorized", async () => {
    const res = await request(app).patch(`${prefix}/metrics/${metric_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to updated metric, not found", async () => {
    const res = await request(app)
      .patch(`${prefix}/metrics/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to update metric, invalid workspace", async () => {
    const res = await request(app)
      .patch(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed to update metric, input error", async () => {
    const res = await request(app)
      .patch(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to update metric, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "updateMetric").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .patch(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-metric" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to update metric, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "updateMetric").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .patch(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-metric" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully update metric, server error", async () => {
    const res = await request(app)
      .patch(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-metric", type: "numerical" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "updated-metric");
  });

  // -----------------------------------------------------
  // DELETE METRIC
  // -----------------------------------------------------

  it("User failed to delete metric, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/metrics/${metric_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted metric, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/metrics/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete metric, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to delete metric, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "deleteMetric").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete metric, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(MetricService, "deleteMetric").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete metric", async () => {
    const res = await request(app)
      .delete(`${prefix}/metrics/${metric_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
