import request from "supertest";

import app from "../server.testing";
import FixedAssetService from "../../services/FixedAssetService"; // the service used by your controller
import HttpException from "../../exceptions/HttpException";

const prefix = "/api/v1";

describe("User CRUD Fixed Asset", () => {
  let access_token: string;
  let workspace_id: string;
  let fixed_asset_id: string;

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
  // CREATE FIXED ASSET
  // -----------------------------------------------------

  it("User failed create fixed asset, unauthorized", async () => {
    const res = await request(app).post(`${prefix}/fixed-assets`);
    expect(res.status).toEqual(401);
  });

  it("User failed create fixed asset, invalid workspace", async () => {
    const res = await request(app)
      .post(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed create fixed asset", async () => {
    const res = await request(app)
      .post(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({
        category: "64b4f19ca7a5dfdb422b0d72",
        location: "64b4f19ca7a5dfdb422b0d72",
        lifecycle: "64b4f19ca7a5dfdb422b0d72",
        hashtags: ["64b4f19ca7a5dfdb422b0d72"],
      });
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User filed to get list fixed asset, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "createFixedAsset").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .post(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-fixed-asset" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list fixed asset, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "createFixedAsset").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .post(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-fixed-asset" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User success create fixed asset", async () => {
    const res = await request(app)
      .post(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "test-fixed-asset", images: ["test.jpg"] });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "test-fixed-asset");
    fixed_asset_id = res.body.data.id;
  });

  // -----------------------------------------------------
  // READ FIXED ASSET
  // -----------------------------------------------------

  it("User failed to get list of fixed asset, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/fixed-assets`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get list fixed asset, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User filed to get list fixed asset, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "getAll").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get list fixed asset, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "getAll").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully get list of fixed asset", async () => {
    const res = await request(app)
      .get(`${prefix}/fixed-assets`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("User failed to get detail fixed asset, unauthorized", async () => {
    const res = await request(app).get(`${prefix}/fixed-assets/${fixed_asset_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to get detail fixed asset, invalid workspace", async () => {
    const res = await request(app)
      .get(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed to get detail fixed asset, invalid id", async () => {
    const res = await request(app)
      .get(`${prefix}/fixed-assets/random-id`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Fixed Asset ID");
  });

  it("User failed to get detail fixed asset, does not exist", async () => {
    const res = await request(app)
      .get(`${prefix}/fixed-assets/64b4f19ca7a5dfdb422b0d72`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Fixed Asset does not exist");
  });

  it("User filed to get detail fixed asset, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "getById").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .get(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to get detail fixed asset, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "getById").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .get(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully to get detail fixed asset", async () => {
    const res = await request(app)
      .get(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data.name", "test-fixed-asset");
  });

  // -----------------------------------------------------
  // UPDATE FIXED ASSET
  // -----------------------------------------------------
  it("User failed to update fixed asset, unauthorized", async () => {
    const res = await request(app).patch(`${prefix}/fixed-assets/${fixed_asset_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to update fixed asset, invalid workspace", async () => {
    const res = await request(app)
      .patch(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed to update fixed asset, input error", async () => {
    const res = await request(app)
      .patch(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(422);
    expect(res.body).toHaveProperty("success", false);
  });

  it("User failed to update fixed asset, invalid id", async () => {
    const res = await request(app)
      .patch(`${prefix}/fixed-assets/random-id`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-fixed-asset" });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Fixed Asset ID");
  });

  it("User failed to update fixed asset, does not exist", async () => {
    const res = await request(app)
      .patch(`${prefix}/fixed-assets/64b4f19ca7a5dfdb422b0d72`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-fixed-asset" });

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Fixed Asset does not exist");
  });

  it("User filed to update fixed asset, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "updateFixedAsset").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .patch(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-fixed-asset" });

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to update fixed asset, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "updateFixedAsset").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .patch(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-fixed-asset" });

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully update fixed asset, server error", async () => {
    const res = await request(app)
      .patch(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id)
      .send({ name: "updated-fixed-asset" });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("data.name", "updated-fixed-asset");
  });

  // -----------------------------------------------------
  // DELETE FIXED ASSET
  // -----------------------------------------------------

  it("User failed to delete fixed asset, unauthorized", async () => {
    const res = await request(app).delete(`${prefix}/fixed-assets/${fixed_asset_id}`);
    expect(res.status).toEqual(401);
  });

  it("User failed to delete fixed asset, invalid workspace", async () => {
    const res = await request(app)
      .delete(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Workspace");
  });

  it("User failed to delete fixed asset, invalid id", async () => {
    const res = await request(app)
      .delete(`${prefix}/fixed-assets/random-id`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid Fixed Asset ID");
  });

  it("User failed to delete fixed asset, does not exist", async () => {
    const res = await request(app)
      .delete(`${prefix}/fixed-assets/64b4f19ca7a5dfdb422b0d72`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("message", "Fixed Asset does not exist");
  });

  it("User filed to delete fixed asset, error service", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "deleteFixedAsset").mockImplementationOnce(() => {
      throw new HttpException("Test error", 400);
    });

    const res = await request(app)
      .delete(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(400); // Adjust this to match the status code your HttpException results in
  });

  it("User filed to delete fixed asset, error server", async () => {
    // Make the service function throw an error
    jest.spyOn(FixedAssetService, "deleteFixedAsset").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const res = await request(app)
      .delete(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);

    expect(res.status).toEqual(500); // Adjust this to match the status code your HttpException results in
  });

  it("User successfully delete fixed asset", async () => {
    const res = await request(app)
      .delete(`${prefix}/fixed-assets/${fixed_asset_id}`)
      .set("Authorization", `Bearer ${access_token}`)
      .set("X-Workspace-Id", workspace_id);
    expect(res.status).toEqual(200);
  });
});
