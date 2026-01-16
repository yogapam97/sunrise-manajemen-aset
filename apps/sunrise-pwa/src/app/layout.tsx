// scrollbar

import "src/global.css";

// i18n
import "src/locales/i18n";

// ----------------------------------------------------------------------

import ReactQueryProvider from "src/utils/react-query";

// theme
import ThemeProvider from "src/theme";
import { primaryFont } from "src/theme/typography";
import { LocalizationProvider } from "src/locales";
import { WorkspaceProvider } from "src/contexts/workspace/workspace-provider";

// components
import ProgressBar from "src/components/progress-bar";
import { SettingsProvider } from "src/components/settings";
import MotionLazy from "src/components/animate/motion-lazy";
import SnackbarProvider from "src/components/snackbar/snackbar-provider";

// auth
import { AuthProvider, AuthConsumer } from "src/auth/context/jwt";

// ----------------------------------------------------------------------
export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "Stageholder",
  description: "Brilliance Fixed Asset Solution",
  keywords: "fixed asset",
  // themeColor: '#000000',
  manifest: "/manifest.json",
  icons: [
    {
      rel: "icon",
      url: "/favicon/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon/favicon-32x32.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon/apple-touch-icon.png",
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <AuthProvider>
          <WorkspaceProvider>
            <ReactQueryProvider>
              <LocalizationProvider>
                <SettingsProvider
                  defaultSettings={{
                    themeMode: "light", // 'light' | 'dark'
                    themeDirection: "ltr", //  'rtl' | 'ltr'
                    themeContrast: "default", // 'default' | 'bold'
                    themeLayout: "vertical", // 'vertical' | 'horizontal' | 'mini'
                    themeColorPresets: "cyan", // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                    themeStretch: false,
                  }}
                >
                  <ThemeProvider>
                    <MotionLazy>
                      <SnackbarProvider>
                        <ProgressBar />
                        <AuthConsumer>{children}</AuthConsumer>
                      </SnackbarProvider>
                    </MotionLazy>
                  </ThemeProvider>
                </SettingsProvider>
              </LocalizationProvider>
            </ReactQueryProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
