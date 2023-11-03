import { Toaster } from "react-hot-toast"
import { Navbar } from "./components/Navbar"
import { Outlet } from "react-router-dom"
import ClaimsContextProvider from "./context/ClaimsContext"

function App() {
  return (
    <>
      <div>
        <Toaster position="bottom-right" />
      </div>
      <ClaimsContextProvider>
        <Outlet />
      </ClaimsContextProvider>
      <Navbar />
    </>
  )
}

export default App
