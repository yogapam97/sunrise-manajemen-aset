import request from "supertest";

import app from "../server.testing";
import HttpException from "../../exceptions/HttpException";
import AssessmentService from "../../services/AssessmentService";

const prefix = "/api/v1";

describe("User CRD Assessment", () => {
  let access_token: string;
  let workspace_id: string;
  let fixed_asset_id: string;
  let assessment_id: string;

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

  it("User success create metric", async () => {
    const res = await request(app)
      .post(`${prefix}/metrics`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-metric", type: "numerical" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-metric");
  });

  // -----------------------------------------------------
  // CREATE ASSESSMENT
  // -----------------------------------------------------

  it("User failed create assessment, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/assessments`);
    expect(res.status).toEqual(401);
  });

  it("User failed create assessment, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/assessments`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create assessment", async () => {
    const res = await request(app)
      .post(`${prefix}/assessments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to create assessment, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(AssessmentService, "createAssessment").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/assessments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, value: 8, note: "test-note" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to create assessment, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(AssessmentService, "createAssessment").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/assessments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, value: 8, note: "test-note" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create assessment", async () => {
    const res = await request(app)
      .post(`${prefix}/assessments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ fixed_asset: fixed_asset_id, value: 8, note: "test-note" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.note", "test-note");
    assessment_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ ASSESSMENT
  // -----------------------------------------------------

  it("User failed to get list of assessment, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/assessments`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list assessment, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/assessments`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list assessment, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(AssessmentService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/assessments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list assessment, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(AssessmentService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/assessments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of assessment", async () => {
    const res = await request(app)
      .get(`${prefix}/assessments`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail assessment, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/assessments/${assessment_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail assessment, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/assessments/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail assessment, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/assessments/${assessment_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get detail assessment, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(AssessmentService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/assessments/${assessment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail assessment, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(AssessmentService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/assessments/${assessment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail assessment", async () => {
    const res = await request(app)
      .get(`${prefix}/assessments/${assessment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.note", "test-note");
  });

  // -----------------------------------------------------
  // DELETE ASSESSMENT
  // -----------------------------------------------------

  it("User failed to delete assessment, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/assessments/${assessment_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted assessment, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/assessments/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete assessment, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/assessments/${assessment_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to delete assessment, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(AssessmentService, "deleteAssessment").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/assessments/${assessment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete assessment, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(AssessmentService, "deleteAssessment").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/assessments/${assessment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete assessment", async () => {
    const res = await request(app)
      .delete(`${prefix}/assessments/${assessment_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
