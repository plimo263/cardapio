import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeModeContext = createContext({ mode: "light", toggleMode: () => {} });

export const useThemeMode = () => useContext(ThemeModeContext);

const basePalette = {
  primary: {
    main: "#A02A14",
    light: "#C94D35",
    dark: "#7A1F0F",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#424242",
    light: "#6D6D6D",
    dark: "#1B1B1B",
    contrastText: "#FFFFFF",
  },
};

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem("themeMode");
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    // fallback to prefered color scheme
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    try {
      localStorage.setItem("themeMode", mode);
    } catch (e) {}
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        ...basePalette,
        background:
          mode === "dark"
            ? { default: "#121212", paper: "#1e1e1e" }
            : { default: "#F5F5F5", paper: "#FFFFFF" },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 600 },
        h5: { fontWeight: 500 },
      },
      shape: { borderRadius: 8 },
      components: {
        MuiButton: {
          styleOverrides: { root: { textTransform: "none", fontWeight: 600 } },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;
