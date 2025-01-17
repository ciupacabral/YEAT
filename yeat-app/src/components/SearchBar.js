import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase"; // Firebase imports
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { fetchLocations } from './apiService.js';
import { processLocation } from './apiService.js'; // Import your API service

// Wrap the component with React.forwardRef
const SearchBar = React.forwardRef(({ onLocationSelect, setLoading }, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [locations, setLocations] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("restaurant");
    const [user, setUser] = useState(null);

    const categoryMapping = {
        restaurant: "Restaurant",
        fast_food: "Fast-Food",
        cafe: "Cafe",
        bar: "Bar",
        pub: "Pub",
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    const scrollToSearchBar = () => {
        if (ref.current) {
            ref.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
            });
        }
    };

    const handleAPICall = async (searchInput = inputValue, category = selectedCategory) => {
        console.log("Searching:", { inputValue: searchInput, selectedCategory: category });

        setLoading(true); // Start loading
        if (user) {
            const search = {
                input: searchInput,
                category: category,
                timestamp: new Date().toISOString(),
            };

            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    console.error("User document not found in database.");
                    setLoading(false);
                    return;
                }

                const existingSearches = userDoc.data().searches || [];
                const updatedSearches = [search, ...existingSearches].slice(0, 5);

                await updateDoc(userDocRef, {
                    searches: updatedSearches,
                });

                console.log("Search saved:", search);
            } catch (error) {
                console.error("Error saving search:", error);
                setLoading(false);
                return; // Return early to prevent further execution
            }
        }

        try {
            // Fetch and process locations from the API using fetchLocations
            const data = await fetchLocations(category);

            console.log("Raw API Response:", data);

            // Try alternative parsing methods
            let locations = [];

            // Method 1: Check if data itself is an array
            if (Array.isArray(data)) {
                locations = data;
            }
            // Method 2: Try parsing the entire response as an array
            else if (typeof data === "string") {
                try {
                    locations = JSON.parse(data);
                } catch (parseError) {
                    console.error("Error parsing response as JSON:", parseError);
                }
            }
            // Method 3: Check for other potential array properties
            else if (data.data && Array.isArray(data.data)) {
                locations = data.data;
            }

            // Log only the first 10 locations
            const locationsToLog = locations.slice(0, 10);
            console.log(`First ${locationsToLog.length} locations received:`, locationsToLog);

            // Set the locations state
            setLocations(locations);

        } catch (error) {
            console.error("Error handling search:", error);
            setLocations([]);
        }

        try {
            console.log(`Calling API with: Category = ${category}, Search Input = ${searchInput}`);
            const data = await processLocation(category, searchInput); // API call

            console.log("Raw API Response:", data);

            let locations = [];
            if (Array.isArray(data)) {
                locations = data;
            } else if (typeof data === "string") {
                try {
                    locations = JSON.parse(data);
                } catch (parseError) {
                    console.error("Error parsing response as JSON:", parseError);
                }
            } else if (data.data && Array.isArray(data.data)) {
                locations = data.data;
            }

            console.log(`Number of locations received: ${locations.length}`);
            onLocationSelect(locations);
        } catch (error) {
            console.error("Error handling search:", error);
            onLocationSelect([]);
        } finally {
            setLoading(false); // Stop loading regardless of success or error
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            scrollToSearchBar(); // Scroll to the search bar when Enter is pressed
            handleAPICall(); // Trigger API call only when Enter is pressed
        }
    };

    const handleInputClick = () => {
        scrollToSearchBar(); // Scroll to search bar when clicked
    };

    return (
        <div>
            <div className="relative mt-2 rounded-md shadow-sm w-auto h-16">
                <div
                    className="absolute inset-y-0 left-0 flex items-center pl-1 cursor-pointer"
                    onClick={() => {
                        scrollToSearchBar(); // Scroll to search bar when clicked
                        handleAPICall(); // Trigger API call when clicked
                    }}
                >
                    <span className="text-primaryOrange sm:text-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </span>
                </div>
                <input
                    ref={ref} // Attach the forwarded ref to the input
                    id="search"
                    name="search"
                    type="text"
                    placeholder="Where / what to eat..."
                    className="block w-full h-16 rounded-md border-0 py-2 pl-8 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress} // Trigger API call on Enter key press
                    onClick={handleInputClick} // Scroll to search bar when clicked
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="category" className="sr-only">
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-movuliu focus:ring-2 focus:ring-inset focus:ring-movuliu sm:text-sm"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {Object.entries(categoryMapping).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
});

export default SearchBar;
