// @mui
import type { FC, ReactNode } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import BackButton from "./button/BackButton";
// ----------------------------------------------------------------------

interface PageHeaderProps {
  action?: ReactNode;
  heading?: ReactNode;
  withBackButton?: boolean;
  sx?: any;
}
const PageHeader: FC<PageHeaderProps> = ({ action, heading, sx, withBackButton }) => (
  <Box sx={{ ...sx }}>
    <Stack direction="row" alignItems="center">
      {withBackButton && <BackButton />}
      <Box sx={{ flexGrow: 1 }}>
        {/* HEADING */}
        {heading && <>{heading}</>}
      </Box>

      {action && (
        <Stack direction="row" alignItems="center">
          {action}
        </Stack>
      )}
    </Stack>
  </Box>
);

export default PageHeader;
