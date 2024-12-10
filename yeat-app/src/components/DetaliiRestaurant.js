

 //You can integrate this component into your main application where the pins are located.

 import React, { useState } from "react";




 // Sample data for testing
 const sampleRestaurantData = {
   type: "Cafe",
   address: "123 Main St, Cityville",
   hours: "8:00 AM - 10:00 PM",
   rating: "4.5/5",
   busyness: "Moderate",
 };

 //favorite buttons, stars and photo place

const RestaurantInfoBox = ({
  restaurantType,
  fullAddress,
  workingHours,
  userRating,
  busynessScore,
  photoUrl,
  onClose,
  onFavorite,
}) => {
  // Function to render stars for user rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    if (halfStar) {
      stars.push("☆");
    }
    while (stars.length < 5) {
      stars.push("☆");
    }
    return stars.join(" ");
  };

  return (
    <div style={styles.container}>
      <button style={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      <h2 style={styles.header}>Restaurant Details</h2>
      {photoUrl && <img src="logged_profile.png" alt="Restaurant" style={styles.image} />}
      <div style={styles.detail}>
        <strong>Type:</strong> {restaurantType || "Loading..."}
      </div>
      <div style={styles.detail}>
        <strong>Address:</strong> {fullAddress || "Loading..."}
      </div>
      <div style={styles.detail}>
        <strong>Working Hours:</strong> {workingHours || "Loading..."}
      </div>
      <div style={styles.detail}>
        <strong>User Rating:</strong> {userRating ? renderStars(userRating) : "Loading..."}
      </div>
      <div style={styles.detail}>
        <strong>Busyness:</strong> {busynessScore || "Loading..."}
      </div>
      <button style={styles.favoriteButton} onClick={onFavorite}>
        Add to Favorites
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "10%",
    right: "5%",
    height: "600px",
    width: "300px",
    padding: "20px",
    backgroundColor: "#FF7043",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
  imageContainer: {
    width: "80px", 
    height: "80px", 
    overflow: "hidden", 
    borderRadius: "8px", 
    marginBottom: "10px",
  },
  image: {
    width: "100%", 
    height: "100%", 
    objectFit: "cover", 
    
  },
  header: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#550c55",
  },
  detail: {
    fontSize: "14px",
    margin: "8px 0",
    color: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#fff",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  favoriteButton: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#550c55",
    border: "none",
    color: "#fff",
    fontSize: "14px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default RestaurantInfoBox;



