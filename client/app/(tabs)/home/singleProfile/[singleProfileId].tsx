import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useSegments } from "expo-router";
import axios from "axios";
import { FONT } from "../../../../constants";
import { ipURL } from "../../../utils/utils";
import { horizontalScale, moderateScale, verticalScale } from "../../../utils/metrics";
import TeacherProfileView from "../../../components/TeacherProfileView";

interface TeacherStats {
  hoursTaught?: number;
  studentCount?: number;
  classesHeld?: number;
  completionPercent?: number;
  courseCount?: number;
  reviewCount?: number;
  upcomingClasses?: number;
}

interface User {
  id?: string;
  email?: string;
  name?: string;
  profileImage?: string;
  userDescription?: string;
  userType?: string;
  subjects?: SubjectItem[];
  reccomendedSubjects?: string[];
  stats?: TeacherStats;
}

interface SubjectItem {
  id: string;
  subjectName: string;
  subjectDescription?: string;
  subjectImage?: string;
  subjectPrice?: number;
  subjectBoard?: string;
  subjectGrade?: number;
  subjectDuration?: number;
  subjectLanguage?: string;
  subjectTags?: string[];
}

interface UserDetails {
  isTeacher?: boolean;
  isAdmin?: boolean;
}

const SingleProfilePage = () => {
  const { singleProfileId } = useLocalSearchParams();
  const profileId = Array.isArray(singleProfileId) ? singleProfileId[0] : singleProfileId;
  const segments = useSegments() as string[];
  const stackTab = segments.includes('profile') ? 'profile' : 'home';

  const [user, setUser] = useState<User>({});
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) return;
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 0.9,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [loading, profileId, progress]);

  useEffect(() => {
    let cancelled = false;

    const getUser = async () => {
      if (!profileId) {
        setError("Teacher profile not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem("authToken");
        const apiUser = await axios.get(`${ipURL}/api/auth/teacher/profile/${profileId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (cancelled) return;
        const profile = apiUser.data || {};
        setUser(profile);
        setUserDetails({ isTeacher: profile.userType === "TEACHER" });
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading teacher profile:", err);
        setUser({});
        setUserDetails({});
        setError("Could not load this profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getUser();
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const handleItemPress = (itemId: { id: any }) => {
    router.push(`/(tabs)/${stackTab}/${itemId.id}`);
  };

  if (loading) {
    const barWidth = progress.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={styles.loadingWrap}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: barWidth }]} />
        </View>
        <Text style={styles.loadingText}>Loading profile</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <TeacherProfileView
      user={user}
      userDetails={userDetails}
      coursesInteractive
      onCoursePress={handleItemPress}
      showTutorStats={userDetails.isTeacher}
      roleLabel={userDetails.isTeacher ? "Tutor" : undefined}
    />
  );
};

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
    paddingHorizontal: horizontalScale(32),
  },
  track: {
    width: "100%",
    height: verticalScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: moderateScale(3),
    backgroundColor: "#1A4C6E",
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontFamily: FONT.medium,
    fontSize: moderateScale(15),
    color: "#1A4C6E",
  },
  errorText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(16),
    color: "#1A2B4B",
    textAlign: "center",
  },
});

export default SingleProfilePage;
