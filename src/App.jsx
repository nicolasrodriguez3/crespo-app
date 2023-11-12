import { Toaster } from "react-hot-toast"
import { Navbar } from "./components/Navbar"
import { Outlet } from "react-router-dom"
import ClaimsContextProvider from "./context/ClaimsContext"
import { Suspense } from "react"
import Loader from "./assets/icons/Loader"

function App() {
  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <ClaimsContextProvider>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </ClaimsContextProvider>
      <Navbar />
    </>
  )
}

export default App
