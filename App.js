import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import Video from 'react-native-video';

// --- Import Assets ---

// Banners
const ariaImage = require('./assets/images/aria.jpg');
const bellagioImage = require('./assets/images/bellagio.jpg');
const caesarsImage = require('./assets/images/caesars.jpg');
const cosmopolitanImage = require('./assets/images/cosmopolitan.jpg');
const fontainebleauImage = require('./assets/images/fontainebleau.jpg');
const mgmImage = require('./assets/images/mgm.jpg');
const venetianImage = require('./assets/images/venetian.jpg');
const wynnImage = require('./assets/images/wynn.jpg');

// Logos
const ariaLogo = require('./assets/logos/aria-logo.png');
const bellagioLogo = require('./assets/logos/bellagio-logo.png');
const caesarsLogo = require('./assets/logos/caesars-logo.png');
const cosmoLogo = require('./assets/logos/cosmo-logo.png');
const fontainebleauLogo = require('./assets/logos/fontainebleau-logo.png');
const mgmLogo = require('./assets/logos/mgm-logo.png');
const venetianLogo = require('./assets/logos/venetian-logo.png');
const wynnLogo = require('./assets/logos/wynn-logo.png');

// Venetian Restaurant Videos
const chica01 = require('./assets/videos/chica_01.mp4');
const chica02 = require('./assets/videos/chica_02.mp4');
const lavo01 = require('./assets/videos/lavo_01.mp4');
const lavo02 = require('./assets/videos/lavo_02.mp4');
const sushisamba01 = require('./assets/videos/sushisamba_01.mp4');
const sushisamba02 = require('./assets/videos/sushisamba_02.mp4');

// Aria Restaurant Videos
const javiers01 = require('./assets/videos/javiers_01.mp4');
const javiers02 = require('./assets/videos/javiers_02.mp4');
const catch01 = require('./assets/videos/catch_01.mp4');
const catch02 = require('./assets/videos/catch_02.mp4');
const dintaifung01 = require('./assets/videos/dintaifung_01.mp4');
const dintaifung02 = require('./assets/videos/dintaifung_02.mp4');

// Bellagio Restaurant Videos
const spago01 = require('./assets/videos/spago_01.mp4');
const spago02 = require('./assets/videos/spago_02.mp4');
const lago01 = require('./assets/videos/lago_01.mp4');
const lago02 = require('./assets/videos/lago_02.mp4');
const primesteakhouse01 = require('./assets/videos/primesteakhouse_01.mp4');
const primesteakhouse02 = require('./assets/videos/primesteakhouse_02.mp4');


