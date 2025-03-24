import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StatusBar as RNStatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function DriverTripDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // If there's trip data in route params, use it; otherwise, use empty trip
  const tripDetail = route.params?.trip || {
    id: 'no-trip',
    status: 'completed',
    type: 'ride',
    pickup: 'No pickup location',
    dropoff: 'No dropoff location',
    fare: 0,
    distance: '0 km',
    duration: '0 min',
    date: new Date().toDateString(),
    passenger: {
      name: 'No Passenger',
      rating: 0,
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
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Trip Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Status: <Text style={styles.statusHighlight}>{tripDetail.status}</Text>
          </Text>
          <Text style={styles.dateText}>{tripDetail.date}</Text>
        </View>

        {/* Trip Card */}
        <View style={styles.tripCard}>
          <View style={styles.tripTypeContainer}>
            <MaterialIcons 
              name={tripDetail.type === 'ride' ? 'directions-car' : 'local-shipping'} 
              size={24} 
              color="#4a89f3" 
            />
            <Text style={styles.tripTypeText}>
              {tripDetail.type === 'ride' ? 'Ride' : 'Delivery'}
            </Text>
          </View>

          {/* Trip Route */}
          <View style={styles.routeContainer}>
            <View style={styles.locationContainer}>
              <View style={styles.dotMarker} />
              <Text style={styles.locationText}>{tripDetail.pickup}</Text>
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.locationContainer}>
              <View style={styles.squareMarker} />
              <Text style={styles.locationText}>{tripDetail.dropoff}</Text>
            </View>
          </View>

          {/* Trip Stats */}
          <View style={styles.tripStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${tripDetail.fare.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Fare</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{tripDetail.distance}</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{tripDetail.duration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
          </View>
        </View>

        {/* Passenger Information Card */}
        <View style={styles.passengerCard}>
          <Text style={styles.sectionTitle}>Passenger</Text>
          <View style={styles.passengerInfo}>
            <View style={styles.passengerAvatar}>
              <Text style={styles.passengerInitial}>
                {tripDetail.passenger.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.passengerDetails}>
              <Text style={styles.passengerName}>{tripDetail.passenger.name}</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{tripDetail.passenger.rating}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trip Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => global.showToast("Feature coming soon!", "info")}
          >
            <MaterialIcons name="receipt" size={20} color="#4a89f3" />
            <Text style={styles.actionText}>View Receipt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => global.showToast("Support will contact you shortly.", "info")}
          >
            <MaterialIcons name="headset-mic" size={20} color="#4a89f3" />
            <Text style={styles.actionText}>Get Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: RNStatusBar.currentHeight,
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
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  statusHighlight: {
    fontWeight: 'bold',
    color: '#4a89f3',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  routeContainer: {
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dotMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4a89f3',
    marginRight: 12,
  },
  verticalLine: {
    width: 2,
    height: 24,
    backgroundColor: '#ddd',
    marginLeft: 5,
    marginBottom: 8,
  },
  squareMarker: {
    width: 12,
    height: 12,
    backgroundColor: '#f3664a',
    marginRight: 12,
  },
  locationText: {
    fontSize: 15,
    color: '#333',
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  passengerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  passengerInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a89f3',
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a89f3',
    marginLeft: 8,
  },
});