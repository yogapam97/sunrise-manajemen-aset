// describe('Fixed Asset Schema Test', () => {
//   let originalEnv: NodeJS.ProcessEnv;

//   beforeEach(() => {
//     // Store the original process.env
//     originalEnv = process.env;
//   });

//   afterEach(() => {
//     // Restore the original process.env after each test
//     process.env = originalEnv;
//   });

//   it('should throw an error if AUTH_JWT_IMAGE_SECRET is not set', () => {
//     // Temporarily clear process.env
//     delete process.env.AUTH_JWT_IMAGE_SECRET;

//     // Import your schema here.
//     // We're using a dynamic import inside the test case because we need to control when the code is imported.
//     // Since Node.js modules are cached, if we were to import at the top level, we wouldn't be able to change the environment variable before it's used.
//     const schemaPromise = import('../../models/FixedAsset'); // Replace './FixedAssetSchema' with the actual path to your schema file

//     // Jest expects promises that are supposed to reject to be asserted with expect().rejects
//     return expect(schemaPromise).rejects.toThrow('AUTH_JWT_IMAGE_SECRET is not set');
//   });

//   // ...other tests...
// });
