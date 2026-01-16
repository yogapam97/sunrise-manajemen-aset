import request from "supertest";

import app from "../server.testing";
import HttpException from "../../exceptions/HttpException";
import TransitionService from "../../services/TransitionService";

const prefix = "/api/v1";

describe("User CRD Transition", () => {
  let access_token: string;
  let workspace_id: string;
  let fixed_asset_id: string;
  let lifecycle_id: string;
  let transition_id: string;

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

  it("User success create transition", async () => {
    const res = await request(app)
      .post(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-fixed-asset" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-fixed-asset");
    fixed_asset_id = res.body.data.id;
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
  // CREATE DEPLOYMENT
  // -----------------------------------------------------

  it("User failed create transition, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/transitions`);
    expect(res.status).toEqual(401);
  });

  it("User failed create transition, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/transitions`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create transition", async () => {
    const res = await request(app)
      .post(`${prefix}/transitions`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to get list transition, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(TransitionService, "createTransition").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/transitions`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, new_lifecycle: lifecycle_id, note: "test-note" });
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list transition, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(TransitionService, "createTransition").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/transitions`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, new_lifecycle: lifecycle_id, note: "test-note" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create transition", async () => {
    const res = await request(app)
      .post(`${prefix}/transitions`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, new_lifecycle: lifecycle_id, note: "test-note" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.note", "test-note");
    transition_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ DEPLOYMENT
  // -----------------------------------------------------

  it("User failed to get list of transition, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/transitions`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list transition, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/transitions`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list transition, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(TransitionService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/transitions`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list transition, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(TransitionService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/transitions`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of transition", async () => {
    const res = await request(app)
      .get(`${prefix}/transitions`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail transition, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/transitions/${transition_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail transition, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/transitions/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail transition, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/transitions/${transition_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get detail transition, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(TransitionService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/transitions/${transition_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail transition, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(TransitionService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/transitions/${transition_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail transition", async () => {
    const res = await request(app)
      .get(`${prefix}/transitions/${transition_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.note", "test-note");
  });

  // -----------------------------------------------------
  // DELETE DEPLOYMENT
  // -----------------------------------------------------

  it("User failed to delete transition, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/transitions/${transition_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted transition, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/transitions/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete transition, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/transitions/${transition_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to delete transition, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(TransitionService, "deleteTransition").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/transitions/${transition_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete transition, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(TransitionService, "deleteTransition").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/transitions/${transition_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete transition", async () => {
    const res = await request(app)
      .delete(`${prefix}/transitions/${transition_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
