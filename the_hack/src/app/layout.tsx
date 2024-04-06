"use client";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/utils/theme";
import "./globals.css"
import '@fontsource-variable/urbanist';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
