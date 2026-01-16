// @mui
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";

// routes

// hooks
import { useOffSetTop } from "src/hooks/use-off-set-top";
import { useResponsive } from "src/hooks/use-responsive";

// theme
import { bgBlur } from "src/theme/css";

// components
import LogoFull from "src/components/logo/logo-full";
import DarkLightModelButton from "src/components/sunrise/core/common/DarkLightModelButton";

//
import { HEADER } from "../config-layout";
//
import { LoginButton, HeaderShadow } from "../_common";

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const mdUp = useResponsive("up", "md");

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

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
          <LogoFull sx={{ height: 30 }} />

          <Box sx={{ flexGrow: 1 }} />

          <Stack alignItems="center" spacing={2} direction={{ xs: "row" }}>
            <DarkLightModelButton />

            {mdUp && <LoginButton />}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
