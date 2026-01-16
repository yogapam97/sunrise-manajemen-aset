import type mongoose from "mongoose";

export default interface IAssignment {
  workspace: string;
  fixed_asset: string;
  old_assignee: mongoose.Schema.Types.ObjectId;
  new_assignee: string;
  assigned_by: string;
  note: string | null;
}
