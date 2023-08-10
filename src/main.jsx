import "./index.css"
import React from "react"
import ReactDOM from "react-dom/client"
import { NextUIProvider } from "@nextui-org/react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthProvider"
import App from "./App.jsx"
import Login from "./components/Login.jsx"
import NotFound from "./views/NotFound"
import Register from "./components/Register"

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <NotFound />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
])

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<NextUIProvider>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</NextUIProvider>
	</React.StrictMode>
)
