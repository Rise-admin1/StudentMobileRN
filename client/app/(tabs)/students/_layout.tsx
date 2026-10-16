import React from 'react';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const StudentsLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[studentId]"
        options={{
          headerShown: true,
          headerTitle: 'Student activity',
          headerLeft: () => (
            <Ionicons name="chevron-back" size={24} color="#12263A" onPress={() => router.back()} style={{ marginLeft: 0 }} />
          ),
        }}
      />
    </Stack>
  );
};

export default StudentsLayout;
