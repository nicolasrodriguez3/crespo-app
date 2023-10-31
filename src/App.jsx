import { Toaster } from "react-hot-toast"
import { Navbar } from "./components/Navbar"
import { Outlet } from "react-router-dom"

function App() {
  return (
    <>
      <div>
        <Toaster position="bottom-right" />
      </div>
      <Outlet />
      <Navbar />
    </>
  )
}

export default App
