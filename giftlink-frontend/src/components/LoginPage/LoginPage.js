import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Step 1 - Task 4 & Step 2 - Task 5: State configuration for incorrect password handling
    const [incorrect, setIncorrect] = useState('');

    // Step 1 - Task 5: Create local variables for hooks and context state tracking
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    // Step 1 - Task 6: If the authentication token has a value, navigate directly to MainPage
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        if (e) e.preventDefault(); 
        setIncorrect(''); 

        try {
            // Step 1 - Task 7 & 8: Implement API call setting POST method and authorization headers
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', 
                },
                // Step 1 - Task 9: Set body payload parameters to map user details
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            // Step 2 - Task 1: Access data coming from fetch API in JSON format
            const json = await response.json();

            if (response.ok && json.authtoken) {
                // Step 2 - Task 2: Set user details inside browser session storage
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                
                // Step 2 - Task 3: Set the user's state to log in using the useAppContext
                setIsLoggedIn(true);
                
                // Step 2 - Task 4: Navigate to the MainPage after logging in
                navigate('/app');
            } else {
                // Step 2 - Task 5: Clear input values and set an error message if the password is incorrect
                document.getElementById("email").value = "";
                document.getElementById("password").value = "";
                setIncorrect("Wrong password. Try again.");
                
                // Optional: Clear out error message after 2 seconds
                setTimeout(() => {
                    setIncorrect("");
                }, 2000);
            }

        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setIncorrect("Cannot connect to server. Ensure your backend application is online.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                        
                        {/* Step 2 - Task 6: Display an error message directly to the user using required inline layout styles */}
                        <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
                        
                        <form onSubmit={handleLogin}>
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