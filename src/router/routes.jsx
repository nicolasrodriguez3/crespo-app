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
import { PostView } from "../views/PostView"
import ClaimsList from "../views/ClaimsList"
import { UsersList } from "../views/UsersList"
import { StreetsList } from "../views/StreetsList"
import { NeighborhoodsList } from "../views/NeighborhoodsList"
import { RolesList } from "../views/RolesList"
import { AreasList } from "../views/AreasList"
import { ClaimsTypes } from "../views/ClaimsTypes"
import { ClaimStatusList } from '../views/ClaimStatusList'
import { Test } from "../views/Test"

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
        path: "/test",
        element: <Test />,
      },
      {
        path: "/usuarios",
        element: <UsersList />,
      },
      {
        path: "/calles",
        element: <StreetsList />,
      },
      {
        path: "/barrios",
        element: <NeighborhoodsList />,
      },
      {
        path: "/roles",
        element: <RolesList />,
      },
      {
        path: "/areas",
        element: <AreasList />,
      },
      {
        path: "/tipos-de-reclamos",
        element: <ClaimsTypes />,
      },
      {
        path: "/estados-de-reclamos",
        element: <ClaimStatusList />,
      },
      {
        path: "/reclamos",
        element: <PostView />,
      },
      {
        path: "/add",
        element: <AddClaim />,
      },
      {
        path: "/claims",
        element: <ClaimsList />,
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
