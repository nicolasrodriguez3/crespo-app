import "./index.css"
import React from "react"
import ReactDOM from "react-dom/client"
import { NextUIProvider } from "@nextui-org/react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"
import App from "./App.jsx"
import { Login } from "./views/Login.jsx"
import { NotFound } from "./views/NotFound"
import { Register } from "./views/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { ForgotPassword } from "./views/ForgotPassword"
import { AddClaim } from "./views/AddClaim"
import { Profile } from "./views/Profile"
import { EditProfile } from "./views/EditProfile"
import { Home } from "./views/Home"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/add",
        element: <AddClaim />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </NextUIProvider>
  </React.StrictMode>,
)
