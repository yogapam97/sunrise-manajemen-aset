import type { ILocationItem } from "src/types/location";

import { Card, Stack, Typography, ListItemText, CardActionArea } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify/iconify";

import { useWorkspaceContext } from "src/auth/hooks";

import { LOCATION_ICON } from "../icon-definitions";

type Props = {
  location: ILocationItem;
};

export default function LocationItem({ location }: Props) {
  const { workspace } = useWorkspaceContext();
  const { id, name, address } = location;

  //   const StyledCardActionArea = styled(CardActionArea)(({ theme }) => ({
  //     '&:hover': {
  //       backgroundColor: alpha(theme.palette.primary[theme.palette.mode], 0.2),
  //     },
  //   }));

  return (
    <Card>
      <CardActionArea
        component={RouterLink}
        href={paths.app.location.detail(workspace?.id as string, id as string)}
        sx={{ textDecoration: "none", height: "100%" }}
      >
        <Stack sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Iconify icon={LOCATION_ICON} />

            <ListItemText sx={{ mb: 1 }} primary={name} />
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {address}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
