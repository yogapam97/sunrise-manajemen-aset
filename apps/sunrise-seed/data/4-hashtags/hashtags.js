import { getObjectId } from "../../helpers/index";

const hashtags = [
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("RealEstateAssets"),
    name: "RealEstateAssets",
    description: "Concerns real estate properties as fixed assets.",
    created_at: "2023-01-18T00:00:00.000Z",
    updated_at: "2023-02-24T00:00:00.000Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("MachineryAndEquipment"),
    name: "MachineryAndEquipment",
    description:
      "Posts about various machines and equipment considered as fixed assets.",
    created_at: "2023-01-22T00:00:00.000Z",
    updated_at: "2023-03-12T00:00:00.000Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("LandAssets"),
    name: "LandAssets",
    description: "Discussion around land as a fixed asset.",
    created_at: "2023-01-30T00:00:00.000Z",
    updated_at: "2023-02-28T00:00:00.000Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("OfficeFurniture"),
    name: "OfficeFurniture",
    description: "Topics related to office furniture as a fixed asset.",
    created_at: "2023-02-02T00:00:00.000Z",
    updated_at: "2023-03-03T00:00:00.000Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("ITAssets"),
    name: "ITAssets",
    description:
      "Discussion on IT equipment like servers, computers as fixed assets.",
    created_at: "2023-02-10T00:00:00.000Z",
    updated_at: "2023-03-18T00:00:00.000Z",
    created_by: getObjectId("Stageholder Admin"),
  },
  {
    workspace: getObjectId("Workspace Demo"),
    _id: getObjectId("SoftwareAssets"),
    name: "SoftwareAssets",
    description:
      "Talks about purchased or self-developed software as an asset.",
    created_at: "2023-02-15T00:00:00.000Z",
    updated_at: "2023-03-20T00:00:00.000Z",
    created_by: getObjectId("Stageholder Admin"),
  }
];

export default hashtags;
