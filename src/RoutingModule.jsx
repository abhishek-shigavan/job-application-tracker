import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import JobDetails from "./components/JobDetails/JobDetails";
import HeaderOutletContainer from "./components/HeaderOutletContainer/HeaderOutletContainer";
import ProtectedRoute from "./ProtectedRoute";

function RoutingModule () {
    const routes = createBrowserRouter([
        {
            path: "",
            element: <Login/>
        },
        {
            path: "/",
            element: <ProtectedRoute Component={<HeaderOutletContainer/>} />,
            children:[
                {
                    path: "dashboard",
                    index: true,
                    element: <Dashboard/>
                },
                {
                    path: "job/:jobId",
                    element: <JobDetails/>
                }
            ]
        },
    ])
    
    return (
        <RouterProvider router={routes} />
    )
}

export default RoutingModule