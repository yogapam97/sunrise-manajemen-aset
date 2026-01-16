import type mongoose from "mongoose";

export default interface IOperationGroup {
  workspace: mongoose.Schema.Types.ObjectId;
  name: string;
  code: string;
  is_audit: boolean;
  is_assignment: boolean;
  is_relocation: boolean;
  is_transition: boolean;
  description: string | null;
  created_by: string;
}
