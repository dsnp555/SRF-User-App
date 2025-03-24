import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StatusBar as RNStatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DriverEarnings() {
  const navigation = useNavigation();
  const [timeFrame, setTimeFrame] = useState('week'); // 'day', 'week', 'month'

  // Mock data
  const earningsData = {
    day: {
      total: 0,
      trips: 0,
      hours: 0,
      breakdown: []
    },
    week: {
      total: 135.75,
      trips: 12,
      hours: 8.5,
      breakdown: [
        { day: 'Monday', amount: 35.50, trips: 3 },
        { day: 'Wednesday', amount: 42.25, trips: 4 },
        { day: 'Friday', amount: 28.00, trips: 2 },
        { day: 'Saturday', amount: 30.00, trips: 3 }
      ]
    },
    month: {
      total: 755.25,
      trips: 65,
      hours: 48.5,
      breakdown: [
        { week: 'Week 1', amount: 185.50, trips: 18 },
        { week: 'Week 2', amount: 210.75, trips: 19 },
        { week: 'Week 3', amount: 135.75, trips: 12 },
        { week: 'Week 4', amount: 223.25, trips: 16 }
      ]
    }
  };

  const currentEarnings = earningsData[timeFrame];

  const renderBreakdown = () => {
    if (currentEarnings.breakdown.length === 0) {
      return (
        <View style={styles.emptyBreakdown}>
          <MaterialIcons name="account-balance-wallet" size={48} color="#ddd" />
          <Text style={styles.emptyText}>No earnings data</Text>
        </View>
      );
    }

    return currentEarnings.breakdown.map((item, index) => (
      <View key={index} style={styles.breakdownItem}>
        <Text style={styles.breakdownLabel}>
          {item.day || item.week}
        </Text>
        <View style={styles.breakdownDetails}>
          <Text style={styles.breakdownAmount}>${item.amount.toFixed(2)}</Text>
          <Text style={styles.breakdownTrips}>{item.trips} trips</Text>
        </View>
      </View>
    ));
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
        <Text style={styles.headerTitle}>Earnings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Earnings Summary */}
      <View style={styles.summaryContainer}>
        <LinearGradient
          colors={['#4a89f3', '#3367d6']}
          style={styles.summaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.totalLabel}>Total Earnings</Text>
          <Text style={styles.totalAmount}>${currentEarnings.total.toFixed(2)}</Text>
          <View style={styles.summaryDetails}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{currentEarnings.trips}</Text>
              <Text style={styles.summaryLabel}>Trips</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{currentEarnings.hours.toFixed(1)}</Text>
              <Text style={styles.summaryLabel}>Hours</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {currentEarnings.hours > 0 
                  ? '$' + (currentEarnings.total / currentEarnings.hours).toFixed(2) 
                  : '$0.00'}
              </Text>
              <Text style={styles.summaryLabel}>Per Hour</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Time Frame Selector */}
      <View style={styles.timeFrameSelector}>
        <TouchableOpacity 
          style={[
            styles.timeFrameOption,
            timeFrame === 'day' && styles.timeFrameActive
          ]}
          onPress={() => setTimeFrame('day')}
        >
          <Text 
            style={[
              styles.timeFrameText,
              timeFrame === 'day' && styles.timeFrameTextActive
            ]}
          >
            Day
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.timeFrameOption,
            timeFrame === 'week' && styles.timeFrameActive
          ]}
          onPress={() => setTimeFrame('week')}
        >
          <Text 
            style={[
              styles.timeFrameText,
              timeFrame === 'week' && styles.timeFrameTextActive
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.timeFrameOption,
            timeFrame === 'month' && styles.timeFrameActive
          ]}
          onPress={() => setTimeFrame('month')}
        >
          <Text 
            style={[
              styles.timeFrameText,
              timeFrame === 'month' && styles.timeFrameTextActive
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
      </View>

      {/* Earnings Breakdown */}
      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>
          Earnings Breakdown ({timeFrame === 'day' ? 'Today' : timeFrame === 'week' ? 'This Week' : 'This Month'})
        </Text>
        <ScrollView style={styles.breakdownList}>
          {renderBreakdown()}
        </ScrollView>
      </View>

      {/* Cash Out Button */}
      <View style={styles.cashOutContainer}>
        <TouchableOpacity 
          style={styles.cashOutButton}
          onPress={() => global.showToast('Cash out feature coming soon!', 'info')}
        >
          <LinearGradient
            colors={['#4a89f3', '#3367d6']}
            style={styles.cashOutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialIcons name="account-balance-wallet" size={20} color="#fff" />
            <Text style={styles.cashOutText}>Cash Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  summaryContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: 20,
  },
  totalLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeFrameSelector: {
    flexDirection: 'row',
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
  timeFrameOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeFrameActive: {
    backgroundColor: '#f0f7ff',
  },
  timeFrameText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#777',
  },
  timeFrameTextActive: {
    color: '#4a89f3',
  },
  breakdownContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 20,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  breakdownList: {
    flex: 1,
  },
  breakdownItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  breakdownLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  breakdownDetails: {
    alignItems: 'flex-end',
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a89f3',
    marginBottom: 4,
  },
  breakdownTrips: {
    fontSize: 12,
    color: '#888',
  },
  emptyBreakdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },
  cashOutContainer: {
    padding: 16,
  },
  cashOutButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cashOutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  cashOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});