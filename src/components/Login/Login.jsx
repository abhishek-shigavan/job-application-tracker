import { auth, provider } from '../../firebase'
import { useNavigate } from "react-router-dom"
import { signInWithPopup } from 'firebase/auth'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import "./Login.scss"
import { useState } from 'react'

function Login () {
    const navigate = useNavigate()
    const [showErrMsg, setShowErrMsg] = useState(false)

    const handleLogin = async () => {
        try {
            const loggedUser = await signInWithPopup(auth, provider)
            const {displayName, email, photoURL} = loggedUser?.user || {displayName: "", email: "", photoURL: ""}
            localStorage.setItem("name", displayName)
            localStorage.setItem("email", email)
            localStorage.setItem("profile", photoURL)
            navigate('/dashboard')
        } catch (err) {
            setShowErrMsg(true)
        }   
    }

    return (
        <div className='login-main-cnt'>
            <div className="login-action-btn-banner-cnt">
                <div className="login-logo-btn-cnt">
                    <span>Best way to track your job applications</span>
                    <Button variant="text" sx={{width: "fit-content !important", padding: "5px 10px !important"}} onClick={handleLogin}>Sign in with Google</Button>
                </div>
                <div className="login-banner-cnt">
                    <img src="./src/assets/jobtracklogo.png" alt="app baner"/>
                </div>
            </div>
            <Snackbar
                open={showErrMsg}
                autoHideDuration={6000}
                message="Login Failed...!"
            />
        </div>
    )
}

export default Login
