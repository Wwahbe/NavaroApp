import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GOOGLE_API_KEY } from './googleApiKey'; // Import your secret key
import { styles } from './styles'; // --- NEW: Import the styles ---

function AppContent() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  // --- State Management ---
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isCardVisible, setCardVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Finding your location...");

  // This useEffect hook runs once when the app starts
  useEffect(() => {
    const initializeApp = async () => {
      // 1. Get user's location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location services to use this app.');
        setLoading(false);
        return;
      }
      
      // 2. Get the user's current GPS coordinates
      try {
        setLoadingMessage("Finding restaurants near you...");
        let currentPosition = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentPosition.coords;
        
        // Animate the map to the user's location
        const region = { latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };
        mapRef.current?.animateToRegion(region, 1000);
        
        // --- 3. NEW: Fetch restaurants from Google Places API ---
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=restaurant&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
          setRestaurants(data.results); // Store the list of restaurants in our state
        } else {
           Alert.alert("No Restaurants Found", "Could not find any restaurants nearby.");
        }

      } catch (error) {
         console.error("Error during initialization: ", error);
         Alert.alert("Error", "An error occurred while fetching data.");
      } finally {
        setLoading(false); // Hide the loading spinner
      }
    };

    initializeApp();
  }, []);

  // --- Handlers ---
  const handleMarkerPress = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCardVisible(true);
  };
  
  const handleCloseCard = () => {
    setCardVisible(false);
    setSelectedRestaurant(null);
  };
  
  // Helper function to get a photo URL from Google's data
  const getPhotoUrl = (photoReference) => {
      if (!photoReference) {
          // A placeholder for restaurants that don't have a photo on Google
          return 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image';
      }
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
  }

  // --- Render Functions ---
  const renderRestaurantCard = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isCardVisible}
      onRequestClose={handleCloseCard}
    >
      <Pressable style={styles.modalOverlay} onPress={handleCloseCard}>
        <Pressable style={styles.cardContainer}>
          <Image 
            source={{ uri: getPhotoUrl(selectedRestaurant?.photos?.[0]?.photo_reference) }} 
            style={styles.cardImage} 
          />
          <View style={styles.cardDetails}>
             <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={2}>{selectedRestaurant?.name}</Text>
                {/* Display rating and number of ratings from Google */}
                <Text style={styles.cardRating}>{selectedRestaurant?.rating} ★ ({selectedRestaurant?.user_ratings_total})</Text>
            </View>
            <Text style={styles.cardDescription}>{selectedRestaurant?.vicinity}</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{ latitude: 33.6846, longitude: -117.8265, latitudeDelta: 0.2, longitudeDelta: 0.2 }} // Fallback to OC
        showsUserLocation={true}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.place_id} // Use Google's unique ID for each restaurant
            coordinate={{ 
                latitude: restaurant.geometry.location.lat, 
                longitude: restaurant.geometry.location.lng 
            }}
            onPress={(e) => { e.stopPropagation(); handleMarkerPress(restaurant); }}
          >
            <View style={styles.marker}>
              {/* Using a generic emoji for all markers for now */}
              <Text>🍽️</Text>
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={[styles.mapHeader, { top: insets.top + 10 }]}>
        <Text style={styles.mapHeaderText}>Navaro</Text>
        <Text style={styles.mapSubHeaderText}>Restaurants in Orange County</Text>
      </View>
      {selectedRestaurant && renderRestaurantCard()}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

