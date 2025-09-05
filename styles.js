import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 255, 255, 0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  loadingText: { marginTop: 10, fontSize: 16, fontWeight: '600' },
  mapHeader: { position: 'absolute', left: 20, right: 20, backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: 15, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, },
  mapHeaderText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  mapSubHeaderText: { fontSize: 14, textAlign: 'center', color: '#555' },
  marker: { backgroundColor: 'white', padding: 8, borderRadius: 20, borderColor: '#555', borderWidth: 1, },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', },
  cardContainer: { backgroundColor: 'white', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10, width: '90%', maxHeight: SCREEN_HEIGHT * 0.7, },
  cardImage: { width: '100%', height: 150, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#eee' },
  cardDetails: { padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', flex: 1, marginRight: 10 },
  cardRating: { fontSize: 16, fontWeight: '600', color: '#555' },
  cardDescription: { fontSize: 16, color: '#666', marginTop: 5 },
});
