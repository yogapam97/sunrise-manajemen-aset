import { memo } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// @mui
import { useTheme } from "@mui/material/styles";

// hooks
import { useMockedUser } from "src/hooks/use-mocked-user";

// theme
import { bgBlur } from "src/theme/css";

// components
import { NavSectionHorizontal } from "src/components/nav-section";

//
import { HEADER } from "../config-layout";
import { HeaderShadow } from "../_common";
import { useNavData } from "./config-navigation";

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <AppBar
      component="nav"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <NavSectionHorizontal
          data={navData.map((item) => ({
            subheader: item.subheader || "",
            items: item.items,
          }))}
          config={{
            currentRole: user?.role || "admin",
          }}
        />
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);
