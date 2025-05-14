import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login/Login";

function RoutingModule () {
    const routes = createBrowserRouter([
        {
            path: "",
            element: <Login/>
        }
    ])
    
    return (
        <RouterProvider router={routes} />
    )
}

export default RoutingModule