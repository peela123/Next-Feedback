import Document, { Head, Html, Main, NextScript } from "next/document";
import { ColorSchemeScript } from "@mantine/core";

// Rename the component to avoid conflict with the imported Document
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <ColorSchemeScript />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
