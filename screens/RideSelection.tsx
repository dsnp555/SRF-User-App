import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';

const RIDE_TYPES = [
  {
    id: 'economy',
    name: 'Economy',
    price: 12.50,
    time: '5 min',
    image: 'https://api.a0.dev/assets/image?text=economy%20car%20sedan%20simple&aspect=1:1&seed=123',
  },
  {
    id: 'comfort',
    name: 'Comfort',
    price: 18.75,
    time: '3 min',
    image: 'https://api.a0.dev/assets/image?text=comfort%20car%20modern%20sedan&aspect=1:1&seed=456',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 25.00,
    time: '7 min',
    image: 'https://api.a0.dev/assets/image?text=premium%20luxury%20car%20sedan&aspect=1:1&seed=789',
  },
];

const DELIVERY_TYPES = [
  {
    id: 'standard',
    name: 'Standard',
    price: 8.50,
    time: '30 min',
    image: 'https://api.a0.dev/assets/image?text=delivery%20scooter%20simple&aspect=1:1&seed=101',
  },
  {
    id: 'express',
    name: 'Express',
    price: 14.75,
    time: '15 min',
    image: 'https://api.a0.dev/assets/image?text=fast%20delivery%20motorcycle&aspect=1:1&seed=202',
  },
  {
    id: 'scheduled',
    name: 'Scheduled',
    price: 10.25,
    time: 'Plan ahead',
    image: 'https://api.a0.dev/assets/image?text=scheduled%20delivery%20van&aspect=1:1&seed=303',
  },
];

export default function RideSelection() {
  const navigation = useNavigation();
  const route = useRoute();
  const { pickup, dropoff, serviceType, pickupCoordinates, dropoffCoordinates } = route.params;
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [mapRegion, setMapRegion] = useState(null);

  // Options based on service type
  const options = serviceType === 'ride' ? RIDE_TYPES : DELIVERY_TYPES;

  // Calculate the map region to fit both pickup and dropoff
  useEffect(() => {
    if (pickupCoordinates && dropoffCoordinates) {
      // Calculate the center point between pickup and dropoff
      const midLat = (pickupCoordinates.latitude + dropoffCoordinates.latitude) / 2;
      const midLng = (pickupCoordinates.longitude + dropoffCoordinates.longitude) / 2;
      
      // Calculate the span with some padding
      const latDelta = Math.abs(pickupCoordinates.latitude - dropoffCoordinates.latitude) * 1.5;
      const lngDelta = Math.abs(pickupCoordinates.longitude - dropoffCoordinates.longitude) * 1.5;
      
      setMapRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(latDelta, 0.03),
        longitudeDelta: Math.max(lngDelta, 0.03),
      });
    }
  }, [pickupCoordinates, dropoffCoordinates]);

  useEffect(() => {
    // Simulate API call to calculate distance and duration
    setTimeout(() => {
      setDistance('5.2 km');
      setDuration('15 min');
      setSelectedOption(options[0].id);
      setLoading(false);
    }, 1500);
  }, []);

  const handleConfirm = () => {
    const selectedItem = options.find(item => item.id === selectedOption);
    
    navigation.navigate('Confirmation', {
      pickup,
      dropoff,
      serviceType,
      option: selectedItem,
      distance,
      duration,
      paymentMethod,
      pickupCoordinates,
      dropoffCoordinates
    });
  };

  const renderMap = () => {
    if (!mapRegion) {
      return (
        <View style={styles.mapContainer}>
          <ActivityIndicator size="large" color="#4a89f3" />
        </View>
      );
    }
    
    return (
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map}
          region={mapRegion}
          mapType="standard"
        >
          {pickupCoordinates && (
            <Marker
              coordinate={pickupCoordinates}
              title="Pickup"
              pinColor="#4a89f3"
            />
          )}
          
          {dropoffCoordinates && (
            <Marker
              coordinate={dropoffCoordinates}
              title="Destination"
              pinColor="#f3664a"
            />
          )}
          
          {pickupCoordinates && dropoffCoordinates && (
            <Polyline
              coordinates={[pickupCoordinates, dropoffCoordinates]}
              strokeWidth={4}
              strokeColor="#f3664a"
            />
          )}
        </MapView>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#4a89f3" />
          <Text style={styles.loadingText}>Calculating best routes...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Select {serviceType === 'ride' ? 'Ride' : 'Delivery'}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Map View */}
      {renderMap()}
      
      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Options List */}
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedOption === item.id && styles.selectedCard
              ]}
              onPress={() => setSelectedOption(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.optionImage} />
              <View style={styles.optionInfo}>
                <Text style={styles.optionName}>{item.name}</Text>
                <Text style={styles.optionMeta}>{item.time}</Text>
              </View>
              <Text style={styles.optionPrice}>${item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.optionsList}
        />
        
        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <View style={styles.infoRow}>
            <MaterialIcons name="straighten" size={20} color="#666" />
            <Text style={styles.infoText}>{distance}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={20} color="#666" />
            <Text style={styles.infoText}>{duration}</Text>
          </View>
        </View>
        
        {/* Payment Method */}
        <TouchableOpacity style={styles.paymentButton}>
          <MaterialIcons name="payment" size={20} color="#4a89f3" />
          <Text style={styles.paymentText}>{paymentMethod}</Text>
          <MaterialIcons name="keyboard-arrow-right" size={20} color="#666" />
        </TouchableOpacity>
        
        {/* Confirm Button */}
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            !selectedOption && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedOption}
        >
          <Text style={styles.confirmButtonText}>
            Confirm {serviceType === 'ride' ? 'Ride' : 'Delivery'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  optionsList: {
    paddingBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedCard: {
    backgroundColor: '#edf3ff',
    borderColor: '#4a89f3',
    borderWidth: 1,
  },
  optionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionMeta: {
    fontSize: 14,
    color: '#666',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a89f3',
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
  },
  paymentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#4a89f3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});