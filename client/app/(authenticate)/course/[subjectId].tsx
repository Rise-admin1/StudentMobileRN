import {
  StyleSheet,
  View,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import SubjectPage from "../../components/SubjectPage";
import { Ionicons } from "@expo/vector-icons";

const GuestCourseDetail = () => {
  const { subjectId } = useLocalSearchParams();
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
      }}>
      </Stack.Screen>
      <SubjectPage subjectId={subjectId} guestPreview />
    </View>
  );
};

export default GuestCourseDetail;

const styles = StyleSheet.create({});
