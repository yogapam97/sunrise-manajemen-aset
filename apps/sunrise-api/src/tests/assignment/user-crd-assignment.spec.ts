import request from "supertest";

import app from "../server.testing";
import HttpException from "../../exceptions/HttpException";
import AssignmentService from "../../services/AssignmentService";

const prefix = "/api/v1";

describe("User CRD Assignment", () => {
  let access_token: string;
  let workspace_id: string;
  let fixed_asset_id: string;
  let member_id: string;
  let assignment_id: string;

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

  it("User success invite member", async () => {
    const res = await request(app)
      .post(`${prefix}/workspaces/${workspace_id}/invite`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ email: "test@email.com", role: "admin" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.email", "test@email.com");
    member_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // CREATE ASSIGNMENT
  // -----------------------------------------------------

  it("User failed create assignment, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/assignments`);
    expect(res.status).toEqual(401);
  });

  it("User failed create assignment, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/assignments`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create assignment", async () => {
    const res = await request(app)
      .post(`${prefix}/assignments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to get create assignment, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(AssignmentService, "createAssignment").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/assignments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, new_assignee: member_id, note: "test-note" });
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get create assignment, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(AssignmentService, "createAssignment").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/assignments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, new_assignee: member_id, note: "test-note" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create assignment", async () => {
    const res = await request(app)
      .post(`${prefix}/assignments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, new_assignee: member_id, note: "test-note" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.note", "test-note");
    assignment_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ ASSIGNMENT
  // -----------------------------------------------------

  it("User failed to get list of assignment, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/assignments`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list assignment, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/assignments`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to list assignment, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(AssignmentService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/assignments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to list assignment, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(AssignmentService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/assignments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of assignment", async () => {
    const res = await request(app)
      .get(`${prefix}/assignments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail assignment, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/assignments/${assignment_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail assignment, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/assignments/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail assignment, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/assignments/${assignment_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to detail assignment, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(AssignmentService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/assignments/${assignment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to detail assignment, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(AssignmentService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/assignments/${assignment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail assignment", async () => {
    const res = await request(app)
      .get(`${prefix}/assignments/${assignment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.note", "test-note");
  });

  // -----------------------------------------------------
  // DELETE ASSIGNMENT
  // -----------------------------------------------------

  it("User failed to delete assignment, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/assignments/${assignment_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted assignment, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/assignments/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete assignment, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/assignments/${assignment_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to detail assignment, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(AssignmentService, "deleteAssignment").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/assignments/${assignment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to detail assignment, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(AssignmentService, "deleteAssignment").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/assignments/${assignment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete assignment", async () => {
    const res = await request(app)
      .delete(`${prefix}/assignments/${assignment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
