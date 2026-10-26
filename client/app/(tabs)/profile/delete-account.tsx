import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FONT } from '../../../constants';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/metrics';
import { ipURL } from '../../utils/utils';
import { axiosWithAuth } from '../../utils/customAxios';

const DeleteAccountPage = () => {
  const [password, setPassword] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    Alert.alert(
      'Request Account Deletion',
      'This submits a request to our team for review. You will contacted with further details regarding the deletion of your account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit Request',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await axiosWithAuth.delete(`${ipURL}/api/auth/delete-account`, {
                data: { password },
              });

              if (response.status === 200) {
                setPassword('');
                Alert.alert(
                  'Request submitted',
                  response.data?.message ||
                    'Your deletion request has been submitted. Our team will review it.'
                );
              }
            } catch (error) {
              console.error('Error requesting account deletion:', error);
              Alert.alert('Error', error.response?.data?.message || 'Failed to submit deletion request');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A2B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Account Deletion</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: verticalScale(40) }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={40} color="#DC2626" />
            <Text style={styles.warningTitle}>Warning</Text>
            <Text style={styles.warningText}>
              Submitting this request asks our support team to delete your account after review. Once approved, this permanently removes:
            </Text>
            <View style={styles.warningList}>
              <Text style={styles.warningItem}>• Your profile information</Text>
              <Text style={styles.warningItem}>• Your subjects and courses</Text>
              <Text style={styles.warningItem}>• Your reviews and ratings</Text>
              <Text style={styles.warningItem}>• Your booking history</Text>
              <Text style={styles.warningItem}>• All other associated data</Text>
            </View>
            <Text style={styles.warningText}>
              Your account is not deleted instantly. You will receive an email confirming we received your request.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Enter your password to confirm</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!isPasswordShown}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setIsPasswordShown(!isPasswordShown)}
                >
                  <Ionicons 
                    name={isPasswordShown ? "eye-off" : "eye"} 
                    size={24} 
                    color="#64748B" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
              disabled={isLoading}
            >
              <Text style={styles.deleteButtonText}>
                {isLoading ? 'Submitting Request...' : 'Request Account Deletion'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(16),
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    marginRight: horizontalScale(15),
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(20),
    color: '#1A2B4B',
    flexShrink: 1,
  },
  scrollView: {
    flex: 1,
  },
  warningContainer: {
    backgroundColor: '#FEE2E2',
    margin: horizontalScale(20),
    padding: moderateScale(20),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  warningTitle: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(20),
    color: '#DC2626',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  warningText: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(16),
    color: '#1A2B4B',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  warningList: {
    width: '100%',
    marginVertical: verticalScale(10),
  },
  warningItem: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(16),
    color: '#1A2B4B',
    marginBottom: verticalScale(5),
  },
  form: {
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(20),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(16),
    color: '#1A2B4B',
    marginBottom: verticalScale(8),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(15),
  },
  input: {
    flex: 1,
    padding: moderateScale(15),
    fontFamily: FONT.regular,
    fontSize: moderateScale(16),
    color: '#1A2B4B',
  },
  eyeIcon: {
    padding: moderateScale(10),
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    padding: moderateScale(15),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(40),
  },
  deleteButtonText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(16),
    color: '#FFFFFF',
  },
});

export default DeleteAccountPage;
