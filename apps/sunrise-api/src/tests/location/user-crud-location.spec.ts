import request from "supertest";

import app from "../server.testing";
import LocationService from "../../services/LocationService"; // the service used by your controller
import HttpException from "../../exceptions/HttpException";

const prefix = "/api/v1";

describe("User CRUD Location", () => {
  let access_token: string;
  let workspace_id: string;
  let location_id: string;

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
  // CREATE LOCATION
  // -----------------------------------------------------

  it("User failed create location, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/locations`);
    expect(res.status).toEqual(401);
  });

  it("User failed create location, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/locations`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create location", async () => {
    const res = await request(app)
      .post(`${prefix}/locations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to get list location, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "createLocation").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/locations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-location" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list location, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "createLocation").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/locations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-location" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
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
  // READ LOCATION
  // -----------------------------------------------------

  it("User failed to get list of location, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/locations`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list location, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/locations`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list location, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/locations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list location, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/locations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of location", async () => {
    const res = await request(app)
      .get(`${prefix}/locations`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail location, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/locations/${location_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail location, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/locations/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail location, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get detail location, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail location, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail location", async () => {
    const res = await request(app)
      .get(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.name", "test-location");
  });

  // -----------------------------------------------------
  // UPDATE LOCATION
  // -----------------------------------------------------
  it("User failed to update location, unauthorized", async () => {
    const res = await request(app).patch(`${prefix}/locations/${location_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to updated location, not found", async () => {
    const res = await request(app)
      .patch(`${prefix}/locations/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to update location, invalid workspace", async () => {
    const res = await request(app)
      .patch(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed to update location, input error", async () => {
    const res = await request(app)
      .patch(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to update location, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "updateLocation").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .patch(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-location" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to update location, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "updateLocation").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .patch(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-location" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully update location, server error", async () => {
    const res = await request(app)
      .patch(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-location" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "updated-location");
  });

  // -----------------------------------------------------
  // DELETE LOCATION
  // -----------------------------------------------------

  it("User failed to delete location, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/locations/${location_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted location, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/locations/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete location, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to delete location, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "deleteLocation").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete location, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(LocationService, "deleteLocation").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete location", async () => {
    const res = await request(app)
      .delete(`${prefix}/locations/${location_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
