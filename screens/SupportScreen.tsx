import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  StatusBar as RNStatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useToast } from '../App';

export default function SupportScreen() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('help'); // 'help' or 'contact'
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      setMessage('');
    } else {
      showToast('Please enter a message', 'error');
    }
  };

  // FAQ data
  const faqs = [
    {
      id: '1',
      question: 'How do I book a ride?',
      answer: 'To book a ride, go to the Home screen and tap "Book a Ride". Enter your pickup and drop-off locations, choose your ride type, and confirm your booking.'
    },
    {
      id: '2',
      question: 'How can I track my ride?',
      answer: 'Once your ride is confirmed, you can track your ride in real-time on the map screen. You\'ll see the estimated time of arrival and route on the map.'
    },
    {
      id: '3',
      question: 'How do I cancel a ride?',
      answer: 'To cancel a ride, go to your active ride, tap the "Cancel" button, and confirm your cancellation. Please note that cancellation fees may apply depending on when you cancel.'
    },
    {
      id: '4',
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards, mobile wallets, and cash payments in select locations. You can manage your payment methods in the Profile section.'
    },
    {
      id: '5',
      question: 'How do I share my ride status?',
      answer: 'During an active ride, you can tap the "Share trip status" button on the trip details screen. This will let you share your real-time location and ETA with friends or family.'
    },
    {
      id: '6',
      question: 'What if I forgot an item in the vehicle?',
      answer: 'If you left something in the vehicle, go to your ride history, select the ride, and tap "Report lost item". Our support team will assist you in recovering your lost item.'
    },
    {
      id: '7',
      question: 'How are ride fares calculated?',
      answer: 'Ride fares are calculated based on distance, time, current demand, and the type of ride you select. You\'ll always see the fare estimate before confirming your ride.'
    },
  ];

  const renderFAQItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.faqItem}>
      <View style={styles.faqQuestion}>
        <MaterialIcons name="help-outline" size={20} color="#4a89f3" style={styles.faqIcon} />
        <Text style={styles.questionText}>{item.question}</Text>
      </View>
      <Text style={styles.answerText}>{item.answer}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'help' && styles.activeTab
          ]}
          onPress={() => setActiveTab('help')}
        >
          <MaterialIcons 
            name="help-outline" 
            size={20} 
            color={activeTab === 'help' ? '#4a89f3' : '#666'} 
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'help' && styles.activeTabText
            ]}
          >
            Help Center
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'contact' && styles.activeTab
          ]}
          onPress={() => setActiveTab('contact')}
        >
          <MaterialIcons 
            name="chat-bubble-outline" 
            size={20} 
            color={activeTab === 'contact' ? '#4a89f3' : '#666'} 
          />
          <Text 
            style={[
              styles.tabText,
              activeTab === 'contact' && styles.activeTabText
            ]}
          >
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'help' ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.quickHelp}>
            <Text style={styles.sectionTitle}>How can we help you?</Text>
            
            <View style={styles.quickHelpGrid}>
              <TouchableOpacity style={styles.quickHelpItem}>
                <View style={styles.quickHelpIcon}>
                  <MaterialIcons name="receipt-long" size={24} color="#4a89f3" />
                </View>
                <Text style={styles.quickHelpText}>Trip Issues</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickHelpItem}>
                <View style={styles.quickHelpIcon}>
                  <MaterialIcons name="account-balance-wallet" size={24} color="#4a89f3" />
                </View>
                <Text style={styles.quickHelpText}>Payment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickHelpItem}>
                <View style={styles.quickHelpIcon}>
                  <MaterialIcons name="security" size={24} color="#4a89f3" />
                </View>
                <Text style={styles.quickHelpText}>Safety</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickHelpItem}>
                <View style={styles.quickHelpIcon}>
                  <MaterialIcons name="report-problem" size={24} color="#4a89f3" />
                </View>
                <Text style={styles.quickHelpText}>Report Issue</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.faqSection}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            {faqs.map(renderFAQItem)}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Support</Text>
            <Text style={styles.contactDescription}>
              Please describe your issue and our team will get back to you as soon as possible.
            </Text>
            
            <View style={styles.messageContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message here..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendButtonText}>Send Message</Text>
              <MaterialIcons name="send" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
            
            <View style={styles.directContactSection}>
              <Text style={styles.directContactTitle}>Direct Contact</Text>
              
              <TouchableOpacity style={styles.contactMethod}>
                <MaterialIcons name="phone" size={22} color="#4a89f3" style={styles.contactIcon} />
                <Text style={styles.contactText}>+1 (555) 123-4567</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactMethod}>
                <MaterialIcons name="email" size={22} color="#4a89f3" style={styles.contactIcon} />
                <Text style={styles.contactText}>support@cabigo.com</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactMethod}>
                <MaterialIcons name="forum" size={22} color="#4a89f3" style={styles.contactIcon} />
                <Text style={styles.contactText}>Live Chat (9AM - 9PM)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4a89f3',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#4a89f3',
  },
  scrollView: {
    flex: 1,
  },
  quickHelp: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickHelpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickHelpItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  quickHelpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickHelpText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  faqSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 24,
  },
  faqItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  faqIcon: {
    marginRight: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 28,
  },
  contactSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 24,
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  messageContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
  },
  messageInput: {
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
  },
  sendButton: {
    backgroundColor: '#4a89f3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  directContactSection: {
    marginTop: 8,
  },
  directContactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 16,
  },
  contactText: {
    fontSize: 15,
    color: '#333',
  },
}); 