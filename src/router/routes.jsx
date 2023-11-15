import { createBrowserRouter } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { NotFound } from "../views/NotFound"
import { EditProfile } from "../views/EditProfile"
import {  lazy } from "react"

const App = lazy(() => import("../App"))
const Claim = lazy(() => import("../views/Claim"))
const SectionList = lazy(() => import("../views/SectionList"))
const AddNew = lazy(() => import("../views/AddNew"))
const AddClaim = lazy(() => import("../views/AddClaim"))
const ClaimsList = lazy(() => import("../views/ClaimsList"))
const Home = lazy(() => import("../views/Home"))
const Login = lazy(() => import("../views/Login"))
const Register = lazy(() => import("../views/Register"))
const ForgotPassword = lazy(() => import("../views/ForgotPassword"))
const Profile = lazy(() => import("../views/Profile"))

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
        path: "/:sectionName",
        element: <SectionList />,
      },
      {
        path: "/lista-de-reclamos",
        element: <ClaimsList getAllClaims={true} />,
      },
      {
        path: "/nuevo",
        element: <AddClaim />,
      },
      {
        path: "/reclamos",
        element: <ClaimsList />,
      },
      {
        path: "/reclamos/:id",
        element: <Claim />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/agregar/:instance",
        element: <AddNew />,
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
