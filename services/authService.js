import AsyncStorage from '@react-native-async-storage/async-storage';

// Local storage keys
const USERS_STORAGE_KEY = '@cabigo_users';
const CURRENT_USER_KEY = '@cabigo_current_user';

// Get all registered users (or initialize empty array)
const getUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Save users to storage
const saveUsers = async (users) => {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

// Register a new user
export const registerWithEmail = async (email, password, userData) => {
  try {
    // Get existing users
    const users = await getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Generate a unique ID
    const userId = 'user_' + Date.now().toString();
    
    // Create new user object
    const newUser = {
      id: userId,
      email,
      password, // In a real app, you would hash this password
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save updated users
    await saveUsers(users);
    
    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = newUser;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login with email and password
export const loginWithEmail = async (email, password) => {
  try {
    // Get all users
    const users = await getUsers();
    
    // Find user with matching email
    const user = users.find(user => user.email === email);
    
    // Check if user exists and password matches
    if (!user) {
      throw new Error('No user found with this email');
    }
    
    if (user.password !== password) {
      throw new Error('Incorrect password');
    }
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    // Save current user to storage
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Logout
export const logout = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Get user data by ID
export const getUserData = async (userId) => {
  try {
    const users = await getUsers();
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user data error:', error);
    throw error;
  }
}; 