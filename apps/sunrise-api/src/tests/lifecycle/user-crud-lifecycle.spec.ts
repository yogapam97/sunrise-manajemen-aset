import request from "supertest";

import app from "../server.testing";
import LifecycleService from "../../services/LifecycleService"; // the service used by your controller
import HttpException from "../../exceptions/HttpException";

const prefix = "/api/v1";

describe("User CRUD Lifecycle", () => {
  let access_token: string;
  let workspace_id: string;
  let lifecycle_id: string;

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
  // CREATE LIFECYCLE
  // -----------------------------------------------------

  it("User failed create lifecycle, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/lifecycles`);
    expect(res.status).toEqual(401);
  });

  it("User failed create lifecycle, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/lifecycles`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create lifecycle", async () => {
    const res = await request(app)
      .post(`${prefix}/lifecycles`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to get list lifecycle, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "createLifecycle").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/lifecycles`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-lifecycle" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list lifecycle, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "createLifecycle").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/lifecycles`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-lifecycle" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create lifecycle", async () => {
    const res = await request(app)
      .post(`${prefix}/lifecycles`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-lifecycle" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-lifecycle");
    lifecycle_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ LIFECYCLE
  // -----------------------------------------------------

  it("User failed to get list of lifecycle, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/lifecycles`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list lifecycle, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/lifecycles`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list lifecycle, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/lifecycles`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list lifecycle, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/lifecycles`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of lifecycle", async () => {
    const res = await request(app)
      .get(`${prefix}/lifecycles`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail lifecycle, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/lifecycles/${lifecycle_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail lifecycle, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/lifecycles/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail lifecycle, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get detail lifecycle, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail lifecycle, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail lifecycle", async () => {
    const res = await request(app)
      .get(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.name", "test-lifecycle");
  });

  // -----------------------------------------------------
  // UPDATE LIFECYCLE
  // -----------------------------------------------------
  it("User failed to update lifecycle, unauthorized", async () => {
    const res = await request(app).patch(`${prefix}/lifecycles/${lifecycle_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to updated lifecycle, not found", async () => {
    const res = await request(app)
      .patch(`${prefix}/lifecycles/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to update lifecycle, invalid workspace", async () => {
    const res = await request(app)
      .patch(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed to update lifecycle, input error", async () => {
    const res = await request(app)
      .patch(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to update lifecycle, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "updateLifecycle").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .patch(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-lifecycle" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to update lifecycle, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "updateLifecycle").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .patch(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-lifecycle" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully update lifecycle, server error", async () => {
    const res = await request(app)
      .patch(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-lifecycle" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "updated-lifecycle");
  });

  // -----------------------------------------------------
  // DELETE LIFECYCLE
  // -----------------------------------------------------

  it("User failed to delete lifecycle, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/lifecycles/${lifecycle_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted lifecycle, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/lifecycles/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete lifecycle, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to delete lifecycle, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "deleteLifecycle").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete lifecycle, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LifecycleService, "deleteLifecycle").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete lifecycle", async () => {
    const res = await request(app)
      .delete(`${prefix}/lifecycles/${lifecycle_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
