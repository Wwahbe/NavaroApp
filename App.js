import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// --- Main App Component ---
function AppContent() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null); // Create a ref for the MapView
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null); // State to hold user's location

  // useEffect runs once when the component mounts
  useEffect(() => {
    // NEW: Function to get user's location
    const getLocation = async () => {
      setLoading(true);
      // 1. Ask for permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please enable location services to use this app.');
        setLoading(false);
        return;
      }

      // 2. Get the current position
      try {
        let currentPosition = await Location.getCurrentPositionAsync({});
        const region = {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setLocation(region); // Save the location
        mapRef.current?.animateToRegion(region, 1000); // Animate map to user's location
      } catch (error) {
        Alert.alert("Could not fetch location", "Please check your network and location services.");
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    getLocation();
    // This is where we will fetch restaurant data from an API in the future.
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef} // Assign the ref to the map
        style={styles.map}
        // Use the hardcoded OC location as an initial fallback
        initialRegion={{
          latitude: 33.6846,
          longitude: -117.8265,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true} // Shows the blue dot for the user
      >
        {/* We will map over the 'restaurants' state to create Markers here */}
      </MapView>
      
      <View style={[styles.mapHeader, { top: insets.top + 10 }]}>
        <Text style={styles.mapHeaderText}>Navaro</Text>
        <Text style={styles.mapSubHeaderText}>Discover Restaurants in Orange County</Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Finding your location...</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapHeader: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  mapHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapSubHeaderText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});