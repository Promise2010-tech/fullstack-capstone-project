import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    // State variables for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Step 2 Naming Standard: State for handling error messages
    const [showerr, setShowerr] = useState('');

    // Local hook routing context properties
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    // Form submission action handler
    const handleLogin = async (e) => {
        if (e) e.preventDefault(); // Prevents browser from reloading the page
        setShowerr(''); // Reset any existing errors

        try {
            // Step 1: Implement API call targeting the login route
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            // Step 2: Access data coming from fetch API
            const json = await response.json();

            if (response.ok && json.authtoken) {
                // Set user tracking details inside browser session memory
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                
                // Flip application authentication state globally
                setIsLoggedIn(true);
                
                // Route user forward onto primary dashboard landing panel
                navigate('/app');
            } else {
                // Set an error message if credentials validation fails
                setShowerr(json.error || "Invalid Email or Password");
            }

        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setShowerr("Cannot connect to server. Ensure your backend application is online.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                        
                        {/* Display inline validation error message block to end user if present */}
                        {showerr && <div className="text-danger mb-3">{showerr}</div>}
                        
                        <form onSubmit={handleLogin}>
                            {/* Email Input Field */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password Input Field */}
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Action Submission Button */}
                            <button type="submit" className="btn btn-primary w-100 mb-3">
                                Login
                            </button>
                        </form>

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;