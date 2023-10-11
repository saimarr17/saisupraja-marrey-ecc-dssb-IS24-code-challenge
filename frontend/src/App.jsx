import {RouterProvider} from "react-router-dom";
import {router} from "./pages/index.jsx";
import {createTheme, ThemeProvider} from "@mui/material";
import {useMemo, useState} from "react";
import {ColorModeContext} from "./ColorContext.jsx";
import {QueryClient, QueryClientProvider} from "react-query";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [mode, setMode] = useState("light");
    const queryClient = new QueryClient();

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevmode) => (prevmode === "light" ? "dark" : "light"));
        }
    }), []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
        }
    }), [mode]);

  return (
      <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
              <QueryClientProvider client={queryClient}>
                  <ToastContainer position="top-center" theme={theme.palette.mode}/>
                  <RouterProvider router={router} />
              </QueryClientProvider>
          </ThemeProvider>
      </ColorModeContext.Provider>
  );
}

export default App
