import request from "supertest";

import app from "../server.testing";
import GoalService from "../../services/GoalService";
import HttpException from "../../exceptions/HttpException";

const prefix = "/api/v1";

describe("User CRUD Goal", () => {
  let access_token: string;
  let workspace_id: string;
  let goal_id: string;
  let metric_id: string;

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
  // CREATE GOAL
  // -----------------------------------------------------

  it("User failed create goal, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/goals`);
    expect(res.status).toEqual(401);
  });

  it("User failed create goal, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/goals`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create goal", async () => {
    const res = await request(app)
      .post(`${prefix}/goals`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to create goal, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "createGoal").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/goals`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-goal", metric: metric_id, aggregate: "sum" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to create goal, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "createGoal").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/goals`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-goal", metric: metric_id, aggregate: "sum" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create goal", async () => {
    const res = await request(app)
      .post(`${prefix}/goals`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-goal", metric: metric_id, aggregate: "sum" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-goal");
    goal_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ GOAL
  // -----------------------------------------------------

  it("User failed to get list of goal, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/goals`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list goal, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/goals`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list goal, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/goals`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list goal, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/goals`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of goal", async () => {
    const res = await request(app)
      .get(`${prefix}/goals`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail goal, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/goals/${goal_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail goal, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/goals/random-id`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.body).toHaveProperty("message", "Invalid Goal ID");
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail goal, does not exist", async () => {
    const res = await request(app)
      .get(`${prefix}/goals/64b4f19ca7a5dfdb422b0d72`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Goal does not exist");
  });

  it("User failed to get detail goal, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get detail goal, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail goal, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail goal", async () => {
    const res = await request(app)
      .get(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.name", "test-goal");
  });

  // -----------------------------------------------------
  // UPDATE GOAL
  // -----------------------------------------------------
  it("User failed to update goal, unauthorized", async () => {
    const res = await request(app).patch(`${prefix}/goals/${goal_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to update goal, not found", async () => {
    const res = await request(app)
      .patch(`${prefix}/goals/random-id`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-goal", metric: metric_id, aggregate: "count" });
    expect(res.body).toHaveProperty("message", "Invalid Goal ID");
    expect(res.status).toEqual(400);
  });

  it("User failed to update goal, does not exist", async () => {
    const res = await request(app)
      .patch(`${prefix}/goals/64b4f19ca7a5dfdb422b0d72`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-goal", metric: metric_id, aggregate: "count" });

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Goal does not exist");
  });

  it("User failed to update goal, invalid workspace", async () => {
    const res = await request(app)
      .patch(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed update goal", async () => {
    const res = await request(app)
      .patch(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to update goal, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "updateGoal").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .patch(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-goal", metric: metric_id, aggregate: "count" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to update goal, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "updateGoal").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .patch(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-goal", metric: metric_id, aggregate: "count" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success update goal", async () => {
    const res = await request(app)
      .patch(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-goal", metric: metric_id, aggregate: "count" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "updated-goal");
    expect(res.body).toHaveProperty("data.aggregate", "count");
  });

  // -----------------------------------------------------
  // DELETE GOAL
  // -----------------------------------------------------

  it("User failed to delete goal, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/goals/${goal_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted goal, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/goals/random-id`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.body).toHaveProperty("message", "Invalid Goal ID");
    expect(res.status).toEqual(400);
  });

  it("User failed to delete fixed asset, does not exist", async () => {
    const res = await request(app)
      .delete(`${prefix}/goals/64b4f19ca7a5dfdb422b0d72`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Goal does not exist");
  });

  it("User failed to delete goal, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to delete goal, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "deleteGoal").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete goal, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(GoalService, "deleteGoal").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete goal", async () => {
    const res = await request(app)
      .delete(`${prefix}/goals/${goal_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
