import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import JobDetails from "./components/JobDetails/JobDetails";

function RoutingModule () {
    const routes = createBrowserRouter([
        {
            path: "",
            element: <Login/>
        },
        {
            path: "/dashboard",
            element: <Dashboard/>
        },
        {
            path: "/job/:jobId",
            element: <JobDetails/>
        }
    ])
    
    return (
        <RouterProvider router={routes} />
    )
}

export default RoutingModule