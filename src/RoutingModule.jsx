import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";

function RoutingModule () {
    const routes = createBrowserRouter([
        {
            path: "",
            element: <Login/>
        },
        {
            path: "/dashboard",
            element: <Dashboard/>
        }
    ])
    
    return (
        <RouterProvider router={routes} />
    )
}

export default RoutingModule