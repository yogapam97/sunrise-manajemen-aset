import { Box, Chip, Stack } from "@mui/material";

import Iconify from "src/components/iconify";

import LifecycleListItemLinkButton from "../../lifecycle/LifecycleListItemLinkButton";

type TransitionColumnProps = {
  old_lifecycle: any;
  new_lifecycle: any;
  hide_old?: boolean;
};
export default function TransitionColumn({
  old_lifecycle,
  new_lifecycle,
  hide_old,
}: TransitionColumnProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {!hide_old && (
        <Box>
          {old_lifecycle ? (
            <LifecycleListItemLinkButton label lifecycle={old_lifecycle} />
          ) : (
            <Chip size="small" disabled label="No Transition" />
          )}
        </Box>
      )}
      <Iconify icon="mdi:transfer-right" />
      <LifecycleListItemLinkButton label lifecycle={new_lifecycle} />
    </Stack>
  );
}
