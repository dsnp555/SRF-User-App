import 'react-native-reanimated';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getCurrentUser } from './services/authService';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import HomeScreen from "./screens/HomeScreen";
import LocationPicker from "./screens/LocationPicker";
import RideSelection from "./screens/RideSelection";
import Confirmation from "./screens/Confirmation";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import DriverHomeScreen from "./screens/DriverHomeScreen";
import DriverTripDetail from "./screens/DriverTripDetail";
import DriverEarnings from "./screens/DriverEarnings";
import ProfileScreen from "./screens/ProfileScreen";
import RecentRidesScreen from "./screens/RecentRidesScreen";
import SupportScreen from "./screens/SupportScreen";

// Create Toast Context
export const ToastContext = createContext({
  showToast: (message, type) => {},
});

// Custom hook to use toast
export const useToast = () => useContext(ToastContext);

// Create custom toast implementation
const Toast = ({ message, type }) => {
  if (!message) return null;
  
  const backgroundColor = type === 'error' ? '#ff3b30' : type === 'success' ? '#34c759' : '#007aff';
  
  return (
    <View style={[styles.toast, { backgroundColor }]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// Rider Tab Navigator
function RiderTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4a89f3',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          
          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'RecentRides') {
            iconName = 'history';
          } else if (route.name === 'Support') {
            iconName = 'headset-mic';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          
          return <MaterialIcons name={iconName} size={focused ? 24 : 22} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="RecentRides" 
        component={RecentRidesScreen} 
        options={{ 
          title: 'Recent Rides',
          tabBarLabel: 'Rides',
        }}
      />
      <Tab.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{ 
          title: 'Support',
          tabBarLabel: 'Support',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

// Driver Tab Navigator
function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4a89f3',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          
          if (route.name === 'DriverHomeTab') {
            iconName = 'home';
          } else if (route.name === 'Earnings') {
            iconName = 'account-balance-wallet';
          } else if (route.name === 'DriverSupport') {
            iconName = 'headset-mic';
          } else if (route.name === 'DriverProfile') {
            iconName = 'person';
          }
          
          return <MaterialIcons name={iconName} size={focused ? 24 : 22} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="DriverHomeTab" 
        component={DriverHomeScreen} 
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={DriverEarnings} 
        options={{ 
          title: 'Earnings',
          tabBarLabel: 'Earnings',
        }}
      />
      <Tab.Screen 
        name="DriverSupport" 
        component={SupportScreen} 
        options={{ 
          title: 'Support',
          tabBarLabel: 'Support',
        }}
      />
      <Tab.Screen 
        name="DriverProfile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

function RiderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RiderTabs" component={RiderTabs} />
      <Stack.Screen name="LocationPicker" component={LocationPicker} />
      <Stack.Screen name="RideSelection" component={RideSelection} />
      <Stack.Screen name="Confirmation" component={Confirmation} />
    </Stack.Navigator>
  );
}

function DriverStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverTabs" component={DriverTabs} />
      <Stack.Screen name="DriverTripDetail" component={DriverTripDetail} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Create toast function for context
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3000);
  };

  // Check for user in local storage on app start
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Get current user from AsyncStorage
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setInitializing(false);
      }
    };
    
    checkAuthState();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    // Create a listener to update user state when it changes in other screens
    global.updateAuthState = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    
    return () => {
      // Cleanup
      global.updateAuthState = null;
    };
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a89f3" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={styles.container}>
          <NavigationContainer>
            {!user ? (
              <AuthStack />
            ) : user.userType === 'driver' ? (
              <DriverStack />
            ) : (
              <RiderStack />
            )}
          </NavigationContainer>
          <Toast message={toast.message} type={toast.type} />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  },
  toast: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  }
});
