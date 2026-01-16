import { getObjectId, getObjectIds } from 'mongo-seeding';

const mapToEntities = (names) => {
  return names.map((name) => {
    const id = getObjectId(name);

    return {
      id,
      name,
    };
  });
};

export default {
  mapToEntities,
  getObjectId,
  getObjectIds,
};