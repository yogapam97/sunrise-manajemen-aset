// @mui
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Badge, { badgeClasses } from "@mui/material/Badge";

// hooks
import { useOffSetTop } from "src/hooks/use-off-set-top";
import { useResponsive } from "src/hooks/use-responsive";

// theme
import { bgBlur } from "src/theme/css";
// routes
//
import { APP_DISTRIBUTION } from "src/config-global";

// components
import Label from "src/components/label";
import LogoFull from "src/components/logo/logo-full";
import DarkLightModelButton from "src/components/sunrise/core/common/DarkLightModelButton";

import NavMobile from "./nav/mobile";
import NavDesktop from "./nav/desktop";
import { HEADER } from "../config-layout";
import { navConfig } from "./config-navigation";
//
import { HeaderShadow, AccountPopover } from "../_common";

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const mdUp = useResponsive("up", "md");

  const offsetTop = useOffSetTop(-1);

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(["height"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: "flex", alignItems: "center" }}>
          <Badge
            sx={{
              [`& .${badgeClasses.badge}`]: {
                top: 8,
                right: -16,
              },
            }}
            badgeContent={
              <Link href="#" target="_blank" rel="noopener" underline="none" sx={{ ml: 1 }}>
                <Label color="info" sx={{ textTransform: "unset", height: 22, px: 0.5 }}>
                  {APP_DISTRIBUTION}
                </Label>
              </Link>
            }
          >
            <LogoFull />
          </Badge>

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop offsetTop={offsetTop} data={navConfig} />}

          <Stack alignItems="center" direction={{ xs: "row" }} spacing={{ xs: 0.5, sm: 1 }}>
            <DarkLightModelButton />
            <AccountPopover />
            {!mdUp && <NavMobile offsetTop={offsetTop} data={navConfig} />}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
