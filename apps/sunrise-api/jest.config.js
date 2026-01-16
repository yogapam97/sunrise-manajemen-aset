module.exports = {
  roots: ["<rootDir>/src/tests"],
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ['./src/tests/jest.setup.ts'],
  coveragePathIgnorePatterns: [
    "./src/utils/",
    "./src/tests/"
  ],
};
