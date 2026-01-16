import { initials } from "@dicebear/collection";

import { Stack, Avatar, Typography } from "@mui/material";

import useCreateAvatar from "src/hooks/use-create-avatar";

type MemberInfoTextProps = {
  member: any;
};

export default function MemberInfoText({ member }: MemberInfoTextProps) {
  const createAvatar = useCreateAvatar(initials, {});
  const { name } = member;
  return (
    <Stack
      spacing={0.5}
      flexShrink={0}
      direction="row"
      alignItems="center"
      sx={{ color: "text.disabled", minWidth: 0 }}
    >
      <Avatar sx={{ height: 20, width: 20 }} src={createAvatar(name)} />
      <Typography variant="caption" noWrap>
        {name}
      </Typography>
    </Stack>
  );
}
