import request from "supertest";

import app from "../server.testing";
import HttpException from "../../exceptions/HttpException";
import WorkspaceService from "../../services/WorkspaceService";

const prefix = "/api/v1";

describe("User CRUD Member", () => {
  let access_token: string;
  let workspace_id: string;
  let member_id: string;

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
  // CREATE WORKSPACE MEMBER
  // -----------------------------------------------------

  it("User failed invite member, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/workspaces/${workspace_id}/invite`);
    expect(res.status).toEqual(401);
  });

  it("User failed invite member, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/workspaces/random/invite`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ email: "test@email.com" });

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace ID");
  });

  it("User failed invite member", async () => {
    const res = await request(app)
      .post(`${prefix}/workspaces/${workspace_id}/invite`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User failed to invite workspace member, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "invite").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/workspaces/${workspace_id}/invite`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ email: "test@email.com", role: "admin" });
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User failed to invite workspace member, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "invite").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/workspaces/${workspace_id}/invite`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ email: "test@email.com", role: "admin" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
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
  // READ WORKSPACE MEMBER
  // -----------------------------------------------------

  it("User failed to get list of member, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/workspaces/${workspace_id}/members`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list member, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/workspaces/random-workspace/members`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace ID");
  });

  it("User failed to get list workspace member, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "getAllMember").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}/members`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User failed to get list workspace member, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "getAllMember").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}/members`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of member", async () => {
    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}/members`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail member, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/workspaces/${workspace_id}/members/${member_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail member, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}/members/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail member, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/workspaces/random-workspace/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace ID");
  });

  it("User failed to get detail workspace member, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "getMemberById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User failed to get detail workspace member, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "getMemberById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail member", async () => {
    const res = await request(app)
      .get(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.email", "test@email.com");
  });

  // -----------------------------------------------------
  // UPDATE WORKSPACE MEMBER
  // -----------------------------------------------------
  it("User failed to update member, unauthorized", async () => {
    const res = await request(app).patch(
      `${prefix}/workspaces/${workspace_id}/members/${member_id}`
    );
    expect(res.status).toEqual(401);
  });

  it("User failed to updated member, not found", async () => {
    const res = await request(app)
      .patch(`${prefix}/workspaces/${workspace_id}/members/random-id`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ role: "admin" });
    expect(res.status).toEqual(400);
  });

  it("User failed to update member, invalid workspace", async () => {
    const res = await request(app)
      .patch(`${prefix}/workspaces/random-workspace/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ role: "admin" });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace ID");
  });

  it("User failed to update workspace member, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "updateMember").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .patch(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ role: "user" });
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User failed update member", async () => {
    const res = await request(app)
      .patch(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(422);
  });

  it("User failed to update workspace member, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "updateMember").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .patch(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ role: "user" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success update member", async () => {
    const res = await request(app)
      .patch(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send({ role: "user" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.role", "user");
  });

  // -----------------------------------------------------
  // DELETE WORKSPACE MEMBER
  // -----------------------------------------------------

  it("User failed to delete member, unauthorized", async () => {
    const res = await request(app).delete(
      `${prefix}/workspaces/${workspace_id}/members/${member_id}`
    );
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted member, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/workspaces/${workspace_id}/members/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete member, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/workspaces/random-workspace/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace ID");
  });

  it("User failed to delete workspace member, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "deleteMember").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User failed to delete workspace member, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(WorkspaceService, "deleteMember").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete member", async () => {
    const res = await request(app)
      .delete(`${prefix}/workspaces/${workspace_id}/members/${member_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(200);
  });
});
