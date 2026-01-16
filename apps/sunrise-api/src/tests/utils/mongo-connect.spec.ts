// Import necessary dependencies
import mongoConnect from "../../utils/mongoConnect";

describe("Test Mongo Connect Utils", () => {
  let originalMongoUri: string | undefined;

  // Save the original MONGODB_URI before each test
  beforeEach(() => {
    originalMongoUri = process.env.MONGODB_URI;
  });

  // Restore the original MONGODB_URI after each test
  afterEach(() => {
    process.env.MONGODB_URI = originalMongoUri;
  });

  it("throws an error when MONGODB_URI is not defined", async () => {
    // Temporarily delete the MONGODB_URI for this test
    delete process.env.MONGODB_URI;

    try {
      // Attempt to establish the mongoose connection
      await mongoConnect();
    } catch (error: any) {
      expect(error.message).toBe("MONGODB_URI not defined");
    }
  });
});
