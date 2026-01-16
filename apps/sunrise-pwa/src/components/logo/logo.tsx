import type { BoxProps } from "@mui/material/Box";

import { forwardRef } from "react";

import Box from "@mui/material/Box";
// @mui
import Link from "@mui/material/Link";

// routes
import { RouterLink } from "src/routes/components";

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  logo?: string;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ logo, disabledLink = false, sx, ...other }, ref) => {
    // OR using local (public folder)
    // -------------------------------------------------------
    const logoImg = (
      <Box sx={sx}>
        <img alt="logo" src="/logo/Sunrise_Logo.png" />
      </Box>
    );

    if (disabledLink) {
      return logoImg;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
        {logoImg}
      </Link>
    );
  }
);

export default Logo;
