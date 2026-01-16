// @mui
// theme
import type { ColorSchema } from "src/theme/palette";
import type { StackProps } from "@mui/material/Stack";

import Stack from "@mui/material/Stack";
import ListItemText from "@mui/material/ListItemText";

// utils
import { fNumber } from "src/utils/format-number";

// components
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

interface Props extends StackProps {
  icon: string;
  title: string;
  total: number;
  color?: ColorSchema;
}

export default function AppWidget({ title, total, icon, color = "primary", sx, ...other }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: 3,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        color: "common.white",
        bgcolor: `${color}.dark`,
        ...sx,
      }}
      {...other}
    >
      <ListItemText
        sx={{ ml: 3 }}
        primary={fNumber(total)}
        secondary={title}
        primaryTypographyProps={{
          typography: "h4",
          component: "span",
        }}
        secondaryTypographyProps={{
          color: "inherit",
          component: "span",
          sx: { opacity: 0.64 },
          typography: "subtitle2",
        }}
      />

      <Iconify
        icon={icon}
        sx={{
          width: 112,
          right: -32,
          height: 112,
          opacity: 0.08,
          position: "absolute",
        }}
      />
    </Stack>
  );
}
