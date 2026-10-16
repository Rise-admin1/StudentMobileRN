import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ipURL } from './utils';
import { endLocalSession } from './session';

export const BaseUrl = () =>
  Platform.OS === 'android' ? 'http://10.0.2.2:8081' : 'http://localhost:8081';

const SOCKET_URL = ipURL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export async function connectSocket() {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) {
    return;
  }

  const previousToken = socket.auth?.token;
  socket.auth = { token };

  if (socket.connected && previousToken === token) {
    return;
  }

  if (socket.connected) {
    socket.disconnect();
  }

  await new Promise((resolve) => {
    const onConnect = () => {
      cleanup();
      resolve(void 0);
    };
    const onError = (error) => {
      cleanup();
      if (error?.message === 'Session ended') {
        endLocalSession();
      }
      resolve(void 0);
    };
    const cleanup = () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
    };

    socket.once('connect', onConnect);
    socket.once('connect_error', onError);
    socket.connect();
  });
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

socket.on('session-ended', () => {
  endLocalSession();
});

const socketUrl = {};

export default socketUrl;
