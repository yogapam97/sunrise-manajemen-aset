export default interface ICheck {
  workspace: string;
  fixed_asset: string;
  status: "check-in" | "check-out";
  assignee: any;
  is_assignment: boolean;
  location: any;
  is_relocation: boolean;
  check_in_date: Date | null;
  check_due_date: Date | null;
  check_out_date: Date | null;
  checked_by: string;
  note: string | null;
}
