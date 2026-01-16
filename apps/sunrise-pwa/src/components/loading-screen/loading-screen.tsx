// @mui
import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

// ----------------------------------------------------------------------

interface LoadingScreenProps extends BoxProps {
  sx?: BoxProps["sx"];
  message?: string;
}
export default function LoadingScreen({
  message = "Loading ...",
  sx,
  ...other
}: LoadingScreenProps) {
  return (
    <Box
      sx={{
        px: 5,
        width: 1,
        flexGrow: 1,
        minHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        ...sx,
      }}
      {...other}
    >
      {message && (
        <Box>
          <Typography variant="caption">{message}</Typography>
        </Box>
      )}
      <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
    </Box>
  );
}
