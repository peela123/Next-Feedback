import "../styles/globals.css";
import type { AppProps } from "next/app";

import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";

import {
  createTheme,
  Select,
  FileInput,
  Switch,
  MantineProvider,
  TextInput,
  Button,
} from "@mantine/core";
import "@mantine/dropzone/styles.css";

import { NextUIProvider } from "@nextui-org/react";

const theme = createTheme({
  components: {
    TextInput: TextInput.extend({
      styles: {
        // label: { color: "blue" },
        // color: "#CDCCDC",
        wrapper: { color: "red", bacColor: "red" },
        required: { color: "gray" },
        input: {
          color: "white",
          backgroundColor: "#363636",
          borderColor: "#2F4F4F",
          borderWidth: "2px",
        },
      },
    }),
    Select: Select.extend({
      styles: {
        required: { color: "gray" },
        input: {
          color: "white",
          backgroundColor: "#363636",
          borderColor: "#2F4F4F",
          borderWidth: "2px",
        },
      },
    }),
    Switch: Switch.extend({
      styles: {
        track: {
          color: "green",
          // backgroundColor: "red",
        },
        thumb: {
          borderColor: "black",
          borderWidth: "1.5px",
          backgroundColor: "gray",
        },
      },
    }),
    Button: Button.extend({
      styles: {
        root: {
          width: "12rem",
          height: "3rem",
          borderWidth: "2px",
          backgroundColor: "rgb(101 163 13)",
          borderRadius: "0.75rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        },
      },
    }),
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <NextUIProvider>
        <Component {...pageProps} />;
      </NextUIProvider>
    </MantineProvider>
  );
}
