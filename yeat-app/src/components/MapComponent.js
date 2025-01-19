import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css'; // Import your CSS for styling
import L from 'leaflet';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase"; // Import Firebase configuration

// Set the default icon for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ locations }) => {
    const defaultPosition = [44.4268, 26.1025]; // Bucharest coordinates
    const mapRef = useRef(); // Create a ref to store the map instance
    const [userLocation, setUserLocation] = useState(null); // Store user location
    const [user, setUser] = useState(null); // Manage user state
    const [favorites, setFavorites] = useState([]); // Store user's favorites

    // Check if the location is saved in localStorage and set the userLocation state
    useEffect(() => {
        const savedLocation = JSON.parse(localStorage.getItem('userLocation'));

        if (savedLocation) {
            console.log("Using saved location from localStorage:", savedLocation);
            setUserLocation([savedLocation.latitude, savedLocation.longitude]);
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("Using current geolocation:", { latitude, longitude });
                        setUserLocation([latitude, longitude]);
                        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude })); // Save to localStorage
                    },
                    (err) => {
                        console.error("Error fetching user location:", err.message);
                        setUserLocation(defaultPosition); // Fallback to Bucharest if geolocation fails
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                setUserLocation(defaultPosition); // Fallback to Bucharest if geolocation is not supported
            }
        }
    }, []);

    // Handle user authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userFavorites = userDoc.data().favorites || [];
                        setFavorites(userFavorites);
                    }
                } catch (error) {
                    console.error("Error fetching user favorites:", error);
                }
            } else {
                setFavorites([]); // Clear favorites when user logs out
            }
        });
        return unsubscribe;
    }, []);

    const toggleFavorite = async (location) => {
        if (!user) {
            console.error("User is not logged in. Cannot manage favorites.");
            return;
        }

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                console.error("User document not found in database.");
                return;
            }

            const existingFavorites = userDoc.data().favorites || [];
            const isFavorite = existingFavorites.some(fav => fav.id === location.dataId || fav.tags.name === location.tags.name);

            let updatedFavorites;

            if (isFavorite) {
                // Remove from favorites
                updatedFavorites = existingFavorites.filter(fav => fav.id !== location.dataId && fav.tags.name !== location.tags.name);
            } else {
                // Add to favorites
                updatedFavorites = [...existingFavorites, location];
            }

            await updateDoc(userDocRef, {
                favorites: updatedFavorites,
            });

            setFavorites(updatedFavorites); // Update local state
            console.log(isFavorite ? "Removed from favorites:" : "Added to favorites:", location);
        } catch (error) {
            console.error("Error managing favorites:", error);
        }
    };

    useEffect(() => {
        if (mapRef.current && locations.length > 0) {
            const bounds = L.latLngBounds();

            locations.forEach(location => {
                console.log("Adding location to bounds:", location.lat, location.lon);
                bounds.extend([location.lat, location.lon]);
            });

            console.log("Calculated bounds:", bounds);
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [locations]); // Run this effect when locations change

    const isFavorite = (location) => {
        return favorites.some(fav => fav.id === location.dataId || fav.tags.name === location.tags.name);
    };

    // Create a custom icon for the user's location
    const userLocationIcon = new L.Icon({
        iconUrl: 'yeat_back_top.svg', // Custom green dot icon
        iconSize: [50, 50],
        iconAnchor: [12, 12], // Anchor the icon in the center
        popupAnchor: [15, -10], // Popup anchor point
    });

    // Debug: Log userLocation
    useEffect(() => {
        console.log("User Location State:", userLocation);
    }, [userLocation]);

    // Ensure the map is only rendered once the userLocation is available
    if (!userLocation) {
        return <div>Loading map...</div>;
    }

    return (
        <div id="map-container">
            <MapContainer
                id="map"
                center={userLocation || defaultPosition} // Center map on user's location if available
                zoom={13}
                style={{ height: '100%', width: '100%' }} // Set height to 100% to fill the container
                whenCreated={mapInstance => { mapRef.current = mapInstance }} // Store the map instance
            >
                <TileLayer
                    url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {/* Pin the user's location with custom icon */}
                <Marker position={userLocation} icon={userLocationIcon}>
                    <Popup>This is you! :)</Popup>
                </Marker>

                {locations.map(location => (
                    <Marker key={`${location.id}-${location.lat}-${location.lon}`}
        position={[location.lat, location.lon]}>
                        <Popup>
                            <div>
                                <strong>{location.tags.name}</strong><br />
                                {location.tags.opening_hours ? `Opening Hours: ${location.tags.opening_hours}` : 'Opening Hours: Not specified'}<br />
                                {location.tags['addr:street'] ? `Street: ${location.tags['addr:street']}` : ''}<br />
                                {location.tags['addr:city'] ? `City: ${location.tags['addr:city']}` : ''}<br />
                                {location.tags['addr:postcode'] ? `Postcode: ${location.tags['addr:postcode']}` : ''}<br />
                                <button
                                    onClick={() => toggleFavorite(location)}
                                    style={{
                                        marginTop: '10px',
                                        padding: '5px',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={isFavorite(location) ? "red" : "none"}
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                        }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
