const BASE_URL = "https://localhost:7013"; // Replace with your backend base URL

export const fetchLocations = async (amenity, lat, lng) => {
    try {
        const storedLocation = localStorage.getItem('userLocation');

        if (!storedLocation) {
            throw new Error('User location not found in local storage');
        }

        // Parse the stored location
        const { latitude, longitude } = JSON.parse(storedLocation);

        const queryParams = new URLSearchParams({
            amenity: amenity,
            lat: latitude,
            lng: longitude
        });

        const response = await fetch(`${BASE_URL}/Locations/TestGetLocations?${queryParams}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error fetching locations: ${response.statusText}`);
        }

        // Get the raw response text
        const rawResponse = await response.text();
        // Parse and return JSON from the raw response
        const parsedResponse = JSON.parse(rawResponse);
        return parsedResponse;
    } catch (error) {
        console.error("fetchLocations error:", error);
        throw error; // Rethrow the error for handling by the caller
    }
};


export const processLocation = async (amenity, input) => {
    try {
        const storedLocation = localStorage.getItem('userLocation');
        const storedInput = localStorage.getItem('inputValue');

        if (!storedLocation) {
            throw new Error('User location not found in local storage');
        }

        // Parse the stored location
        const { latitude, longitude } = JSON.parse(storedLocation);


        const queryParams = new URLSearchParams({
            selectedAmenity: amenity,
            latitudeUser: latitude,
            logitudeUser: longitude,
            userInput: input
        });

        const response = await fetch(`${BASE_URL}/Search/ProcessLocationsAndFindMatches?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error searching locations: ${response.statusText}`);
        }

        // Get the raw response text
        const rawResponse = await response.text();
        // Parse and return JSON from the raw response
        const parsedResponse = JSON.parse(rawResponse);
        return parsedResponse;
    } catch (error) {
        console.error("processLocation error:", error);
        throw error; // Rethrow the error for handling by the caller
    }
};
