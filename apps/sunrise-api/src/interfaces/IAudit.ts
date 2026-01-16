import type mongoose from "mongoose";

export default interface IAudit {
  workspace: string;
  fixed_asset: string;
  metric: mongoose.Schema.Types.ObjectId;
  value: string;
  audited_by: string;
  note: string | null;
}
