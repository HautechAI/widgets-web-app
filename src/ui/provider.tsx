import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { toast, ToastContainer } from "react-toastify";

export { toast };

export const UIProvider = (props: { children: any }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ToastContainer />
    {props.children}
  </ThemeProvider>
);