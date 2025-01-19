import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase'; // Firebase imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Favorites({ onSearch }) {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState(null); // State for selected location

    useEffect(() => {
        const fetchFavorites = async (user) => {
            try {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setFavorites(data.favorites || []); // Fetch the `favorites` field or fallback to an empty array
                } else {
                    setError('User  data not found.');
                }
            } catch (err) {
                setError('Failed to fetch favorites.');
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setError(''); // Clear any previous error
                fetchFavorites(user); // Fetch user data
            } else {
                setError('User  not logged in.');
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Clean up the listener
    }, []);

    const handleMapClick = (fav) => {
        setSelectedLocation(fav); // Set the selected location to display on the map
    };

    const closePopup = () => {
        setSelectedLocation(null); // Close the popup
    };

    const removeFavorite = async (id) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            const existingFavorites = userDoc.data().favorites || [];
            const updatedFavorites = existingFavorites.filter(fav => fav.id !== id);

            await updateDoc(userDocRef, {
                favorites: updatedFavorites,
            });

            setFavorites(updatedFavorites); // Update local state
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    return (
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Favorites</h2>
            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && favorites.length === 0 && (
                <p className="text-gray-600">No favorites found. Start adding some!</p>
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => (
                    <li key={fav.id} className="bg-gray-100 shadow-md rounded-lg overflow-hidden flex flex-col">
                        <div className="p-4 flex-grow">
                            <h3 className="font-medium text-gray-800 text-lg">{fav.tags.name}</h3>
                            {fav.tags['addr:street'] && (
                                <p className="text-sm text-gray-600">
                                    {fav.tags['addr:street']}, {fav.tags['addr:city']}
                                </p>
                            )}
                            {fav.tags.opening_hours && (
                                <p className="text-sm text-gray-600">
                                    Open: {fav.tags.opening_hours}
                                </p>
                            )}
                        </div>
                        <div className="p-4 bg-movuliu text-center mt-auto">  {/* mt-auto pushes this section to the bottom */}
                            <button
                                className="text-primary hover:underline"
                                onClick={() => handleMapClick(fav)}
                            >
                                See on Map
                            </button>
                            <button
                                className="text-red-500 hover:underline ml-2"
                                onClick={() => removeFavorite(fav.id)}
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>


            {/* Map Popup */}
            {selectedLocation && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closePopup}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-2xl h-[75vh] relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the map
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closePopup}
                        >
                            &times;
                        </button>
                        <MapContainer
                            center={[
                                selectedLocation.lat || 0,
                                selectedLocation.lon || 0,
                            ]}
                            zoom={13}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&copy; OpenStreetMap contributors"
                            />
                            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                                <Popup>
                                    <div>
                                        <h3 className="font-medium">{selectedLocation.tags.name}</h3>
                                        {selectedLocation.tags['addr:street'] && (
                                            <p>
                                                {selectedLocation.tags['addr:street']},{' '}
                                                {selectedLocation.tags['addr:city']}
                                            </p>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            )}
        </section>
    );
}