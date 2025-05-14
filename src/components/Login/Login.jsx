import { auth, provider } from '../../firebase'
import { useNavigate } from "react-router-dom"
import { signInWithPopup } from 'firebase/auth'
import "Login.scss"

function Login () {
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider)        
            navigate('/dashboard')
        } catch (err) {
            console.error('Login failed:', err)
        }   
    }

    return (
        <div className='login-main-cnt'>
            <h2>Login</h2>
            <button onClick={handleLogin}>Sign in with Google</button>
        </div>
    )
}

export default Login
