import request from "supertest";

import app from "../server.testing";
import CategoryService from "../../services/CategoryService"; // the service used by your controller
import HttpException from "../../exceptions/HttpException";

const prefix = "/api/v1";

describe("User CRUD Category", () => {
  let access_token: string;
  let workspace_id: string;
  let category_id: string;

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
  // CREATE CATEGORY
  // -----------------------------------------------------

  it("User failed create category, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/categories`);
    expect(res.status).toEqual(401);
  });

  it("User failed create category, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/categories`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create category", async () => {
    const res = await request(app)
      .post(`${prefix}/categories`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to get list category, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "createCategory").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/categories`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-category" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list category, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "createCategory").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/categories`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-category" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create category", async () => {
    const res = await request(app)
      .post(`${prefix}/categories`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-category" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-category");
    category_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ CATEGORY
  // -----------------------------------------------------

  it("User failed to get list of category, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/categories`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list category, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/categories`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list category, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/categories`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list category, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/categories`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of category", async () => {
    const res = await request(app)
      .get(`${prefix}/categories`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail category, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/categories/${category_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail category, not found", async () => {
    const res = await request(app)
      .get(`${prefix}/categories/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to get detail category, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get detail category, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail category, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail category", async () => {
    const res = await request(app)
      .get(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.name", "test-category");
  });

  // -----------------------------------------------------
  // UPDATE CATEGORY
  // -----------------------------------------------------
  it("User failed to update category, unauthorized", async () => {
    const res = await request(app).patch(`${prefix}/categories/${category_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to updated category, not found", async () => {
    const res = await request(app)
      .patch(`${prefix}/categories/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to update category, invalid workspace", async () => {
    const res = await request(app)
      .patch(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed to update category, input error", async () => {
    const res = await request(app)
      .patch(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to update category, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "updateCategory").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .patch(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-category" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to update category, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "updateCategory").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .patch(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-category" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully update category, server error", async () => {
    const res = await request(app)
      .patch(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-category" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "updated-category");
  });

  // -----------------------------------------------------
  // DELETE CATEGORY
  // -----------------------------------------------------

  it("User failed to delete category, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/categories/${category_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to deleted category, not found", async () => {
    const res = await request(app)
      .delete(`${prefix}/categories/random-id`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
  });

  it("User failed to delete category, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to delete category, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "deleteCategory").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete category, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(CategoryService, "deleteCategory").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete category", async () => {
    const res = await request(app)
      .delete(`${prefix}/categories/${category_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
