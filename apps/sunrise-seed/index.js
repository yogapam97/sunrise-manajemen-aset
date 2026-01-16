import { resolve } from 'path';
import { Seeder } from 'mongo-seeding';

const config = {
  database: 'mongodb+srv://dev-seed:123@development.rqytt.mongodb.net/stageholder_dev?retryWrites=true&w=majority',
  dropDatabase: true,
};

// Initiate Seeder
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
  resolve('./data'),
  {
    transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
  },
);

seeder
  .import(collections)
  .then(() => {
    console.log('Success');
  })
  .catch((err) => {
    console.log('Error', err);
  });
