import { useEffect } from "react";

import { IconButton } from "@mui/material";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";

export default function DarkLightModelButton() {
  const { themeMode, onUpdate } = useSettingsContext();

  // Function to detect the system theme preference
  const getSystemTheme = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  useEffect(() => {
    const initialTheme = getSystemTheme();
    onUpdate("themeMode", initialTheme);

    // Listener to detect system theme changes
    const handleSystemThemeChange = (e: any) => {
      const newTheme = e.matches ? "dark" : "light";
      onUpdate("themeMode", newTheme);
    };

    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryList.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleSystemThemeChange);
    };
  }, [onUpdate]);

  const handleToggleDarkLight = () => {
    onUpdate("themeMode", themeMode === "dark" ? "light" : "dark");
  };

  return (
    <IconButton onClick={handleToggleDarkLight}>
      <Iconify icon={themeMode === "dark" ? "solar:sun-outline" : "solar:moon-outline"} />
    </IconButton>
  );
}
