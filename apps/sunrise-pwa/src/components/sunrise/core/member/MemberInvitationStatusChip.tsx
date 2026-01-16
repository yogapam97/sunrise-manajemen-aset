import Label from "src/components/label";

const MemberInvitationStatusChip = ({ status }: { status: string }) => {
  let color = "#000";
  switch (status) {
    case "mastered":
      color = "primary.main";
      break;
    case "accepted":
      color = "success.main";
      break;
    case "pending":
      color = "text.disabled";
      break;
    case "draft":
      color = "error.main";
      break;
    default:
      color = "error.main";
      break;
  }

  return <Label sx={{ backgroundColor: color, color: "#fff" }}>{status}</Label>;
};

export default MemberInvitationStatusChip;
