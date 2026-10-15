import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { axiosWithAuth } from '../../utils/customAxios';
import { ipURL } from '../../utils/utils';
import { COLORS } from '../../../constants';

type RefundRequestRow = {
  id: string;
  status: string;
  reason: string;
  classStartsAtLabel: string;
  createdAt: string;
  studentName: string | null;
  studentEmail: string | null;
  subjectName: string | null;
  courseType: string | null;
  purchaseAmountLabel: string;
};

const RefundsScreen = () => {
  const [items, setItems] = useState<RefundRequestRow[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchItems = useCallback(async (search: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: '1',
        pageSize: '50',
        status: 'PENDING',
      });
      if (search.trim()) {
        params.set('q', search.trim());
      }
      const response = await axiosWithAuth.get(`${ipURL}/api/admin/refund-requests?${params.toString()}`);
      setItems(response.data?.refundRequests || []);
      setTotal(response.data?.total || 0);
    } catch {
      setError('Failed to load refund requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const handle = setTimeout(() => {
        fetchItems(query);
      }, 300);
      return () => clearTimeout(handle);
    }, [fetchItems, query])
  );

  const decide = (item: RefundRequestRow, action: 'accept' | 'decline') => {
    const title = action === 'accept' ? 'Accept refund' : 'Decline refund';
    const message =
      action === 'accept'
        ? `Accept the refund for ${item.subjectName || 'this course'}? Stripe will refund the student and the class will be cancelled.`
        : `Decline the refund for ${item.subjectName || 'this course'}? The class stays booked.`;

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: action === 'accept' ? 'Accept' : 'Decline',
        style: action === 'accept' ? 'destructive' : 'default',
        onPress: async () => {
          try {
            setActingId(item.id);
            await axiosWithAuth.post(
              `${ipURL}/api/admin/refund-requests/${item.id}/${action}`,
              {}
            );
            await fetchItems(query);
          } catch (err: any) {
            const msg = err?.response?.data?.message || `Could not ${action} this refund request.`;
            Alert.alert('Refund request', msg);
          } finally {
            setActingId(null);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']} accessibilityLabel="Refund requests">
      <View style={styles.header}>
        <Text style={styles.count}>{total} pending</Text>
      </View>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search student, course, or reason"
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No pending refund requests</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.subjectName || 'Course'}</Text>
              <Text style={styles.subtitle}>
                {item.studentName || 'Student'} · {item.studentEmail || ''}
              </Text>
              <Text style={styles.meta}>
                {item.purchaseAmountLabel} · {item.courseType || 'Course'}
              </Text>
              <Text style={styles.meta}>Class: {item.classStartsAtLabel || '—'}</Text>
              <Text style={styles.reasonLabel}>Reason</Text>
              <Text style={styles.reason}>{item.reason}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.declineButton, actingId === item.id && styles.disabled]}
                  disabled={actingId === item.id}
                  onPress={() => decide(item, 'decline')}
                >
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.acceptButton, actingId === item.id && styles.disabled]}
                  disabled={actingId === item.id}
                  onPress={() => decide(item, 'accept')}
                >
                  {actingId === item.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.acceptText}>Accept</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default RefundsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  count: {
    fontSize: 13,
    color: '#64748B',
  },
  searchRow: {
    marginTop: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    paddingHorizontal: 12,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A2B4B',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EEF4',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2B4B',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#475569',
  },
  meta: {
    marginTop: 8,
    fontSize: 12,
    color: '#64748B',
  },
  reasonLabel: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
    color: '#1A2B4B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  reason: {
    marginTop: 4,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  actions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  declineButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#E8EEF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    color: '#1A4C6E',
    fontWeight: '600',
  },
  acceptButton: {
    minHeight: 40,
    minWidth: 90,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#1A2B4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.7,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 15,
  },
});
