import type mongoose from "mongoose";

export default interface ITransition {
  workspace: string;
  fixed_asset: string;
  old_lifecycle: mongoose.Schema.Types.ObjectId;
  new_lifecycle: string;
  transitioned_by: string;
  note: string | null;
}
