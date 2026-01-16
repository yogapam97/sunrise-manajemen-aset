import { getObjectId } from "../../helpers/index";

const lifecycles = [
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Warehouse"),
    name: "Warehouse",
    description: "Assets currently stored in the warehouse",
    color: "#FF0000",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Deployed"),
    name: "Deployed",
    description: "Assets that have been deployed for use",
    color: "#00FF00",
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Maintenance"),
    name: "Maintenance",
    description: "Assets that are currently under maintenance",
    color: "#0000FF",
    created_at: "2023-01-03T00:00:00Z",
    updated_at: "2023-01-03T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
];

export default lifecycles;
