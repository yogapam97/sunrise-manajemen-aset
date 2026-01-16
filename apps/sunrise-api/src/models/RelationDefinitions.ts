export const FixedAssetRelation = [
  "category",
  "placement",
  "location",
  "metric",
  "assignee",
  "hashtags",
];

export const AssessmentRelation = ["fixed_asset", "metric", "monitoredBy"];

export const MutationRelation = ["fixed_asset", "old_location", "new_location", "mutatedBy"];

export const DeploymentRelation = ["fixed_asset", "old_placement", "new_placement", "deployedBy"];

export const AssignmentRelation = ["fixed_asset", "old_assignee", "new_assignee", "assignedBy"];
