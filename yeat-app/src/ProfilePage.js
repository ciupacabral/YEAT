import React from 'react';
import Favorites from './components/Favourites.js'; // Import the updated Favorites component
import History from './components/History.js'; // Import the History component

const ProfilePage = ({ onSearch }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto py-10 px-4">
                {/* Profile Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">Your Profile</h1>
                    <p className="text-gray-600 text-center">
                        Explore your recent search history and saved favorites below.
                    </p>
                </header>

                {/* Favorites Section */}
                <Favorites onSearch={onSearch} />

                {/* History Section */}
                <section className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Search History</h2>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                        <History onSearch={onSearch} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
