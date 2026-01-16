import type { IMemberItem } from "src/types/member";

import { initials } from "@dicebear/collection";

import { LoadingButton } from "@mui/lab";
import { Card, Stack, Avatar, ListItemText, CardActionArea } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import useCreateAvatar from "src/hooks/use-create-avatar";

import Label from "src/components/label";

import { useWorkspaceContext } from "src/auth/hooks";

type Props = {
  member: IMemberItem;
  onRemove: (member: IMemberItem) => void;
  onResendInvitation: (member: IMemberItem) => void;
};

export default function MemberItem({ member, onRemove, onResendInvitation }: Props) {
  const { workspace } = useWorkspaceContext();
  const { id, user, role } = member;
  const baseAvatar = useCreateAvatar(initials, {});

  return (
    <Card>
      {member?.invitation_status !== "pending" && (
        <CardActionArea
          component={RouterLink}
          href={paths.app.member.detail(workspace?.id as string, id as string)}
          sx={{ textDecoration: "none", height: "100%" }}
        >
          <Label variant="filled" sx={{ position: "absolute", top: 12, right: 12 }}>
            {role}
          </Label>
          <Stack sx={{ p: 2 }} spacing={2}>
            <Avatar src={baseAvatar(user?.name as string)} />
            <Stack>
              <Stack direction="row" spacing={1} justifyContent="space-between">
                <ListItemText sx={{ mb: 1 }} primary={user?.name} secondary={user?.email} />
              </Stack>
            </Stack>
          </Stack>
        </CardActionArea>
      )}
      {member?.invitation_status === "pending" && (
        <>
          <Label variant="filled" sx={{ position: "absolute", top: 12, right: 12 }}>
            Pending
          </Label>
          <Stack sx={{ p: 2 }} spacing={2}>
            <Stack>
              <Stack direction="row" spacing={1} justifyContent="space-between">
                <ListItemText
                  sx={{ mb: 1 }}
                  primary={member?.email}
                  secondary="Waiting to accept invitation ..."
                />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <LoadingButton
                  color="info"
                  size="small"
                  variant="outlined"
                  onClick={() => onResendInvitation(member)}
                >
                  Resend Invitaion
                </LoadingButton>
                <LoadingButton color="error" size="small" onClick={() => onRemove(member)}>
                  Cancel Invitaion
                </LoadingButton>
              </Stack>
            </Stack>
          </Stack>
        </>
      )}
    </Card>
  );
}
