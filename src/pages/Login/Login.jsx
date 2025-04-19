import React, { useEffect, useState } from 'react'
import { auth } from '../../../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence, browserSessionPersistence, setPersistence } from 'firebase/auth'
import background from '/background_banner.jpg'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword)
    }



    useEffect(() => {
        const remember = localStorage.getItem('rememberMe');
        if (remember) {
            setRememberMe(remember === 'true')
        }
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ email: '', password: '' })
        try {
            if (!email || !password) {
                setErrors({ ...errors, email: 'Email is required', password: 'Password is required' });
                return;
            }


            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(email)) {
                setErrors({ ...errors, email: 'Invalid email format' });
                return;
            }

            if (rememberMe) {
                await setPersistence(auth, browserLocalPersistence);
            } else {
                await setPersistence(auth, browserSessionPersistence);
            }

            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                navigate('/')
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/')
            }
        } catch (error) {
            console.error('Error signing in: ', error);

            if (error.message.includes('email-already-in-use')) {
                setErrors({ ...errors, email: 'This email is already in use' });
            } else if (error.message.includes('wrong-password')) {
                setErrors({ ...errors, password: 'Incorrect password' });
            } else {
                setErrors({ ...errors, email: 'An error occurred. Please try again.' });
            }

        }
    };

    const toggleForm = () => {
        setIsSignUp(!isSignUp)
    }

    const handleCheckboxChange = (e) => {
        setRememberMe(e.target.checked);
        localStorage.setItem('rememberMe', e.target.checked)
    }
    return (
        <div className='login'>
            <div className="image-container">
                <div className="gradient-overlay"></div>
                <img src={background} alt="" />
            </div>
            <div className='container'>
                <Link to={'/'} className="icon">Movie<span>Hub</span></Link>

                <div className="login-form">
                    <h2>Sign <span>{isSignUp ? 'Up' : 'In'}</span>!</h2>
                    <form onSubmit={handleSubmit} action="">
                        <span>
                            {errors.email && <p className="error-message">{errors.email}</p>}
                            <input type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder='Email'
                                className={errors.email ? 'input-error' : ''} />

                        </span>
                        <span style={{
                            position: 'relative'
                        }}>
                            {errors.password && <p className="error-message">{errors.password}</p>}
                            <input type={showPassword ? 'text' : 'password'}
                                value={password}
                                className={errors.password ? 'input-error' : ''}
                                onChange={handlePasswordChange}
                                aria-hidden="true"
                                placeholder='Password'
                                style={{
                                    paddingRight: '40px'
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleTogglePassword}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                style={{
                                    width: '30px',
                                    position: 'absolute',
                                    border: 'none',
                                    right: '5px',
                                    bottom: '-15px',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                }}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                        <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                    </svg>
                                )}
                            </button>
                        </span>

                        <button type='submit'>{isSignUp ? 'Sign Up' : 'Sign In'}</button>
                        <div className="form-help">
                            <div className="remember">
                                <input type="checkbox"
                                    checked={rememberMe}
                                    onChange={handleCheckboxChange} />
                                <label htmlFor="remember">Remember Me</label>
                            </div>

                        </div>
                    </form>
                </div>
                <div className="form-switch">

                    <div className='toggle-form' onClick={toggleForm}>
                        {isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Login