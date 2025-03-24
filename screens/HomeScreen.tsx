import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions,
  StatusBar as RNStatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentUser } from '../services/authService';
import { useToast } from '../App';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const [activeService, setActiveService] = useState('ride');
  const [userData, setUserData] = useState({
    name: 'Guest User',
    email: '',
    photoURL: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserData({
            name: user.name || 'Guest User',
            email: user.email || '',
            photoURL: null
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("Failed to load user data", "error");
      }
    };

    fetchUserData();
  }, []);

  const handleBookRide = () => {
    navigation.navigate('LocationPicker', { serviceType: 'ride' });
  };

  const handleSendPackage = () => {
    navigation.navigate('LocationPicker', { serviceType: 'delivery' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {userData.photoURL ? (
              <Image 
                source={{ uri: userData.photoURL }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {userData.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name} numberOfLines={1}>
              {userData.name}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#4a89f3', '#3367d6']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Where to today?</Text>
              <Text style={styles.heroSubtitle}>Book a ride or send a package</Text>
            </View>
            <Image 
              source={{ uri: 'https://api.a0.dev/assets/image?text=RIDE&width=120&height=120&backgroundColor=transparent&foregroundColor=white&fontSize=0&seed=123' }}
              style={styles.heroImage}
            />
          </LinearGradient>
        </View>
        
        {/* Service Selector */}
        <View style={styles.serviceSelector}>
          <TouchableOpacity 
            style={[
              styles.serviceOption,
              activeService === 'ride' && styles.serviceOptionActive
            ]}
            onPress={() => setActiveService('ride')}
          >
            <MaterialCommunityIcons 
              name="car" 
              size={24} 
              color={activeService === 'ride' ? '#4a89f3' : '#777'} 
            />
            <Text 
              style={[
                styles.serviceText,
                activeService === 'ride' && styles.serviceTextActive
              ]}
            >
              Ride
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.serviceOption,
              activeService === 'delivery' && styles.serviceOptionActive
            ]}
            onPress={() => setActiveService('delivery')}
          >
            <MaterialCommunityIcons 
              name="package-variant" 
              size={24} 
              color={activeService === 'delivery' ? '#4a89f3' : '#777'} 
            />
            <Text 
              style={[
                styles.serviceText,
                activeService === 'delivery' && styles.serviceTextActive
              ]}
            >
              Delivery
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Main Action Button */}
        <TouchableOpacity 
          style={styles.mainActionButton}
          onPress={activeService === 'ride' ? handleBookRide : handleSendPackage}
        >
          <LinearGradient
            colors={['#4a89f3', '#3367d6']}
            style={styles.mainActionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.mainActionText}>
              {activeService === 'ride' ? 'Book a Ride' : 'Send a Package'}
            </Text>
            <MaterialIcons name="arrow-forward-ios" size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Quick Locations */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.quickLocationsScroll}
          >
            <QuickLocationCard 
              icon="home" 
              title="Home" 
              address="123 Main St, Apartment 4B" 
            />
            <QuickLocationCard 
              icon="work" 
              title="Work" 
              address="456 Office Tower, Business District" 
            />
            <QuickLocationCard 
              icon="local-grocery-store" 
              title="Supermarket" 
              address="789 Market St, Downtown" 
            />
            <QuickLocationCard 
              icon="favorite" 
              title="Gym" 
              address="321 Fitness Ave, Health District" 
            />
          </ScrollView>
        </View>
        
        {/* Recent Activity */}
        <View style={[styles.sectionContainer, styles.recentActivityContainer]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RecentRides')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentActivityList}>
            <RecentActivityItem 
              type="ride" 
              location="Tech Park" 
              time="Yesterday, 9:30 AM" 
              price="$12.50" 
            />
            <RecentActivityItem 
              type="delivery" 
              location="Central Mall" 
              time="Mar 5, 3:15 PM" 
              price="$8.75" 
            />
            <RecentActivityItem 
              type="ride" 
              location="Green Valley Hospital" 
              time="Feb 28, 11:20 AM" 
              price="$15.30" 
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const QuickLocationCard = ({ icon, title, address }) => (
  <TouchableOpacity style={styles.quickLocationCard}>
    <View style={styles.quickLocationIcon}>
      <MaterialIcons name={icon} size={24} color="#4a89f3" />
    </View>
    <View style={styles.quickLocationInfo}>
      <Text style={styles.quickLocationTitle}>{title}</Text>
      <Text style={styles.quickLocationAddress} numberOfLines={1}>{address}</Text>
    </View>
  </TouchableOpacity>
);

const RecentActivityItem = ({ type, location, time, price }) => (
  <TouchableOpacity style={styles.recentActivityItem}>
    <View style={styles.activityIconContainer}>
      <MaterialIcons 
        name={type === 'ride' ? 'directions-car' : 'local-shipping'} 
        size={20} 
        color="#fff" 
      />
    </View>
    <View style={styles.activityInfo}>
      <Text style={styles.activityLocation}>{location}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
    <Text style={styles.activityPrice}>{price}</Text>
  </TouchableOpacity>
);

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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4a89f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 12,
    color: '#888',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    maxWidth: 150,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroGradient: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  serviceSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  serviceOptionActive: {
    backgroundColor: '#f0f7ff',
  },
  serviceText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#777',
  },
  serviceTextActive: {
    color: '#4a89f3',
  },
  mainActionButton: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mainActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  mainActionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#4a89f3',
    fontWeight: '500',
  },
  quickLocationsScroll: {
    flexDirection: 'row',
  },
  quickLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickLocationInfo: {
    flex: 1,
  },
  quickLocationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  quickLocationAddress: {
    fontSize: 13,
    color: '#777',
  },
  recentActivityContainer: {
    marginBottom: 24,
  },
  recentActivityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  recentActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4a89f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: '#888',
  },
  activityPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a89f3',
  }
});