import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function ProtectedRoute ({ Component }) {
    const navigate = useNavigate()  
    const status = localStorage.getItem('userDetails') ? true : false;

    useEffect(() => {
        if(!status) navigate('/', {replace: true})  
    }, [status])
    
    return status ? <>{Component}</> : <></>
}

export default ProtectedRoute
