/* Firebase configuration and authentication helper functions */
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // ... add other Firebase config values here
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const signInWithPhone = async (phoneNumber, recaptchaVerifier) => {
  const phoneProvider = new firebase.auth.PhoneAuthProvider();
  const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);
  return verificationId;
};