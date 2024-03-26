import "../styles/globals.css";
import type { AppProps } from "next/app";

import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";
import {
  createTheme,
  FileInput,
  MantineProvider,
  TextInput,
} from "@mantine/core";
import "@mantine/dropzone/styles.css";
import { NextUIProvider } from "@nextui-org/react";

const theme = createTheme({
  components: {
    FileInput: FileInput.extend({
      styles: {
        label: { color: "blue" },
        input: { borderColor: "green", boderWidth: "5px" },
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
