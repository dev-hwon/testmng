import React from "react";
import type { ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { CacheProvider, EmotionCache } from "@emotion/react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import "../mocks";

import "../../style/custom.css";
import "../../style/board.css";
import "../../style/menu.css";

import "../vendor/jvectormap.css";
import "../vendor/perfect-scrollbar.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";

import "../i18n";
import createTheme from "../theme";

import { ThemeProvider } from "../contexts/ThemeContext";
import useTheme from "../hooks/useTheme";
import createEmotionCache from "../utils/createEmotionCache";

import { AuthProvider } from "../contexts/JWTContext";
import { QueryClientProvider, QueryClient } from "react-query";

const clientSideEmotionCache = createEmotionCache();

type GetLayout = (page: ReactNode) => ReactNode;

type Page<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

type MyAppProps<P = {}> = AppProps<P> & {
  emotionCache?: EmotionCache;
  Component: Page<P>;
};

function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) {
  const { theme } = useTheme();

  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchInterval: 12000
      }
    }
  });
  return (
    <CacheProvider value={emotionCache}>
      <HelmetProvider>
        <Helmet
          titleTemplate="%s | MNG"
          defaultTitle="MNG"
        />
        <QueryClientProvider client={queryClient}>
          <MuiThemeProvider theme={createTheme(theme)}>
            <AuthProvider>
              {getLayout(<Component {...pageProps} />)}
            </AuthProvider>
          </MuiThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </CacheProvider>
  );
}

const withThemeProvider = (Component: any) => {
  const AppWithThemeProvider = (props: JSX.IntrinsicAttributes) => {
    return (
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    );
  };
  AppWithThemeProvider.displayName = "AppWithThemeProvider";
  return AppWithThemeProvider;
};

export default withThemeProvider(App);
