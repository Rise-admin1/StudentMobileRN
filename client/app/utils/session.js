import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { disconnectSocket } from './socket';

let loginInProgress = false;

export function beginLogin() {
  loginInProgress = true;
}

export function finishLogin() {
  loginInProgress = false;
}

export async function endLocalSession() {
  if (loginInProgress) return;
  disconnectSocket();
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('userDetails');
  await AsyncStorage.removeItem('isTeacher');
  router.replace('/(authenticate)/login');
}
