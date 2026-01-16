import type mongoose from "mongoose";

export default interface IRelocation {
  workspace: string;
  fixed_asset: string;
  old_location: mongoose.Schema.Types.ObjectId;
  new_location: string;
  relocated_by: string;
  note: string | null;
}
