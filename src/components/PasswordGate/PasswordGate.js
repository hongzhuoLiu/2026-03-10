import React, { useEffect, useState } from 'react';
import { API } from "../../API";
import SCLogo from '../../images/logos/SCLogo.png';
import './PasswordGate.css';

const SESSION_KEY = 'siteAccessGranted';
const MAX_ATTEMPTS = 5;

const PasswordGate = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        // Check if user already authenticated in this session
        const sessionAuth = sessionStorage.getItem(SESSION_KEY);
        console.log('Initial session check:', sessionAuth);
        if (sessionAuth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    console.log('Render state:', { isAuthenticated, isLoading, error });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password.trim()) {
            setError('Please enter a password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const value = {
                identifier: "mainlogin@studentschoice.blog",
                password: password,
            };

            const response = await fetch(`${API}/auth/local`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(value),
            });

            const result = await response.json();

            console.log('Authentication response:', { ok: response.ok, user: result.user, userId: result.user?.id });

            if (response.ok && result.user && result.user.id === 24) {
                // Authentication successful
                console.log('Authentication successful - setting session storage');
                sessionStorage.setItem(SESSION_KEY, 'true');
                setIsAuthenticated(true);
                setError('');
                setIsLoading(false);
            } else {
                // Authentication failed
                const newAttempts = attempts + 1;
                setAttempts(newAttempts);
                
                if (newAttempts >= MAX_ATTEMPTS) {
                    setError(`Maximum attempts reached. Please contact support.`);
                } else {
                    setError(`Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
                }
                setPassword('');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            setError('Authentication failed. Please try again.');
            setPassword('');
            setIsLoading(false);
        }
    };

    if (isLoading && !error) {
        return (
            <div className="password-gate-container">
                <div className="password-gate-content">
                    <img src={SCLogo} alt="Students Choice Logo" className="password-gate-logo" />
                    <div className="password-gate-spinner"></div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="password-gate-container">
                <div className="password-gate-content">
                    <img src={SCLogo} alt="Students Choice Logo" className="password-gate-logo" />
                    
                    <h1 className="password-gate-title">Under Construction</h1>
                    <p className="password-gate-subtitle">This site is currently under development</p>
                    
                    <form onSubmit={handleSubmit} className="password-gate-form">
                        <div className="password-gate-input-group">
                            <label htmlFor="site-password" className="password-gate-label">
                                Enter Access Password
                            </label>
                            <input
                                id="site-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="password-gate-input"
                                disabled={attempts >= MAX_ATTEMPTS || isLoading}
                                autoFocus
                            />
                        </div>
                        
                        {error && (
                            <div className="password-gate-error">
                                {error}
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            className="password-gate-button"
                            disabled={attempts >= MAX_ATTEMPTS || isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Access Site'}
                        </button>
                    </form>
                    
                    <p className="password-gate-footer">Coming Soon!</p>
                </div>
            </div>
        );
    }

    // User is authenticated, render the app
    return <>{children}</>;
};

export default PasswordGate;
