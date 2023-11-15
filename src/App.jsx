import { Toaster } from "react-hot-toast"
import { Navbar } from "./components/Navbar"
import { Outlet } from "react-router-dom"
import ClaimsContextProvider from "./context/ClaimsContext"
import { Suspense } from "react"
import { Skeleton } from "@nextui-org/react"
import { WrapperUI } from "./components/WrapperUI"

const SkeletonContent = () => {
  return (
    <WrapperUI>
    <Skeleton className="rounded-lg">
      <div className="px-4 w-full h-12 bg-default-200 rounded-lg"></div>
    </Skeleton>
    <Skeleton className="w-3/5 rounded-lg">
      <div className="px-4 w-2/5 h-4 rounded-lg bg-default-200"></div>
    </Skeleton>
    <Navbar />
    </WrapperUI>
  )
}

function App() {
  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <ClaimsContextProvider>
        <Suspense fallback={<SkeletonContent />}>
          <Outlet />
        </Suspense>
      </ClaimsContextProvider>
      <Navbar />
    </>
  )
}

export default App
