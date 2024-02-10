import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";

import { ThemeContext } from "../../contexts/ThemeContext";
import { WindowsContext } from "../../contexts/WindowsContext";
import { useTheme } from "../../hooks/useTheme";
import { useWindows } from "../../hooks/useWindows";

import Home from "./components/Home";
import PopupThemeProvider from "./components/ThemeProvider";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeContext.Provider value={useTheme()}>
      <PopupThemeProvider>
        <WindowsContext.Provider value={useWindows()}>
          {children}
        </WindowsContext.Provider>
      </PopupThemeProvider>
    </ThemeContext.Provider>
  );
};

const BasePage = () => {
  return (
    <>
      <CssBaseline />
      <Home />
    </>
  );
};

export default function App() {
  useEffect(() => {
    const closePopupOnOtherWindowFocused = () => {
      chrome.windows.onFocusChanged.addListener((windowId) => {
        const isNoWindowFocused = windowId === chrome.windows.WINDOW_ID_NONE;
        if (isNoWindowFocused) return;

        window.close();
      });
    };
    closePopupOnOtherWindowFocused();
  }, []);

  return (
    <Provider>
      <BasePage />
    </Provider>
  );
}