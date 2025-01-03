"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Provider} from "react-redux";
import { store } from "@/redux/store";
import { useRouter } from "next/navigation";
import { stateType } from "@/types/stateTypes";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en">
      <head>
        <title>Group Thnk</title>
        <meta name="description" content="Next typescript chating app " />
        {/* Add other metadata as needed */}
      </head>
      <body className={inter.className}>
          <Toaster />
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
