import { getObjectId } from "../../helpers/index";

const locations = [
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Headquarters"),
    name: "Headquarters",
    address: "123 Main St, Anytown, USA",
    description: "Our main office",
    created_at: "2023-01-10T00:00:00Z",
    updated_at: "2023-01-15T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Branch Office"),
    name: "Branch Office",
    address: "456 Oak St, Othertown, USA",
    description: "Our branch office",
    created_at: "2023-01-18T00:00:00Z",
    updated_at: "2023-01-22T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Remote Office"),
    name: "Remote Office",
    address: "789 Pine St, Somewhere, USA",
    description: "Our remote office",
    created_at: "2023-01-25T00:00:00Z",
    updated_at: "2023-01-30T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
];

export default locations;
