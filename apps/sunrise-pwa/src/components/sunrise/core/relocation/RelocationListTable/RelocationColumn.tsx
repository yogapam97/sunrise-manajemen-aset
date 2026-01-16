import { Box, Chip, Stack } from "@mui/material";

import Iconify from "src/components/iconify";

import LocationListItemLinkButton from "../../location/LocationListItemLinkButton";

type RelocationColumnProps = {
  old_location: any;
  new_location: any;
  hide_old?: boolean;
};
export default function RelocationColumn({
  old_location,
  new_location,
  hide_old,
}: RelocationColumnProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={!hide_old ? "space-between" : "start"}
      spacing={1}
    >
      {!hide_old && (
        <Box sx={{ width: 300 }}>
          {old_location ? (
            <LocationListItemLinkButton location={old_location} />
          ) : (
            <Chip size="small" disabled label="No Relocation" />
          )}
        </Box>
      )}
      <Iconify icon="mdi:transfer-right" />
      <Box sx={{ width: 300 }}>
        <LocationListItemLinkButton location={new_location} />
      </Box>
    </Stack>
  );
}
