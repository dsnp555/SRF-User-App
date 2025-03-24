import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  StatusBar as RNStatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

export default function RecentRidesScreen() {
  const [filter, setFilter] = useState('all'); // 'all', 'rides', 'deliveries'

  // Mock data for recent rides
  const rides = [
    {
      id: '1',
      type: 'ride',
      location: 'Tech Park',
      destination: 'Home',
      date: 'Yesterday, 9:30 AM',
      price: '$12.50',
      status: 'completed',
    },
    {
      id: '2',
      type: 'delivery',
      location: 'Central Mall',
      destination: 'Office',
      date: 'Mar 5, 3:15 PM',
      price: '$8.75',
      status: 'completed',
    },
    {
      id: '3',
      type: 'ride',
      location: 'Green Valley Hospital',
      destination: 'Apartment',
      date: 'Feb 28, 11:20 AM',
      price: '$15.30',
      status: 'completed',
    },
    {
      id: '4',
      type: 'ride',
      location: 'Airport',
      destination: 'Hotel Sunset',
      date: 'Feb 25, 2:45 PM',
      price: '$22.80',
      status: 'completed',
    },
    {
      id: '5',
      type: 'delivery',
      location: 'Grocery Store',
      destination: 'Home',
      date: 'Feb 20, 5:30 PM',
      price: '$6.25',
      status: 'completed',
    },
    {
      id: '6',
      type: 'ride',
      location: 'Downtown',
      destination: 'Shopping Mall',
      date: 'Feb 18, 10:15 AM',
      price: '$9.45',
      status: 'completed',
    },
    {
      id: '7',
      type: 'delivery',
      location: 'Pharmacy',
      destination: 'Home',
      date: 'Feb 15, 4:20 PM',
      price: '$7.50',
      status: 'completed',
    },
  ];

  const filteredRides = filter === 'all' 
    ? rides 
    : rides.filter(ride => ride.type === filter);

  const renderRideItem = ({ item }) => (
    <TouchableOpacity style={styles.rideItem}>
      <View style={styles.rideIconContainer}>
        <MaterialIcons 
          name={item.type === 'ride' ? 'directions-car' : 'local-shipping'} 
          size={24} 
          color="#fff" 
        />
      </View>
      <View style={styles.rideDetails}>
        <View style={styles.rideMain}>
          <View>
            <Text style={styles.rideLocation}>{item.location}</Text>
            <Text style={styles.rideDestination}>To: {item.destination}</Text>
          </View>
          <Text style={styles.ridePrice}>{item.price}</Text>
        </View>
        <View style={styles.rideFooter}>
          <Text style={styles.rideDate}>{item.date}</Text>
          <View style={styles.rideStatusContainer}>
            <View 
              style={[
                styles.statusDot, 
                item.status === 'completed' ? styles.statusCompleted : styles.statusCancelled
              ]} 
            />
            <Text 
              style={[
                styles.rideStatus,
                item.status === 'completed' ? styles.statusTextCompleted : styles.statusTextCancelled
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="history" size={64} color="#ddd" />
      <Text style={styles.emptyText}>No recent rides</Text>
      <Text style={styles.emptySubtext}>Your rides will appear here</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Rides</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterTab,
            filter === 'all' && styles.activeFilter
          ]}
          onPress={() => setFilter('all')}
        >
          <Text 
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterTab,
            filter === 'ride' && styles.activeFilter
          ]}
          onPress={() => setFilter('ride')}
        >
          <Text 
            style={[
              styles.filterText,
              filter === 'ride' && styles.activeFilterText
            ]}
          >
            Rides
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterTab,
            filter === 'delivery' && styles.activeFilter
          ]}
          onPress={() => setFilter('delivery')}
        >
          <Text 
            style={[
              styles.filterText,
              filter === 'delivery' && styles.activeFilterText
            ]}
          >
            Deliveries
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rides List */}
      <FlatList
        data={filteredRides}
        renderItem={renderRideItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ridesList}
        ListEmptyComponent={EmptyList}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#4a89f3',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  ridesList: {
    padding: 16,
    paddingBottom: 32,
  },
  rideItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rideIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4a89f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rideDetails: {
    flex: 1,
  },
  rideMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rideLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  rideDestination: {
    fontSize: 14,
    color: '#666',
  },
  ridePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a89f3',
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rideDate: {
    fontSize: 13,
    color: '#888',
  },
  rideStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusCompleted: {
    backgroundColor: '#34c759',
  },
  statusCancelled: {
    backgroundColor: '#ff3b30',
  },
  rideStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusTextCompleted: {
    color: '#34c759',
  },
  statusTextCancelled: {
    color: '#ff3b30',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
}); 