import { createBrowserRouter } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoute"
import App from "../App"
import { NotFound } from "../views/NotFound"
import { Home } from "../views/Home"
import { AddClaim } from "../views/AddClaim"
import { Profile } from "../views/Profile"
import { EditProfile } from "../views/EditProfile"
import { Login } from "../views/Login"
import { Register } from "../views/Register"
import { ForgotPassword } from "../views/ForgotPassword"

export const routes = createBrowserRouter([
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
