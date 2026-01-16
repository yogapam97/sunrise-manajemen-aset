import Link from "next/link";
import { initials } from "@dicebear/collection";

import { LoadingButton } from "@mui/lab";
import { Box, Card, Stack, Avatar, Button, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import useCreateAvatar from "src/hooks/use-create-avatar";

import Iconify from "src/components/iconify";
import Label from "src/components/label/label";

import { useAuthContext } from "src/auth/hooks";

import { VERIFIED_ICON } from "../icon-definitions";
import { useVerifyEmail } from "../../hook/useAuth";

export default function ProfileCard() {
  const { user } = useAuthContext();
  const createAvatar = useCreateAvatar(initials, { backgroundColor: ["000"] });
  const verifyEmailMutation = useVerifyEmail({});

  const handleResendVericiationEmail = async () => {
    try {
      verifyEmailMutation.mutate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 2 }} variant="outlined">
      <Stack spacing={2}>
        <Box
          sx={{
            p: 4,
            width: 1,
            flexGrow: 1,
            minHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{ height: 150, width: 150 }}
            src={user?.avatar ? user?.avatar : createAvatar(user?.name)}
          />
        </Box>
        <Stack sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6">{user?.name}</Typography>
            {user?.email_verified && <Iconify icon={VERIFIED_ICON} color="info.main" />}
          </Stack>
          <Typography variant="body2" color="textSecondary">
            {user?.email}
          </Typography>
        </Stack>
        <Box>
          {user?.email_verified ? (
            <Label color="info">Email Verified</Label>
          ) : (
            <Stack spacing={1}>
              <Box>
                <Label color="warning">Email Not Verified</Label>
              </Box>
              <Box>
                {!verifyEmailMutation.isSuccess ? (
                  <LoadingButton
                    size="small"
                    variant="text"
                    loading={verifyEmailMutation.isLoading}
                    loadingIndicator="Sending verification email..."
                    color="info"
                    onClick={handleResendVericiationEmail}
                  >
                    <Typography variant="caption">Resend Verification Email</Typography>
                  </LoadingButton>
                ) : (
                  <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                    Verification Email Sent! Check your email
                  </Typography>
                )}
              </Box>
            </Stack>
          )}
        </Box>
        <Stack spacing={1}>
          <Button component={Link} href={paths.profile.edit} variant="contained" fullWidth>
            Edit Profile
          </Button>
          <Button component={Link} href={paths.profile.edit} variant="outlined" fullWidth>
            Logout
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
