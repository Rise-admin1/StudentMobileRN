import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ipURL } from '../../utils/utils';
import TeacherProfileView from '../../components/TeacherProfileView';

const GuestTutorProfile = () => {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await axios.get(`${ipURL}/api/auth/teacher/profile/${id}`);
        setUser(resp.data);
      } catch (error) {
        console.error('Error loading tutor profile:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6F8' }}>
      <Stack.Screen options={{
        headerShown: true,
        headerStyle: { backgroundColor: '#F4F6F8' },
        headerTintColor: '#12263A',
        headerTitle: "",
        headerShadowVisible: false,
        headerBackVisible: false,
        headerLeft: () => (
          <Ionicons name="chevron-back" size={24} color="#12263A" onPress={() => router.back()} style={{ marginLeft: 0 }} />
        ),
      }} />
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="#1A2B4B" />
        </View>
      ) : (
        <TeacherProfileView
          user={user}
          userDetails={{ isTeacher: true }}
          coursesInteractive
          onCoursePress={(item) => router.push(`/(authenticate)/course/${item.id}`)}
          roleLabel="Tutor"
          showTutorStats
        />
      )}
    </View>
  );
};

export default GuestTutorProfile;
