import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FONT } from '../../../constants';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/metrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipURL } from '../../utils/utils';
import { axiosWithAuth } from '../../utils/customAxios';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const normalizeBio = (value?: string | null) => {
  if (!value || value === 'No description provided') return '';
  return value;
};

const roleLabel = (userType: string | null, isTeacher: boolean) => {
  if (userType === 'TEACHER' || isTeacher) return 'Tutor';
  if (userType === 'PARENT') return 'Parent';
  if (userType === 'ADMIN') return 'Admin';
  return 'Student';
};

const bioPlaceholder = (userType: string | null, isTeacher: boolean) => {
  if (userType === 'TEACHER' || isTeacher) return 'A short bio students will see on your profile';
  if (userType === 'PARENT') return 'A short note about you (optional)';
  return 'A short bio about you';
};

const EditProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    userDescription: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileImageVersion, setProfileImageVersion] = useState<string>('0');
  const [userType, setUserType] = useState<string | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [initialBio, setInitialBio] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const hasLoadedRef = useRef(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const bioOffsetY = useRef(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scrollBioIntoView = () => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(bioOffsetY.current - verticalScale(24), 0),
        animated: true,
      });
    });
  };

  const fetchUserData = async () => {
    const quiet = hasLoadedRef.current;
    if (!quiet) setIsFetching(true);

    try {
      const response = await axiosWithAuth.get(`${ipURL}/api/auth/metadata`);
      const bio = normalizeBio(response.data.userDescription);

      setUserData({
        name: response.data.name || '',
        email: response.data.email || '',
        userDescription: bio,
      });
      setProfileImage(response.data.profileImage || null);
      setUserType(response.data.userType || null);
      setIsTeacher(!!response.data.isTeacher || response.data.userType === 'TEACHER');
      setInitialBio(bio);
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      if (!quiet) setIsFetching(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      AsyncStorage.getItem('profileImageVersion').then((v) => {
        if (v != null) setProfileImageVersion(v);
      });
    }, [])
  );

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to update your profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.WEBP }
      );
      setSelectedImageUri(manipResult.uri);
    }
  };

  const uploadProfileImage = async () => {
    if (!selectedImageUri) {
      Alert.alert('No Image Selected', 'Please choose an image first.');
      return;
    }

    setIsUploadingImage(true);

    try {
      const uriParts = selectedImageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
      formData.append('uploadKey', 'userProfileImageId');
      formData.append('awsId', '');

      const response = await axiosWithAuth.post(
        `${ipURL}/api/s3/upload-to-aws`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const imageLocation = response.data?.data?.Location;
      if (!imageLocation) {
        throw new Error('Image location not returned from server');
      }

      await axiosWithAuth.put(`${ipURL}/api/auth/update-profile`, {
        profileImage: imageLocation,
      });

      setProfileImage(imageLocation);
      setSelectedImageUri(null);
      setProfileImageVersion(String(Date.now()));

      const stored = await AsyncStorage.getItem('userDetails');
      if (stored) {
        const parsed = JSON.parse(stored);
        await AsyncStorage.setItem('userDetails', JSON.stringify({
          ...parsed,
          userProfileImage: imageLocation,
        }));
      }

      await AsyncStorage.setItem('profileImageVersion', String(Date.now()));

      Alert.alert('Success', 'Your profile picture has been updated.');
    } catch (error: any) {
      console.error('Image upload failed', error);
      Alert.alert(
        'Upload Failed',
        error?.message || 'Please try again or contact support if the problem persists.'
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const isDirty = userData.userDescription.trim() !== initialBio.trim();
  const saveDisabled = isLoading || !isDirty || isFetching;

  const handleSave = async () => {
    if (!isDirty) return;

    setIsLoading(true);
    try {
      const trimmedBio = userData.userDescription.trim();
      const response = await axiosWithAuth.put(`${ipURL}/api/auth/update-metadata`, {
        body: { userDescription: trimmedBio },
      });

      if (response.data?.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
      }

      setInitialBio(trimmedBio);
      setUserData((prev) => ({ ...prev, userDescription: trimmedBio }));
      Alert.alert('Success', 'Profile updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const displayImageUri =
    selectedImageUri ||
    (profileImage
      ? `${profileImage}${profileImage.includes('?') ? '&' : '?'}v=${profileImageVersion}`
      : null);

  const chipLabel = roleLabel(userType, isTeacher);
  const showLoading = isFetching && !userData.name;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back to profile"
        >
          <Ionicons name="chevron-back" size={24} color="#12263A" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>Photo, bio, and account details</Text>
        </View>
      </View>

      {showLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A4C6E" />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 20}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: verticalScale(48) + keyboardHeight },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <View style={styles.photoSection}>
              <TouchableOpacity
                style={styles.avatarWrapper}
                onPress={pickImage}
                activeOpacity={0.9}
                disabled={isUploadingImage}
                accessibilityRole="button"
                accessibilityLabel="Change profile photo"
              >
                {displayImageUri ? (
                  <Image source={{ uri: displayImageUri }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={moderateScale(48)} color="#94A3B8" />
                  </View>
                )}
                <View style={styles.avatarBadge}>
                  <Ionicons name="camera" size={moderateScale(16)} color="#FFFFFF" />
                </View>
              </TouchableOpacity>

              <View style={styles.roleChip}>
                <Text style={styles.roleChipText}>{chipLabel}</Text>
              </View>

              {selectedImageUri ? (
                <View style={styles.photoActions}>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={uploadProfileImage}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.uploadButtonText}>Upload photo</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelPhotoButton}
                    onPress={() => setSelectedImageUri(null)}
                  >
                    <Text style={styles.cancelPhotoText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={pickImage} style={styles.changePhotoLink}>
                  <Text style={styles.changePhotoText}>Change photo</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.formCard}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Name</Text>
                <Text style={styles.fieldValue}>{userData.name || '—'}</Text>
                <Text style={styles.fieldHint}>Contact support to change your name.</Text>
              </View>
              <View style={styles.fieldDivider} />
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Email</Text>
                <Text style={styles.fieldValue}>{userData.email || '—'}</Text>
                <Text style={styles.fieldHint}>Contact support to change your email.</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>About</Text>
            <View
              style={styles.formCard}
              onLayout={(e) => {
                bioOffsetY.current = e.nativeEvent.layout.y;
              }}
            >
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Bio</Text>
                <TextInput
                  style={styles.bioInput}
                  value={userData.userDescription}
                  onChangeText={(text) =>
                    setUserData((prev) => ({ ...prev, userDescription: text }))
                  }
                  placeholder={bioPlaceholder(userType, isTeacher)}
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  maxLength={500}
                  onFocus={() => {
                    setTimeout(scrollBioIntoView, Platform.OS === 'ios' ? 50 : 150);
                  }}
                />
                <Text style={styles.charCount}>
                  {userData.userDescription.length}/500
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saveDisabled && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saveDisabled}
              accessibilityRole="button"
              accessibilityLabel="Save changes"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save changes</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: verticalScale(4),
    paddingBottom: verticalScale(12),
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 4,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(24),
    color: '#12263A',
  },
  headerSubtitle: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#5C6B76',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(48),
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: verticalScale(12),
  },
  avatar: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: '#1A4C6E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F4F6F8',
  },
  roleChip: {
    backgroundColor: '#E4EEF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: verticalScale(8),
  },
  roleChipText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(11),
    color: '#1A4C6E',
  },
  changePhotoLink: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: horizontalScale(8),
  },
  changePhotoText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#1A4C6E',
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12),
  },
  uploadButton: {
    backgroundColor: '#1A4C6E',
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 12,
    minHeight: 44,
    minWidth: horizontalScale(120),
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#FFFFFF',
  },
  cancelPhotoButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
  },
  cancelPhotoText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#5C6B76',
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(13),
    color: '#5C6B76',
    marginBottom: verticalScale(8),
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(18),
  },
  field: {
    paddingVertical: verticalScale(16),
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  fieldLabel: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(13),
    color: '#5C6B76',
    marginBottom: verticalScale(6),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(16),
    color: '#12263A',
  },
  bioInput: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(16),
    color: '#12263A',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    minHeight: verticalScale(72),
    textAlignVertical: 'top',
  },
  fieldHint: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(12),
    color: '#94A3B8',
    marginTop: verticalScale(4),
  },
  charCount: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(12),
    color: '#94A3B8',
    marginTop: verticalScale(6),
    textAlign: 'right',
  },
  saveButton: {
    backgroundColor: '#1A4C6E',
    paddingVertical: verticalScale(16),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(16),
    color: '#FFFFFF',
  },
});

export default EditProfilePage;
