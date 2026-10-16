import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';

export default function CourseDeepLinkScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

  useEffect(() => {
    const openCourse = async () => {
      const id = Array.isArray(subjectId) ? subjectId[0] : subjectId;
      if (!id) {
        router.replace('/');
        return;
      }

      const token = await AsyncStorage.getItem('authToken');
      router.replace(token ? `/(tabs)/home/${id}` : `/(authenticate)/course/${id}`);
    };

    void openCourse();
  }, [subjectId]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F6F8' }}>
      <ActivityIndicator size="large" color="#1A4C6E" />
    </View>
  );
}
