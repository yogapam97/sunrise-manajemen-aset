import { getObjectId } from "../../helpers/index";
const users = [
  {
    _id: getObjectId("Stageholder Admin"),
    name: "Stageholder Admin",
    username: "stageholder_admin",
    email: "admin@stageholder.com",
    avatar: "",
    password: "$2a$12$KjA32iVFQtUyN2r.P/0mneJ5/FxSDVGpcAsC0URzO8LxO0Rxos6US",
    role: "admin",
    default_workspace: getObjectId("Stageholder Demo"),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: getObjectId("John User"),
    name: "John User",
    username: "user_john",
    email: "userjohn@example.com",
    avatar: "",
    password: "$2b$10$aSKJbf9H1sPHJEzdnOX6LuozpXJk/rAmKM0XO8aBoqcU3mMMis2ri",
    role: "user",
    default_workspace: getObjectId("Stageholder Demo"),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    _id: getObjectId("Alice Auditor"),
    name: "Alice Auditor",
    username: "auditor_alice",
    email: "auditoralice@example.com",
    avatar: "",
    password: "$2b$10$aSKJbf9H1sPHJEzdnOX6LuozpXJk/rAmKM0XO8aBoqcU3mMMis2ri",
    role: "auditor",
    default_workspace: getObjectId("Stageholder Demo"),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default users;