// --- Data Structure with Videos ---
const hotels = [
  {
    id: '1', name: 'Aria', image: ariaImage, logo: ariaLogo, location: { latitude: 36.1074, longitude: -115.1766 },
    restaurants: [
      { id: '1a', name: 'Javiers', emoji: '🌮', description: 'Authentic Mexican cuisine in a vibrant setting.', videos: [javiers01, javiers02] },
      { id: '1b', name: 'Din Tai Fung', emoji: '🥟', description: 'World-renowned for its soup dumplings.', videos: [dintaifung01, dintaifung02] },
      { id: '1c', name: 'Catch', emoji: '🐟', description: 'Trendy seafood and sushi spot.', videos: [catch01, catch02] },
    ],
  },
  {
    id: '2', name: 'Bellagio', image: bellagioImage, logo: bellagioLogo, location: { latitude: 36.1126, longitude: -115.1767 },
    restaurants: [
      { id: '2a', name: 'Spago', emoji: '🥂', description: 'Wolfgang Puck\'s flagship restaurant.', videos: [spago01, spago02] },
      { id: '2b', name: 'LAGO', emoji: '🇮🇹', description: 'Italian small plates by Julian Serrano.', videos: [lago01, lago02] },
      { id: '2c', name: 'PRIME Steakhouse', emoji: '🥩', description: 'Classic steakhouse with fountain views.', videos: [primesteakhouse01, primesteakhouse02] },
    ],
  },
  {
    id: '3', name: 'Caesars Palace', image: caesarsImage, logo: caesarsLogo, location: { latitude: 36.1162, longitude: -115.1745 },
    restaurants: [ { id: '3c', name: 'Hell\'s Kitchen', emoji: '🔥', description: 'Gordon Ramsay\'s famous eatery.' } ],
  },
  {
    id: '4', name: 'Cosmopolitan', image: cosmopolitanImage, logo: cosmoLogo, location: { latitude: 36.1097, longitude: -115.1738 },
    restaurants: [ { id: '4a', name: 'Zuma', emoji: '🍱', description: 'Contemporary Japanese izakaya.' } ],
  },
  {
    id: '5', name: 'Wynn', image: wynnImage, logo: wynnLogo, location: { latitude: 36.1265, longitude: -115.1659 },
    restaurants: [ { id: '5a', name: 'Wing Lei', emoji: '🍜', description: 'Michelin-starred Chinese food.' } ],
  },
   {
    id: '6', name: 'MGM Grand', image: mgmImage, logo: mgmLogo, location: { latitude: 36.1026, longitude: -115.1693 },
    restaurants: [ {id: '6a', name: 'Joël Robuchon', emoji: '🇫🇷', description: 'Three Michelin star French cuisine.'} ],
  },
  {
    id: '7',
    name: 'The Venetian',
    image: venetianImage,
    logo: venetianLogo,
    location: { latitude: 36.1212, longitude: -115.1697 },
     restaurants: [
        {id: '7a', name: 'SUSHISAMBA', emoji: '🍣', description: 'Japanese, Brazilian and Peruvian cuisine.', videos: [sushisamba01, sushisamba02]},
        {id: '7b', name: 'LAVO', emoji: '🇮🇹', description: 'Italian dining with a vibrant lounge.', videos: [lavo01, lavo02]},
        {id: '7c', name: 'CHICA', emoji: '💃', description: 'Latin cuisine from Chef Lorena Garcia.', videos: [chica01, chica02]},
    ]
  },
   {
    id: '8', name: 'Fontainebleau', image: fontainebleauImage, logo: fontainebleauLogo, location: { latitude: 36.1362, longitude: -115.1617 },
     restaurants: [ {id: '8a', name: 'Komodo', emoji: '🐉', description: 'Southeast Asian cuisine.'} ],
  },
];

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

