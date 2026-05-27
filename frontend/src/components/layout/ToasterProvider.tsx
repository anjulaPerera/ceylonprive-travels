"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#1E2640",
          color: "#F5F0E8",
          border: "1px solid #C9A84C",
        },
      }}
    />
  );
}
