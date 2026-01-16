import request from "supertest";

import app from "../server.testing";
import HttpException from "../../exceptions/HttpException";
import RelocationService from "../../services/RelocationService";

const prefix = "/api/v1";

describe("User CRD Relocation", () => {
  let access_token: string;
  let workspace_id: string;
  let fixed_asset_id: string;
  let location_id: string;
  let relocation_id: string;

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

  it("User success create fixed asset", async () => {
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

  it("User success create location", async () => {
    const res = await request(app)
      .post(`${prefix}/locations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-location" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-location");
    location_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // CREATE RELOCATION
  // -----------------------------------------------------

  it("User failed create relocation, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/relocations`);
    expect(res.status).toEqual(401);
  });

  it("User failed create relocation, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/relocations`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create relocation", async () => {
    const res = await request(app)
      .post(`${prefix}/relocations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to create relocation, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(RelocationService, "createRelocation").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/relocations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, new_location: location_id, note: "test-note" });
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to create relocation, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(RelocationService, "createRelocation").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/relocations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, new_location: location_id, note: "test-note" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create relocation", async () => {
    const res = await request(app)
      .post(`${prefix}/relocations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, new_location: location_id, note: "test-note" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.note", "test-note");
    relocation_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ RELOCATION
  // -----------------------------------------------------

  it("User failed to get list of relocation, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/relocations`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list relocation, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/relocations`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list relocation, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(RelocationService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/relocations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list relocation, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(RelocationService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/relocations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of relocation", async () => {
    const res = await request(app)
      .get(`${prefix}/relocations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail relocation, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/relocations/${relocation_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail relocation, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/relocations/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail relocation, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/relocations/${relocation_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get detail relocation, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(RelocationService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/relocations/${relocation_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail relocation, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(RelocationService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/relocations/${relocation_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail relocation", async () => {
    const res = await request(app)
      .get(`${prefix}/relocations/${relocation_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.note", "test-note");
  });

  // -----------------------------------------------------
  // DELETE RELOCATION
  // -----------------------------------------------------

  it("User failed to delete relocation, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/relocations/${relocation_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted relocation, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/relocations/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete relocation, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/relocations/${relocation_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to delete relocation, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(RelocationService, "deleteRelocation").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/relocations/${relocation_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete relocation, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(RelocationService, "deleteRelocation").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/relocations/${relocation_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete relocation", async () => {
    const res = await request(app)
      .delete(`${prefix}/relocations/${relocation_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
