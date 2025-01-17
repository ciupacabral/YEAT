import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Banner from "./components/Banner.js";
import SearchBar from "./components/SearchBar.js";
import MapComponent from "./components/MapComponent.js";
import BackToTop from "./components/BackToTop";
import GeolocationComponent from "./components/GeolocationComponent";
import ProfilePage from "./ProfilePage.js";
import Footer from "./components/Footer.js";
import "./App.css";

function App() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchBarRef = React.createRef(); // Create the ref

    const handleLocationSelect = (locations) => {
        setLocations(locations);
        setLoading(false);
    };

    return (
        <Router>
            <div className="App">
                <GeolocationComponent />
                <Navbar />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Banner />
                                <header className="App-header">
                                    <div className="search-bar">
                                        <SearchBar
                                            ref={searchBarRef} // Pass the ref to SearchBar
                                            onLocationSelect={handleLocationSelect}
                                            setLoading={setLoading}
                                        />
                                    </div>
                                </header>
                                <main className="App-body">
                                    {loading ? (
                                        <div className="loading-container">
                                            <img
                                                src="/yeat_back_top.svg"
                                                alt="Loading animation"
                                                className="loading-svg"
                                            />
                                            <p className="loading-text">Loading locations...</p>
                                        </div>
                                    ) : (
                                        <div className="map">
                                            <MapComponent locations={locations} />
                                        </div>
                                    )}
                                </main>
                                <BackToTop />
                                <footer className="App-footer">
                                    <Footer />
                                </footer>
                            </>
                        }
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
