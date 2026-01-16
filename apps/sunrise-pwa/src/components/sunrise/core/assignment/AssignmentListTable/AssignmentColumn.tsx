import { Box, Chip, Stack } from "@mui/material";

import Iconify from "src/components/iconify";

import MemberListItemLinkButton from "../../member/MemberListItemLinkButton";

type AssignmentColumnProps = {
  old_assignee: any;
  new_assignee: any;
  hide_old?: boolean;
};
export default function AssignmentColumn({
  old_assignee,
  new_assignee,
  hide_old,
}: AssignmentColumnProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={!hide_old ? "space-between" : "start"}
      spacing={1}
    >
      {!hide_old && (
        <Box sx={{ width: 300 }}>
          {old_assignee ? (
            <MemberListItemLinkButton member={old_assignee} />
          ) : (
            <Chip size="small" disabled label="No Assignment" />
          )}
        </Box>
      )}
      <Iconify icon="mdi:transfer-right" />
      <Box sx={{ width: 300 }}>
        <MemberListItemLinkButton member={new_assignee} />
      </Box>
    </Stack>
  );
}
