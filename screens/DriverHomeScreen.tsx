import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions,
  Alert,
  Switch,
  StatusBar as RNStatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { logout, getCurrentUser } from '../services/authService';
import { useToast } from '../App';

const { width } = Dimensions.get('window');

export default function DriverHomeScreen() {
  const navigation = useNavigation();
  const { showToast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Driver',
    email: '',
    photoURL: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserData({
            name: user.name || 'Driver',
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

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await logout();
              if (global.updateAuthState) {
                global.updateAuthState();
              }
              showToast("You've been logged out", "success");
            } catch (error) {
              console.error('Logout failed', error);
              showToast("Logout failed", "error");
            }
          }
        }
      ]
    );
  };

  const toggleOnlineStatus = () => {
    if (!isOnline) {
      setIsOnline(true);
      showToast("You're now online. Ready to accept rides!", "success");
    } else {
      Alert.alert(
        "Go Offline",
        "Are you sure you want to go offline? You won't receive any ride requests.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Go Offline",
            onPress: () => {
              setIsOnline(false);
              showToast("You're now offline", "info");
            }
          }
        ]
      );
    }
  };

  const handleViewEarnings = () => {
    navigation.navigate('Earnings');
  };

  const handleViewTripDetails = () => {
    navigation.navigate('DriverTripDetail');
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

        <View style={styles.actionsSection}>
          <View style={styles.onlineStatusContainer}>
            <Text style={styles.onlineStatusText}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={toggleOnlineStatus}
              trackColor={{ false: '#767577', true: '#4a89f3' }}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Main Driver Hero */}
        <View style={styles.driverHero}>
          <LinearGradient
            colors={isOnline ? ['#34c759', '#2fb350'] : ['#4a89f3', '#3367d6']}
            style={styles.driverHeroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.driverHeroContent}>
              <Text style={styles.driverHeroTitle}>
                {isOnline ? 'You are online' : 'Driver Mode'}
              </Text>
              <Text style={styles.driverHeroSubtitle}>
                {isOnline 
                  ? 'You can now receive ride requests' 
                  : 'You are currently offline'}
              </Text>
              
              {!isOnline && (
                <TouchableOpacity 
                  style={styles.goOnlineButton}
                  onPress={toggleOnlineStatus}
                >
                  <Text style={styles.goOnlineButtonText}>Go Online</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </View>
        
        {/* Driver Stats */}
        <View style={styles.driverStatsSection}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.driverStats}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>$0.00</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0h 0m</Text>
              <Text style={styles.statLabel}>Online Time</Text>
            </View>
          </View>
        </View>

        {/* Driver Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.driverFeatures}>
            <TouchableOpacity 
              style={styles.driverFeatureButton}
              onPress={handleViewEarnings}
            >
              <View style={styles.driverFeatureIcon}>
                <FontAwesome5 name="money-bill-wave" size={20} color="#4a89f3" />
              </View>
              <Text style={styles.driverFeatureText}>Earnings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.driverFeatureButton}
              onPress={handleViewTripDetails}
            >
              <View style={styles.driverFeatureIcon}>
                <MaterialIcons name="history" size={24} color="#4a89f3" />
              </View>
              <Text style={styles.driverFeatureText}>Trip History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.driverFeatureButton}
              onPress={() => global.showToast("Coming soon!", "info")}
            >
              <View style={styles.driverFeatureIcon}>
                <MaterialIcons name="settings" size={24} color="#4a89f3" />
              </View>
              <Text style={styles.driverFeatureText}>Preferences</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Trips */}
        <View style={[styles.sectionContainer, styles.recentTripsContainer]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <TouchableOpacity onPress={handleViewTripDetails}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emptyTripsContainer}>
            <MaterialIcons name="directions-car" size={48} color="#ddd" />
            <Text style={styles.emptyTripsText}>No recent trips</Text>
            <Text style={styles.emptyTripsSubtext}>
              Your completed trips will appear here
            </Text>
          </View>
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
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  onlineStatusText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  driverHero: {
    margin: 16,
  },
  driverHeroGradient: {
    borderRadius: 16,
    padding: 20,
  },
  driverHeroContent: {
    alignItems: 'center',
  },
  driverHeroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  driverHeroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
    textAlign: 'center',
  },
  goOnlineButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  goOnlineButtonText: {
    color: '#4a89f3',
    fontWeight: '600',
    fontSize: 16,
  },
  sectionContainer: {
    marginTop: 16,
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
  driverStatsSection: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  driverStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    width: '31%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a89f3',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  driverFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  driverFeatureButton: {
    backgroundColor: '#fff',
    width: '31%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  driverFeatureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverFeatureText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  recentTripsContainer: {
    marginBottom: 24,
  },
  emptyTripsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyTripsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTripsSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  }
});