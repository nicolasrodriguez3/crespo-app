import { createBrowserRouter } from "react-router-dom"
import { ProtectedRoute } from "../components/ProtectedRoute"
import { NotFound } from "../views/NotFound"
import { AddClaim } from "../views/AddClaim"
import { Profile } from "../views/Profile"
import { EditProfile } from "../views/EditProfile"
import { Login } from "../views/Login"
import { Register } from "../views/Register"
import { ForgotPassword } from "../views/ForgotPassword"
import { ClaimsList } from "../views/ClaimsList"
import { Home } from "../views/Home"
import Claim from "../views/Claim"
import { Suspense, lazy } from "react"
import AddNew from "../views/AddNew"
import SectionList from "../views/SectionList"

const App = lazy(() => import("../App"))

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<div className="text-center">Cargando...</div>}>
          <App />
        </Suspense>
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