function AppContent() {
  const insets = useSafeAreaInsets();
  const [currentView, setCurrentView] = useState('map');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isCardVisible, setCardVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleMarkerPress = (hotel) => {
    setSelectedHotel(hotel);
    setCardVisible(true);
  };
  
  const handleCloseCard = () => {
    setCardVisible(false);
    setSelectedHotel(null);
  };

  const handleViewFeed = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setCardVisible(false);
    setCurrentView('feed');
  };

  const handleExitFeed = () => {
    setCurrentView('map');
    setCardVisible(true);
    setSelectedRestaurant(null);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index);
    }
  }).current;

  const renderHotelCard = () => (
    <Modal
      animationType="fade" // Changed for a subtle fade-in
      transparent={true}
      visible={isCardVisible}
      onRequestClose={handleCloseCard}
    >
      <Pressable style={styles.modalOverlay} onPress={handleCloseCard}>
        {/* We wrap the card in a Pressable to stop taps from closing it */}
        <Pressable style={styles.cardContainer}>
          <Image source={selectedHotel?.image} style={styles.cardImage} />
          <View style={styles.cardDetails}>
            <Text style={styles.cardTitle}>{selectedHotel?.name}</Text>
            <Text style={styles.restaurantListHeader}>Restaurants Inside:</Text>
          </View>
          <ScrollView style={styles.restaurantList}>
            {selectedHotel?.restaurants.map(restaurant => (
              <Pressable key={restaurant.id} style={styles.restaurantRow} onPress={() => restaurant.videos && handleViewFeed(restaurant)}>
                <Text style={styles.restaurantEmoji}>{restaurant.emoji}</Text>
                <View style={styles.restaurantInfo}>
                   <Text style={styles.restaurantName}>{restaurant.name}</Text>
                   <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
                </View>
                {restaurant.videos && (
                    <View style={styles.viewFeedButton}>
                        <Text style={styles.viewFeedButtonText}>View Feed</Text>
                    </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );

  const renderFeedView = () => (
    <View style={styles.fullScreen}>
      <FlatList
        data={selectedRestaurant?.videos || []}
        renderItem={({ item, index }) => (
          <View style={styles.videoContainer}>
            <Video
              source={item}
              style={styles.video}
              resizeMode="cover"
              repeat={true}
              paused={index !== currentVideoIndex}
            />
          </View>
        )}
        keyExtractor={(item, index) => `${selectedRestaurant.id}_${index}`}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={handleExitFeed}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <View style={[styles.videoOverlay, { bottom: insets.bottom + 20 }]}>
          <Text style={styles.videoRestaurantName}>{selectedRestaurant?.name}</Text>
      </View>
    </View>
  );

  const renderMapView = () => (
     <View style={styles.fullScreen}>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 36.114647, longitude: -115.172813, latitudeDelta: 0.04, longitudeDelta: 0.02 }}
        onPress={handleCloseCard}
      >
        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            coordinate={hotel.location}
            onPress={(e) => { e.stopPropagation(); handleMarkerPress(hotel); }}
          >
            <View style={styles.marker}>
              <Image source={hotel.logo} style={styles.markerImage} />
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={[styles.mapHeader, { top: insets.top + 10 }]}>
        <Text style={styles.mapHeaderText}>Navaro</Text>
        <Text style={styles.mapSubHeaderText}>Discover your next bite.</Text>
      </View>
      {selectedHotel && renderHotelCard()}
    </View>
  );

  return (
    <View style={styles.container}>
      {currentView === 'map' ? renderMapView() : renderFeedView()}
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

// --- UPDATED STYLES for Centered Popup ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  fullScreen: { flex: 1 },
  mapHeader: {
    position: 'absolute', left: 20, right: 20, backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 5,
  },
  mapHeaderText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  mapSubHeaderText: { fontSize: 14, textAlign: 'center', color: '#555' },
  marker: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 5, borderRadius: 12,
    borderColor: '#ccc', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 2, elevation: 3,
  },
  markerImage: { width: 35, height: 35, resizeMode: 'contain' },
  // UPDATED
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',     // Center horizontally
    backgroundColor: 'rgba(0,0,0,0.5)', // Darken the background
  },
  // UPDATED
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 20, // Apply to all corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    width: '90%', // Make it a rectangle, not full width
    maxHeight: SCREEN_HEIGHT * 0.7, // Limit height
  },
  cardImage: { width: '100%', height: 180, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  cardDetails: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  restaurantListHeader: {
    fontSize: 16, fontWeight: '600', color: '#666',
    borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15,
  },
  restaurantList: { paddingHorizontal: 20, paddingBottom: 10 },
  restaurantRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  restaurantEmoji: { fontSize: 32, marginRight: 15 },
  restaurantInfo: { flex: 1 },
  restaurantName: { fontSize: 18, fontWeight: '600' },
  restaurantDescription: { fontSize: 14, color: '#555', marginTop: 2 },
  viewFeedButton: {
    backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewFeedButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'black',
  },
  video: { ...StyleSheet.absoluteFillObject },
  backButton: {
    position: 'absolute', left: 20, backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, zIndex: 10,
  },
  backButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  videoOverlay: { position: 'absolute', left: 20 },
  videoRestaurantName: {
    color: 'white', fontSize: 22, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10,
  },
});

