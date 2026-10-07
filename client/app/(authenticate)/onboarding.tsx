import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONT, SIZES } from '../../constants';
import { horizontalScale, verticalScale, moderateScale } from '../utils/metrics';
import { getPostAuthHref } from '../utils/teacherProfileLink';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const getSlides = (userType) => {
  if (userType === 'parent') {
    return [
      {
        id: '1',
        title: 'Welcome to Coach Academ',
        description: 'Follow your child’s tutoring from one parent account.',
        image: require('../../assets/images/onboard-parent-1.png'),
      },
      {
        id: '2',
        title: 'Link your student',
        description: 'Invite a student by email. They must accept before you can see their activity.',
        image: require('../../assets/images/onboard-parent-2.png'),
      },
      {
        id: '3',
        title: 'See their progress',
        description: 'View courses, class history, hours, and upcoming sessions for linked students.',
        image: require('../../assets/images/onboard-parent-3.png'),
      },
      {
        id: '4',
        title: 'Message their tutors',
        description: 'Chat with tutors after a linked student has purchased a course. Ready to start?',
        image: require('../../assets/images/onboard-parent-4.png'),
      },
    ];
  }

  if (userType === 'teacher') {
    return [
      {
        id: '1',
        title: 'Welcome to Coach Academ',
        description: 'Create your tutor profile and start teaching on Coach Academ.',
        image: require('../../assets/images/onboard-teacher-1.png'),
      },
      {
        id: '2',
        title: 'Create and publish courses',
        description: 'Offer 1-on-1, group, or package courses students can discover and enroll in.',
        image: require('../../assets/images/onboard-teacher-2.png'),
      },
      {
        id: '3',
        title: 'Manage your schedule',
        description: 'View upcoming classes and track teaching hours and student progress.',
        image: require('../../assets/images/onboard-teacher-3.png'),
      },
      {
        id: '4',
        title: 'Connect with students',
        description: 'Chat with enrolled students and share updates in Community. Ready to teach?',
        image: require('../../assets/images/onboard-teacher-4.png'),
      },
    ];
  }

  return [
    {
      id: '1',
      title: 'Welcome to Coach Academ',
      description: 'Browse tutors and courses to find the right fit for your goals.',
      image: require('../../assets/images/onboard-student-1.png'),
    },
    {
      id: '2',
      title: 'Enroll and book classes',
      description: 'Purchase a course and book sessions that match your schedule.',
      image: require('../../assets/images/onboard-student-2.png'),
    },
    {
      id: '3',
      title: 'Track your progress',
      description: 'See upcoming classes, completed sessions, and hours learned.',
      image: require('../../assets/images/onboard-student-3.png'),
    },
    {
      id: '4',
      title: 'Chat with your tutors',
      description: 'Message tutors after you enroll. Ready to start learning?',
      image: require('../../assets/images/onboard-student-4.png'),
    },
  ];
};

const OnboardingScreen = () => {
  const params = useLocalSearchParams();
  const userType = params.userType as string;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  // Verify userType on component mount
  useEffect(() => {
    if (!userType || (userType !== 'teacher' && userType !== 'student' && userType !== 'parent')) {
      Alert.alert(
        'Error',
        'Invalid user type. Please login again.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(authenticate)/login'),
          },
        ]
      );
    }
  }, [userType]);

  const slides = getSlides(userType);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      await AsyncStorage.setItem('userType', userType); // Store userType for future use
      router.replace(await getPostAuthHref());
    }
  };

  const Slide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [6, 20, 6],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
              ]}
              key={index.toString()}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <FlatList
        data={slides}
        renderItem={({ item }) => <Slide item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      <View style={styles.footer}>
        <Pagination />
        <TouchableOpacity 
          style={[styles.button, currentIndex === slides.length - 1 && styles.buttonLast]} 
          onPress={scrollTo}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Continue"}
          </Text>
          <Ionicons 
            name={currentIndex === slides.length - 1 ? "checkmark" : "arrow-forward"} 
            size={20} 
            color="#FFFFFF" 
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(40),
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
    marginTop: verticalScale(20),
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(26),
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: verticalScale(16),
  },
  description: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(16),
    color: '#666666',
    textAlign: 'center',
    lineHeight: moderateScale(24),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: verticalScale(40),
    paddingHorizontal: horizontalScale(24),
  },
  paginationContainer: {
    flexDirection: 'row',
    height: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonLast: {
    backgroundColor: '#2DCB63',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: FONT.medium,
    fontSize: moderateScale(16),
  },
  buttonIcon: {
    marginLeft: horizontalScale(8),
  },
});

export default OnboardingScreen;
