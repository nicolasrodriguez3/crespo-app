import React from "react"
import ReactDOM from "react-dom/client"
import { NextUIProvider } from "@nextui-org/react"
import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"

import "./index.css"
import { routes } from "./router/routes"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </NextUIProvider>
  </React.StrictMode>,
)
