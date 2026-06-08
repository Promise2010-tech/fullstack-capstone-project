import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
    // State variables for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Step 2 - Task 5: Include the correct state name for error messages
    const [showerr, setShowerr] = useState('');

    // Step 1 - Task 5: Create local variables for navigate and setIsLoggedIn
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    // Form submission action handler
    const handleRegister = async (e) => {
        if (e) e.preventDefault(); // Prevents the browser from reloading the page
        setShowerr(''); // Reset any existing errors

        try {
            // Step 1 - Tasks 6, 7 & 8: Implement API call to the registration endpoint
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                })
            });

            // Step 2 - Task 1: Access data coming from fetch API
            const json = await response.json();

            if (response.ok && json.authtoken) {
                // Step 2 - Task 2: Set user details in session storage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
                
                // Step 2 - Task 3: Set the state of user to logged in using the useAppContext
                setIsLoggedIn(true);
                
                // Step 2 - Task 4: Navigate to the MainPage after logging in
                navigate('/app');
            } else {
                // Step 2 - Task 5: Set an error message if the registration fails
                if (json.error) {
                    setShowerr(json.error);
                } else {
                    setShowerr("Registration failed. Please review your credentials.");
                }
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
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>
                        
                        {/* Step 2 - Task 6: Display error message to end user exactly as requested */}
                        {showerr && <div className="text-danger mb-3">{showerr}</div>}
                        
                        <form onSubmit={handleRegister}>
                            {/* First Name Input */}
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Last Name Input */}
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
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

                            {/* Password Input */}
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
                                Register
                            </button>
                        </form>

                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;