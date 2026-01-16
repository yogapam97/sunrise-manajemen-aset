import request from "supertest";

import app from "../server.testing";
import HttpException from "../../exceptions/HttpException";
import WorkspaceService from "../../services/WorkspaceService";

const prefix = "/api/v1";

describe("User CRUD Workspace", () => {
  let access_token: string;
  let workspace_id: string;

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

  // -----------------------------------------------------
  // CREATE WORKSPACE
  // -----------------------------------------------------

  it("User failed create workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/workspaces`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User failed create workspace, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/workspaces`);
    expect(res.status).toEqual(401);
  });

  it("User filed to get create workspace, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "createWorkspace").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/workspaces`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "test-workspace", currency: { code: "USD", symbol: "$" } });
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get create workspace, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "createWorkspace").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/workspaces`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "test-workspace", currency: { code: "USD", symbol: "$" } });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/workspaces`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "test-workspace", currency: { code: "USD", symbol: "$" } });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-workspace");
    expect(res.body).toHaveProperty("data.currency.code", "USD");
    workspace_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ WORKSPACE
  // -----------------------------------------------------

  it("User failed to get list of workspace, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/workspaces`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list workspace, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/workspaces`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User failed to get list workspace, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/workspaces`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/workspaces`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail workspace, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/workspaces/${workspace_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail workspace, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/workspaces/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail workspace, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User failed to get detail workspace, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.name", "test-workspace");
  });

  // -----------------------------------------------------
  // UPDATE WORKSPACE
  // -----------------------------------------------------
  it("User failed to update workspace, unauthorized", async () => {
    const res = await request(app).patch(`${prefix}/workspaces/${workspace_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to updated workspace, not found", async () => {
    const res = await request(app)
      .patch(`${prefix}/workspaces/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to update workspace, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "updateWorkspace").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .patch(`${prefix}/workspaces/${workspace_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "updated-workspace", currency: { code: "IDR", symbol: "Rp" } });
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User failed to update workspace, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "updateWorkspace").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .patch(`${prefix}/workspaces/${workspace_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "updated-workspace", currency: { code: "IDR", symbol: "Rp" } });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success update workspace", async () => {
    const res = await request(app)
      .patch(`${prefix}/workspaces/${workspace_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ name: "updated-workspace", currency: { code: "IDR", symbol: "Rp" } });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "updated-workspace");
    expect(res.body).toHaveProperty("data.currency.code", "IDR");
  });

  // -----------------------------------------------------
  // DELETE WORKSPACE
  // -----------------------------------------------------

  it("User failed to delete workspace, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/workspaces/${workspace_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted workspace, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/workspaces/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete workspace, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "deleteWorkspace").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/workspaces/${workspace_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User failed to delete workspace, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "deleteWorkspace").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/workspaces/${workspace_id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/workspaces/${workspace_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(200);
  });
});
