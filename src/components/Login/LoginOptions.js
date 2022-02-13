import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../UI/Button/Button'
import classes from './LoginOptions.module.css'

const LoginOptions = ({className}) => {
    const navigate = useNavigate()

    const openSignUpModalHandler = () => {
        navigate('/flow/signup')
    }

    const openSignInModalHandler = () => {
        navigate('/flow/signin')
    }

    return (
        <div className={`${className} ${classes.options}`}>
            <section>
                <h2>Join Chirpy today.</h2>
                <Button onClick={openSignUpModalHandler}>Sign Up</Button>
            </section>
            <section>
                <p>Already have an account?</p>
                <Button onClick={openSignInModalHandler}>Sign In</Button>
            </section>
        </div>
    )
}

export default LoginOptions
