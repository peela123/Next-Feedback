import "../styles/globals.css";
import type { AppProps } from "next/app";

import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";

import {
  createTheme,
  Select,
  FileInput,
  MantineProvider,
  TextInput,
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
