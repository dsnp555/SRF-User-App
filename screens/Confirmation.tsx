import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useToast } from '../App';

export default function Confirmation() {
  const navigation = useNavigation();
  const route = useRoute();
  const { showToast } = useToast();
  const { 
    pickup, 
    dropoff, 
    serviceType, 
    option, 
    distance, 
    duration, 
    paymentMethod,
    pickupCoordinates,
    dropoffCoordinates 
  } = route.params;
  
  const [status, setStatus] = useState('confirming');
  const [eta, setEta] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  
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
    // Simulate backend API call to confirm ride/delivery
    const timer = setTimeout(() => {
      setStatus('confirmed');
      setEta('15 min');
      
      // Show toast notification
      showToast(`${serviceType === 'ride' ? 'Ride' : 'Delivery'} confirmed!`, 'success');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Render the map section
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
          {status === 'confirming' ? 'Confirming...' : 'Trip Details'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Map View */}
      {renderMap()}
      
      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {status === 'confirming' ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4a89f3" />
            <Text style={styles.loadingText}>Confirming your {serviceType}...</Text>
          </View>
        ) : (
          <>
            {/* Trip Info */}
            <View style={styles.tripSection}>
              <View style={styles.tripDetail}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="my-location" size={20} color="#4a89f3" />
                </View>
                <Text style={styles.locationText} numberOfLines={1}>{pickup}</Text>
              </View>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
              </View>
              
              <View style={styles.tripDetail}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name="location-on" size={20} color="#f3664a" />
                </View>
                <Text style={styles.locationText} numberOfLines={1}>{dropoff}</Text>
              </View>
            </View>
            
            {/* Ride Info */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>{serviceType === 'ride' ? 'Ride' : 'Delivery'} Details</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{option?.name || 'Standard'}</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialIcons name="access-time" size={20} color="#666" />
                  <Text style={styles.infoLabel}>Estimated Time</Text>
                  <Text style={styles.infoValue}>{eta}</Text>
                </View>
                
                <View style={styles.infoDivider} />
                
                <View style={styles.infoItem}>
                  <MaterialIcons name="straighten" size={20} color="#666" />
                  <Text style={styles.infoLabel}>Distance</Text>
                  <Text style={styles.infoValue}>{distance}</Text>
                </View>
              </View>
            </View>

            {/* Payment Info */}
            <View style={styles.paymentCard}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Method</Text>
                <Text style={styles.paymentValue}>{paymentMethod}</Text>
              </View>
              
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Fare</Text>
                <Text style={styles.paymentValue}>${option?.price?.toFixed(2) || '15.00'}</Text>
              </View>
            </View>
            
            {/* Action Buttons */}
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                showToast(`${serviceType === 'ride' ? 'Ride' : 'Delivery'} canceled successfully`, 'success');
                navigation.navigate('RiderTabs', { screen: 'HomeTab' });
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel {serviceType === 'ride' ? 'Ride' : 'Delivery'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => showToast('Trip status shared', 'success')}
            >
              <Text style={styles.shareButtonText}>Share trip status</Text>
              <MaterialIcons name="share" size={18} color="#4a89f3" style={styles.shareIcon} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    zIndex: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  tripSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  divider: {
    paddingLeft: 16,
    height: 16,
  },
  dividerLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  badge: {
    backgroundColor: '#e6efff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4a89f3',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  infoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
  },
  paymentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#f3664a',
    fontWeight: '600',
  },
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    color: '#4a89f3',
    fontWeight: '500',
  },
  shareIcon: {
    marginLeft: 4,
  },
});