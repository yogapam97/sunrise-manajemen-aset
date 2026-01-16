import { getObjectId } from "../../helpers/index";
const workspace_users = [
  {
    user: getObjectId("Stageholder Admin"),
    workspace: getObjectId("Workspace Demo"),
    status: "active",
    role: "admin",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user: getObjectId("John User"),
    workspace: getObjectId("Workspace Demo"),
    status: "active",
    role: "user",
    invited_by: getObjectId("Stageholder Admin"),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    user: getObjectId("Alice Auditor"),
    workspace: getObjectId("Workspace Demo"),
    status: "active",
    role: "auditor",
    invited_by: getObjectId("Stageholder Admin"),
    created_at: new Date(),
    updated_at: new Date(),
  },
];
export default workspace_users;
