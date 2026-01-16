import type { BoxProps } from "@mui/material/Box";

import { forwardRef } from "react";

import Box from "@mui/material/Box";
// @mui
import Link from "@mui/material/Link";

// routes
import { RouterLink } from "src/routes/components";

import { useSettingsContext } from "../settings";

// ----------------------------------------------------------------------

export interface LogoFullProps extends BoxProps {
  disabledLink?: boolean;
}

const LogoFull = forwardRef<HTMLDivElement, LogoFullProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const { themeMode } = useSettingsContext();
    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = (
      <Box
        component="img"
        src={
          themeMode === "light"
            ? "/logo/Sunrise_Logo-full.png"
            : "/logo/Sunrise_Logo-full-dark.png"
        }
        sx={{ height: 30, cursor: "pointer", ...sx }}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
        {logo}
      </Link>
    );
  }
);

export default LogoFull;
