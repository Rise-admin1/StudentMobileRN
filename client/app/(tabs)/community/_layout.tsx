import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const CommunityLayout = () => {
  return (
    <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="[communityId]" options={{ headerShown: true }} />
</Stack>
  )
}

export default CommunityLayout