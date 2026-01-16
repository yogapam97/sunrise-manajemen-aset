import { getObjectId } from "../../helpers/index";

const categories = [
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Building"),
    code: "B001",
    name: "Building",
    description:
      "Real estate property like offices, warehouses, manufacturing facilities, etc.",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Machinery & Equipment"),
    code: "M002",
    name: "Machinery & Equipment",
    description: "Production machines, vehicles, office equipment, etc.",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Land"),
    code: "L003",
    name: "Land",
    description: "Undeveloped property or land with no structures on it.",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Furniture & Fixtures"),
    code: "F004",
    name: "Furniture & Fixtures",
    description: "Office furniture, light fixtures, etc.",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Computer Equipment"),
    code: "C005",
    name: "Computer Equipment",
    description: "Servers, desktops, laptops, networking equipment, etc.",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("Software"),
    code: "S006",
    name: "Software",
    description: "Purchased or self-developed software for business use.",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    created_by: getObjectId("Stageholder Admin"),
  },
];

export default categories;
