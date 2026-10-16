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

type DeletionRequestRow = {
  id: string;
  status: string;
  userId: string | null;
  userName: string;
  userEmail: string;
  userType: string;
  createdAt: string;
};

const DeletionRequestsScreen = () => {
  const [items, setItems] = useState<DeletionRequestRow[]>([]);
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
      const response = await axiosWithAuth.get(
        `${ipURL}/api/admin/deletion-requests?${params.toString()}`
      );
      setItems(response.data?.deletionRequests || []);
      setTotal(response.data?.total || 0);
    } catch {
      setError('Failed to load deletion requests');
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

  const approve = (item: DeletionRequestRow) => {
    Alert.alert(
      'Approve & delete',
      `Permanently delete ${item.userName} (${item.userEmail})? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve & delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setActingId(item.id);
              await axiosWithAuth.post(
                `${ipURL}/api/admin/deletion-requests/${item.id}/approve`,
                {}
              );
              await fetchItems(query);
            } catch (err: any) {
              const msg =
                err?.response?.data?.message || 'Could not approve this deletion request.';
              Alert.alert('Deletion request', msg);
            } finally {
              setActingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']} accessibilityLabel="Deletion requests">
      <View style={styles.header}>
        <Text style={styles.count}>{total} pending</Text>
      </View>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name or email"
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
          ListEmptyComponent={<Text style={styles.emptyText}>No pending deletion requests</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.userName}</Text>
              <Text style={styles.subtitle}>{item.userEmail}</Text>
              <Text style={styles.meta}>
                {item.userType} · {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.approveButton, actingId === item.id && styles.disabled]}
                  disabled={actingId === item.id}
                  onPress={() => approve(item)}
                >
                  {actingId === item.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.approveText}>Approve & delete</Text>
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

export default DeletionRequestsScreen;

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
  actions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  approveButton: {
    minHeight: 40,
    minWidth: 140,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveText: {
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
