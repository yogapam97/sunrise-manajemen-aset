import moment from "moment";

import { Stack, Typography } from "@mui/material";

export default function FixedAssetWarrantyView({
  warranty_expire_date,
}: {
  warranty_expire_date: Date | null;
}) {
  if (!warranty_expire_date) {
    return (
      <Typography color="text.secondary" variant="caption">
        No Warranty
      </Typography>
    );
  }
  return (
    <Stack>
      <Typography
        color={
          moment(warranty_expire_date).isBefore(moment(), "day") ? "error.main" : "text.primary"
        }
        variant="body2"
      >
        {moment(warranty_expire_date).format("LL")}
        {moment(warranty_expire_date).isBefore(moment(), "day") && " (Expired)"}
      </Typography>
      <Typography variant="caption">{moment(warranty_expire_date).fromNow()}</Typography>
    </Stack>
  );
}
