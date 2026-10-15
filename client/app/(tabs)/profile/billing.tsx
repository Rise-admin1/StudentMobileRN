import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Linking,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONT } from '../../../constants';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/metrics';
import { axiosWithAuth } from '../../utils/customAxios';
import { ipURL } from '../../utils/utils';

type Purchase = {
  id: string;
  subjectName: string;
  purchaseAmount: number;
  purchaseCurrency: string;
  purchaseDate: string;
  purchaseReceiptUrl: string | null;
  paymentStatus?: string | null;
  purchaseStatus?: string | null;
  refundEligible?: boolean;
  refundRequestStatus?: string | null;
  refundReason?: string | null;
};

type StudentGroup = {
  studentProfileId: string;
  studentName: string;
  purchases: Purchase[];
};

type BillingResponse =
  | { role: 'STUDENT'; purchases: Purchase[] }
  | { role: 'PARENT'; students: StudentGroup[] };

const formatAmount = (amount: number, currency: string) => {
  const value = (amount || 0) / 100;
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${(currency || 'AED').toUpperCase()} ${formatted}`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const openReceipt = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Invoice', 'This invoice link cannot be opened on this device.');
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    console.error('Error opening invoice:', error);
    Alert.alert('Invoice', 'Could not open this invoice.');
  }
};

const statusLabel = (purchase: Purchase) => {
  if (purchase.paymentStatus === 'REFUNDED' || purchase.purchaseStatus === 'CANCELLED') {
    return 'Refunded';
  }
  if (purchase.refundRequestStatus === 'PENDING') {
    return 'Refund pending';
  }
  if (purchase.refundRequestStatus === 'DECLINED') {
    return 'Refund declined';
  }
  if (purchase.refundRequestStatus === 'ACCEPTED') {
    return 'Refunded';
  }
  return 'Paid';
};

const PurchaseCard = ({
  purchase,
  canRequestRefund,
  onRequestRefund,
}: {
  purchase: Purchase;
  canRequestRefund: boolean;
  onRequestRefund?: (purchase: Purchase) => void;
}) => (
  <View style={styles.card}>
    <Text style={styles.courseName}>{purchase.subjectName}</Text>
    <Text style={styles.amount}>{formatAmount(purchase.purchaseAmount, purchase.purchaseCurrency)}</Text>
    <Text style={styles.date}>{formatDate(purchase.purchaseDate)}</Text>
    <Text style={styles.status}>{statusLabel(purchase)}</Text>
    {purchase.refundRequestStatus === 'PENDING' && purchase.refundReason ? (
      <Text style={styles.reasonPreview}>Reason: {purchase.refundReason}</Text>
    ) : null}
    <View style={styles.actionsRow}>
      {purchase.purchaseReceiptUrl ? (
        <TouchableOpacity
          style={styles.invoiceButton}
          onPress={() => openReceipt(purchase.purchaseReceiptUrl as string)}
          accessibilityRole="button"
          accessibilityLabel={`Open invoice for ${purchase.subjectName}`}
        >
          <Ionicons name="document-text-outline" size={16} color="#1A4C6E" />
          <Text style={styles.invoiceText}>Invoice</Text>
        </TouchableOpacity>
      ) : null}
      {canRequestRefund && purchase.refundEligible ? (
        <TouchableOpacity
          style={styles.refundButton}
          onPress={() => onRequestRefund?.(purchase)}
          accessibilityRole="button"
          accessibilityLabel={`Request refund for ${purchase.subjectName}`}
        >
          <Ionicons name="return-down-back-outline" size={16} color="#FFFFFF" />
          <Text style={styles.refundText}>Request refund</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
);

const BillingPage = () => {
  const [billing, setBilling] = useState<BillingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBilling = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      const response = await axiosWithAuth.get(`${ipURL}/api/billing`);
      setBilling(response.data);
    } catch (err) {
      console.error('Error fetching billing:', err);
      setError('Failed to load billing. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBilling(false);
  }, [fetchBilling]);

  const closeModal = () => {
    if (submitting) return;
    setSelectedPurchase(null);
    setReason('');
  };

  const submitRefundRequest = async () => {
    if (!selectedPurchase) return;
    const trimmed = reason.trim();
    if (!trimmed) {
      Alert.alert('Refund reason', 'Please enter a reason for the refund.');
      return;
    }

    try {
      setSubmitting(true);
      await axiosWithAuth.post(
        `${ipURL}/api/billing/purchases/${selectedPurchase.id}/refund-request`,
        { reason: trimmed }
      );
      Alert.alert('Refund requested', 'Your refund request was sent for admin review.');
      setSelectedPurchase(null);
      setReason('');
      await fetchBilling(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Could not submit the refund request.';
      Alert.alert('Refund request', message);
    } finally {
      setSubmitting(false);
    }
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back to settings"
      >
        <Ionicons name="chevron-back" size={24} color="#12263A" />
      </TouchableOpacity>
      <View style={styles.headerText}>
        <Text style={styles.title}>Billing</Text>
        <Text style={styles.subtitle}>Confirmed purchases and invoices</Text>
      </View>
    </View>
  );

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={() => fetchBilling(true)}
      colors={['#1A4C6E']}
      tintColor="#1A4C6E"
    />
  );

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A4C6E" />
        </View>
      );
    }

    let content: React.ReactNode;
    let isEmpty = false;
    const canRequestRefund = billing?.role === 'STUDENT';

    if (error) {
      isEmpty = true;
      content = <Text style={styles.emptyText}>{error}</Text>;
    } else if (!billing) {
      isEmpty = true;
      content = <Text style={styles.emptyText}>No billing details found</Text>;
    } else if (billing.role === 'STUDENT') {
      if (billing.purchases.length === 0) {
        isEmpty = true;
        content = (
          <>
            <Ionicons name="receipt-outline" size={40} color="#5C6B76" />
            <Text style={styles.emptyText}>No confirmed purchases</Text>
          </>
        );
      } else {
        content = billing.purchases.map((purchase) => (
          <PurchaseCard
            key={purchase.id}
            purchase={purchase}
            canRequestRefund={canRequestRefund}
            onRequestRefund={setSelectedPurchase}
          />
        ));
      }
    } else if (billing.students.length === 0) {
      isEmpty = true;
      content = (
        <>
          <Ionicons name="people-outline" size={40} color="#5C6B76" />
          <Text style={styles.emptyText}>No linked students</Text>
        </>
      );
    } else {
      content = billing.students.map((student) => (
        <View key={student.studentProfileId} style={styles.studentGroup}>
          <Text style={styles.studentName}>{student.studentName}</Text>
          {student.purchases.length === 0 ? (
            <Text style={styles.groupEmpty}>No confirmed purchases</Text>
          ) : (
            student.purchases.map((purchase) => (
              <PurchaseCard
                key={purchase.id}
                purchase={purchase}
                canRequestRefund={false}
              />
            ))
          )}
        </View>
      ));
    }

    return (
      <ScrollView
        contentContainerStyle={[styles.scrollContent, isEmpty && styles.scrollContentEmpty]}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {content}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      {header}
      {renderBody()}
      <Modal visible={!!selectedPurchase} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Request refund</Text>
            <Text style={styles.modalSubtitle}>
              {selectedPurchase?.subjectName || 'Course'} ·{' '}
              {selectedPurchase
                ? formatAmount(selectedPurchase.purchaseAmount, selectedPurchase.purchaseCurrency)
                : ''}
            </Text>
            <Text style={styles.modalHint}>Tell us why you want a refund. Admins will review this.</Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Refund reason"
              placeholderTextColor="#94A3B8"
              value={reason}
              onChangeText={setReason}
              multiline
              textAlignVertical="top"
              editable={!submitting}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal} disabled={submitting}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={submitRefundRequest}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
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
  title: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(24),
    color: '#12263A',
  },
  subtitle: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#5C6B76',
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(32),
  },
  scrollContentEmpty: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentGroup: {
    marginTop: verticalScale(8),
  },
  studentName: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(13),
    color: '#5C6B76',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: verticalScale(10),
  },
  courseName: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(16),
    color: '#12263A',
  },
  amount: {
    marginTop: 6,
    fontFamily: FONT.bold,
    fontSize: moderateScale(15),
    color: '#12263A',
  },
  date: {
    marginTop: 4,
    fontFamily: FONT.regular,
    fontSize: moderateScale(13),
    color: '#5C6B76',
  },
  status: {
    marginTop: 8,
    fontFamily: FONT.medium,
    fontSize: moderateScale(13),
    color: '#1A4C6E',
  },
  reasonPreview: {
    marginTop: 4,
    fontFamily: FONT.regular,
    fontSize: moderateScale(12),
    color: '#5C6B76',
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  invoiceButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#E8EEF3',
  },
  invoiceText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#1A4C6E',
  },
  refundButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#1A4C6E',
  },
  refundText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#FFFFFF',
  },
  groupEmpty: {
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#5C6B76',
    marginBottom: verticalScale(8),
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(24),
    gap: 10,
  },
  emptyText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(15),
    color: '#5C6B76',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 38, 58, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },
  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: moderateScale(18),
    color: '#12263A',
  },
  modalSubtitle: {
    marginTop: 6,
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#1A4C6E',
  },
  modalHint: {
    marginTop: 10,
    fontFamily: FONT.regular,
    fontSize: moderateScale(13),
    color: '#5C6B76',
  },
  reasonInput: {
    marginTop: 12,
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#E6EBF0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONT.regular,
    fontSize: moderateScale(14),
    color: '#12263A',
    backgroundColor: '#F8FAFC',
  },
  modalActions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EEF3',
  },
  cancelText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#1A4C6E',
  },
  submitButton: {
    minHeight: 40,
    minWidth: 96,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A4C6E',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontFamily: FONT.medium,
    fontSize: moderateScale(14),
    color: '#FFFFFF',
  },
});

export default BillingPage;
