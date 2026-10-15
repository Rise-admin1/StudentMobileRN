import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FONT } from '../../../../constants';
import { horizontalScale, moderateScale, verticalScale } from '../../../utils/metrics';
import { ipURL } from '../../../utils/utils';
import { axiosWithAuth } from '../../../utils/customAxios';

const StudentRatingPage = () => {
  const { studentUserId } = useLocalSearchParams();
  const profileId = Array.isArray(studentUserId) ? studentUserId[0] : studentUserId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRatings = useCallback(async () => {
    if (!profileId) return;
    try {
      const response = await axiosWithAuth.get(`${ipURL}/api/student-ratings/${profileId}`);
      setData(response.data);
      setRating(response.data?.myRating?.rating || 0);
      setDescription(response.data?.myRating?.description || '');
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load this student rating');
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!description.trim()) {
      Alert.alert('Add a description', 'Describe this student before saving the rating.');
      return;
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      Alert.alert('Choose a rating', 'Select 1 to 5 stars.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosWithAuth.post(`${ipURL}/api/student-ratings`, {
        studentUserId: profileId,
        description: description.trim(),
        rating,
      });
      setData(response.data);
      setRating(response.data?.myRating?.rating || rating);
      setDescription(response.data?.myRating?.description || description.trim());
      Alert.alert('Saved', 'The student rating is stored.');
    } catch (err) {
      Alert.alert('Could not save', err?.response?.data?.message || 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A2B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data?.studentName || 'Student'}</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1A4C6E" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summary}>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Ionicons
                  key={value}
                  name={value <= Math.round(data?.average || 0) ? 'star' : 'star-outline'}
                  size={18}
                  color={value <= Math.round(data?.average || 0) ? '#E6A817' : '#C5CDD6'}
                />
              ))}
            </View>
            <Text style={styles.summaryText}>
              {data?.count
                ? `${data.average} from ${data.count} ${data.count === 1 ? 'rating' : 'ratings'}`
                : 'No ratings yet'}
            </Text>
          </View>

          {data?.canRate && (
            <View style={styles.form}>
              <Text style={styles.sectionTitle}>{data?.myRating ? 'Update your rating' : 'Rate this student'}</Text>
              <View style={styles.starPicker}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => setRating(value)}
                    disabled={isSubmitting}
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  >
                    <Ionicons
                      name={value <= rating ? 'star' : 'star-outline'}
                      size={32}
                      color={value <= rating ? '#E6A817' : '#8A97A3'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Give a brief description of this student."
                placeholderTextColor="#8A97A3"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={191}
                editable={!isSubmitting}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                <Text style={styles.submitButtonText}>{isSubmitting ? 'Saving...' : 'Save rating'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {(data?.ratings || []).map((item) => (
            <View key={item.id} style={styles.ratingCard}>
              <Text style={styles.teacherName}>{item.teacher?.name || 'Tutor'}</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Ionicons
                    key={value}
                    name={value <= item.rating ? 'star' : 'star-outline'}
                    size={14}
                    color={value <= item.rating ? '#E6A817' : '#C5CDD6'}
                  />
                ))}
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: verticalScale(54),
    paddingHorizontal: horizontalScale(12),
    paddingBottom: verticalScale(12),
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: FONT.bold,
    fontSize: moderateScale(20),
    color: '#12263A',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#5C6B76',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(32),
  },
  summary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    padding: 16,
    marginBottom: verticalScale(16),
  },
  summaryText: {
    marginTop: 6,
    fontFamily: FONT.medium,
    fontSize: moderateScale(13),
    color: '#5C6B76',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    padding: 16,
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(16),
    color: '#12263A',
    marginBottom: 12,
  },
  starPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F4F6F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#12263A',
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#1A4C6E',
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: FONT.bold,
    fontSize: moderateScale(14),
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    padding: 16,
    marginBottom: verticalScale(12),
  },
  teacherName: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(14),
    color: '#12263A',
    marginBottom: 4,
  },
  description: {
    marginTop: 8,
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#5C6B76',
    lineHeight: 20,
  },
});

export default StudentRatingPage;
