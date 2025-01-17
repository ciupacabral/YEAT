import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase'; // Ensure Firebase is initialized

export default function History({ onSearch }) {
    const [lastSearches, setLastSearches] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLastSearches = async (user) => {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setLastSearches(data.searches || []); // Fetch the `searches` field or fallback to an empty array
                } else {
                    setError('User data not found.');
                }
            } catch (err) {
                setError('Failed to fetch last searches.');
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setError(''); // Clear any previous error
                fetchLastSearches(user); // Fetch user data
            } else {
                setError('User not logged in.');
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Clean up the listener
    }, []);

    const handleSearchClick = (search) => {
        if (onSearch) {
            onSearch(search.input, search.category); // Pass the search data to App.js's onSearch
        }
    };

    return (
        <div>
            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && lastSearches.length === 0 && (
                <p className="text-gray-600">No searches found.</p>
            )}
            <ul className="space-y-3">
                {lastSearches.map((search, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 p-4 rounded-lg cursor-pointer"
                        onClick={() => handleSearchClick(search)}
                    >
                        <div>
                            <p className="font-medium text-gray-800">{search.input}</p>
                            <p className="text-sm text-gray-600">{search.category}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                            {new Date(search.timestamp).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
