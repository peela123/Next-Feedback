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
import { NextUIProvider } from "@nextui-org/react";

const theme = createTheme({
  components: {
    FileInput: FileInput.extend({
      styles: {
        // label: { color: "blue" },
        // description: { color: "blue" },
        // root: { color: "blue" },
        // wrapper: { color: "red" },
        // error: { color: "purple" },
        // input: { color: "yellow" },
        // required: { color: "red" },
        // section: { color: "red" },
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
