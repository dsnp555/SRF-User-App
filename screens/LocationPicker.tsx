import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function LocationPicker() {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceType } = route.params;
  const mapRef = useRef(null);
  
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [activeField, setActiveField] = useState('pickup');
  const [searchResults, setSearchResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);

  // Get user's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        
        // Set initial pickup to current location
        const address = await getAddressFromCoordinates(location.coords.latitude, location.coords.longitude);
        setPickupLocation(address);
        setPickupCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  // Mock function to get address from coordinates (would be replaced with Geocoding API in production)
  const getAddressFromCoordinates = async (latitude, longitude) => {
    // In a real app, use Google's Geocoding API or similar
    return "Current Location";
  };

  // Mock location search function
  const searchLocations = (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Mock data - in a real app, this would call Google Places API
    const mockLocations = [
      { id: '1', name: 'Central Mall', address: '123 Main St, Downtown', coordinates: { latitude: 37.78825, longitude: -122.4324 } },
      { id: '2', name: 'Tech Park', address: '456 Innovation Ave, Tech District', coordinates: { latitude: 37.79825, longitude: -122.4224 } },
      { id: '3', name: 'Green Valley Hospital', address: '789 Health Blvd, Westside', coordinates: { latitude: 37.77825, longitude: -122.4424 } },
      { id: '4', name: 'Sunset Beach Resort', address: '101 Coastal Highway', coordinates: { latitude: 37.76825, longitude: -122.4524 } },
      { id: '5', name: 'Mountain View Apartments', address: '202 Highland Road, Northside', coordinates: { latitude: 37.80825, longitude: -122.4124 } },
    ];
    
    const results = mockLocations.filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase()) || 
      location.address.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const handleLocationSelect = (location) => {
    if (activeField === 'pickup') {
      setPickupLocation(location.name);
      setPickupCoordinates(location.coordinates);
      setActiveField('drop');
      mapRef.current?.animateToRegion({
        ...region,
        ...location.coordinates
      });
    } else {
      setDropLocation(location.name);
      setDropoffCoordinates(location.coordinates);
      
      // If both locations are set, fit map to show both markers
      if (pickupCoordinates) {
        fitMapToMarkers();
      }
    }
    setSearchResults([]);
  };

  const fitMapToMarkers = () => {
    if (mapRef.current && pickupCoordinates && dropoffCoordinates) {
      mapRef.current.fitToSuppliedMarkers(['pickup', 'dropoff'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const handleConfirm = () => {
    if (pickupLocation && dropLocation) {
      navigation.navigate('RideSelection', { 
        pickup: pickupLocation,
        dropoff: dropLocation,
        pickupCoordinates,
        dropoffCoordinates,
        serviceType
      });
    }
  };

  const handleTextChange = (text) => {
    if (activeField === 'pickup') {
      setPickupLocation(text);
      searchLocations(text);
    } else {
      setDropLocation(text);
      searchLocations(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {serviceType === 'ride' ? 'Book a Ride' : 'Send Package'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {pickupCoordinates && (
            <Marker
              identifier="pickup"
              coordinate={pickupCoordinates}
              title="Pickup"
              pinColor="#4a89f3"
            />
          )}
          {dropoffCoordinates && (
            <Marker
              identifier="dropoff"
              coordinate={dropoffCoordinates}
              title="Dropoff"
              pinColor="#f3664a"
            />
          )}
        </MapView>
      </View>

      {/* Location Inputs */}
      <View style={styles.bottomSheet}>
        <View style={styles.locationInputContainer}>
          <View style={styles.locationMarkers}>
            <View style={styles.pickupDot} />
            <View style={styles.dottedLine} />
            <View style={styles.dropoffSquare} />
          </View>
          
          <View style={styles.inputsContainer}>
            <TouchableOpacity 
              style={[
                styles.inputWrapper, 
                activeField === 'pickup' && styles.activeInput
              ]}
              onPress={() => setActiveField('pickup')}
            >
              <TextInput
                style={styles.input}
                placeholder="Pickup location"
                value={pickupLocation}
                onChangeText={handleTextChange}
                onFocus={() => setActiveField('pickup')}
                placeholderTextColor="#999"
              />
              {pickupLocation ? (
                <TouchableOpacity onPress={() => setPickupLocation('')}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.inputWrapper, 
                activeField === 'drop' && styles.activeInput
              ]}
              onPress={() => setActiveField('drop')}
            >
              <TextInput
                style={styles.input}
                placeholder="Destination"
                value={dropLocation}
                onChangeText={handleTextChange}
                onFocus={() => setActiveField('drop')}
                placeholderTextColor="#999"
              />
              {dropLocation ? (
                <TouchableOpacity onPress={() => setDropLocation('')}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            style={styles.searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.resultItem}
                onPress={() => handleLocationSelect(item)}
              >
                <View style={styles.locationIconContainer}>
                  <MaterialIcons name="location-on" size={22} color="#4a89f3" />
                </View>
                <View style={styles.locationDetails}>
                  <Text style={styles.locationName}>{item.name}</Text>
                  <Text style={styles.locationAddress}>{item.address}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Confirm Button */}
        {pickupLocation && dropLocation && searchResults.length === 0 && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm Locations</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  locationInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  locationMarkers: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 15,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4a89f3',
  },
  dottedLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#ddd',
    marginVertical: 4,
    marginLeft: 5,
  },
  dropoffSquare: {
    width: 12,
    height: 12,
    backgroundColor: '#f3664a',
    marginTop: 4,
  },
  inputsContainer: {
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  activeInput: {
    borderColor: '#4a89f3',
    backgroundColor: '#f5f8ff',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  searchResults: {
    maxHeight: 300,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  locationAddress: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  buttonContainer: {
    padding: 16,
  },
  confirmButton: {
    backgroundColor: '#4a89f3',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});