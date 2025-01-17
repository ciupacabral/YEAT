import React, { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function Login({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setAlertMessage('');

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    createdAt: new Date().toISOString(),
                });

                setAlertMessage('Account created successfully!');
                setTimeout(() => onClose(), 2000);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                setAlertMessage('Login successful!');
                setTimeout(() => onClose(), 2000);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setAlertMessage('');

        try {
            await sendPasswordResetEmail(auth, email);
            setAlertMessage('Password reset email sent! Please check your inbox.');
        } catch (err) {
            setError('Error sending password reset email. Please try again.');
        }
    };

    return (
        <div className="inset-0 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 z-60">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img alt="Your Company" src="yeat-logo.svg" className="mx-auto h-16 w-auto" />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {isResettingPassword
                        ? 'Reset Your Password'
                        : isSignUp
                            ? 'Create an account'
                            : 'Sign in to your account'}
                </h2>

                {alertMessage && (
                    <div className="mt-4 rounded-md bg-green-100 p-3 text-sm text-green-800">{alertMessage}</div>
                )}
                {error && (
                    <div className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-800">{error}</div>
                )}
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm z-60">
                {isResettingPassword ? (
                    <form onSubmit={handlePasswordReset} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primaryOrange px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
                            >
                                Send Reset Email
                            </button>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <button
                                type="button"
                                onClick={() => setIsResettingPassword(false)}
                                className="font-semibold text-indigo-600 hover:text-indigo-500"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-primaryOrange px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
                            >
                                {isSignUp ? 'Create Account' : 'Log In'}
                            </button>
                        </div>
                    </form>
                )}
                {!isResettingPassword && (
                    <div className="mt-6 text-center text-sm text-gray-500">
                        {isSignUp ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(false)}
                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsResettingPassword(true)}
                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot Password?
                                </button>
                                <br />
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(true)}
                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
