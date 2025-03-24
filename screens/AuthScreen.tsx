import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
// Assume firebase is properly configured in your app via firebase.ts
import { firebaseConfig, signInWithPhone } from '../services/firebaseAuth';

export default function AuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [code, setCode] = useState('');
  const recaptchaVerifier = React.useRef(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const sendVerification = async () => {
    try {
      Keyboard.dismiss();
      const verificationId = await signInWithPhone(phoneNumber, recaptchaVerifier.current);
      setVerificationId(verificationId);
      toast.success('OTP sent');
    } catch (error) {
      toast.error('Error sending OTP', { description: `${error.message}` });
    }
  };

  const confirmCode = async () => {
    setIsVerifying(true);
    try {
      // Confirm the code with Firebase
      // signInWithCredential would be used here
      toast.success('Authentication successful');
    } catch (error) {
      toast.error('Invalid authentication code');
    }
    setIsVerifying(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FirebaseRecaptchaVerifierModal 
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Sign In with Phone</Text>
        
        {!verificationId ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number (e.g., +1234567890)"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity style={styles.button} onPress={sendVerification}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
            <TouchableOpacity style={styles.button} onPress={confirmCode} disabled={isVerifying}>
              <Text style={styles.buttonText}>{isVerifying ? 'Verifying...' : 'Confirm OTP'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4a89f3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});