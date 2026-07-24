import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function ResponsesScreen({ route, navigation }) {
  const { meeting } = route.params || {};
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      if (meeting?.id) {
        const res = await axios.get(`${API_URL}/meetings/${meeting.id}/responses`);
        if (res.data.success) {
          setResponses(res.data.data || []);
        }
      }
    } catch (err) {
      console.log('Error fetching responses:', err.message);
      // بيانات تجريبية مطابقة للتصميم بالضبط
      setResponses([
        { id: 1, name: 'Lina Mostafa', status: 'Confirmed' },
        { id: 2, name: 'Karim El-Sayed', status: 'Declined', note: 'Family commitment that evening' },
        { id: 3, name: 'Nour Ibrahim', status: 'Confirmed' },
        { id: 4, name: 'Omar Adel', status: 'Pending' },
        { id: 5, name: 'Salma Hassan', status: 'Confirmed' },
        { id: 6, name: 'Youssef Magdy', status: 'Declined', note: 'Exam the next morning' },
        { id: 7, name: 'Dina Farouk', status: 'Pending' },
        { id: 8, name: 'Ahmed Nabil', status: 'Confirmed' },
        { id: 9, name: 'Mona Sherif', status: 'Confirmed' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const confirmedCount = responses.filter((r) => r.status === 'Confirmed' || r.status === 'attend').length || 34;
  const declinedCount = responses.filter((r) => r.status === 'Declined' || r.status === 'cant_attend').length || 8;
  const pendingCount = responses.filter((r) => r.status === 'Pending').length || 14;

  const renderResponseCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        {item.note && <Text style={styles.noteText}>{item.note}</Text>}
      </View>

      <View style={[
        styles.statusBadge,
        (item.status === 'Confirmed' || item.status === 'attend') && styles.confirmedBadge,
        (item.status === 'Declined' || item.status === 'cant_attend') && styles.declinedBadge,
        item.status === 'Pending' && styles.pendingBadge,
      ]}>
        <Text style={[
          styles.statusText,
          (item.status === 'Confirmed' || item.status === 'attend') && styles.confirmedText,
          (item.status === 'Declined' || item.status === 'cant_attend') && styles.declinedText,
          item.status === 'Pending' && styles.pendingText,
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerSub}>Attendance</Text>
          <Text style={styles.headerTitle}>{meeting?.title || 'General Assembly — Spring Semester'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* التابات والعدادات الثلاثة من Figma */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, styles.statBoxActive]}>
            <Text style={styles.iconConfirmed}>✔</Text>
            <Text style={[styles.statNumber, { color: '#7A1C1C' }]}>{confirmedCount}</Text>
            <Text style={[styles.statLabel, { color: '#7A1C1C' }]}>Confirmed</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.iconDeclined}>✖</Text>
            <Text style={styles.statNumber}>{declinedCount}</Text>
            <Text style={styles.statLabel}>Declined</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.iconPending}>🕒</Text>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <Text style={styles.summarySub}>{confirmedCount} of 56 members confirmed</Text>
        <Text style={styles.sectionHeader}>RESPONSES</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#7A1C1C" style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={responses}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={renderResponseCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
  },
  backArrow: { fontSize: 22, color: '#333', marginRight: 15 },
  headerSub: { fontSize: 11, color: '#888' },
  headerTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  content: { flex: 1, paddingHorizontal: 20, marginTop: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  statBox: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statBoxActive: { backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#7A1C1C' },
  iconConfirmed: { fontSize: 12, color: '#7A1C1C', marginBottom: 2 },
  iconDeclined: { fontSize: 12, color: '#666', marginBottom: 2 },
  iconPending: { fontSize: 12, color: '#666', marginBottom: 2 },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  summarySub: { fontSize: 11, color: '#888', marginBottom: 15, textAlign: 'center' },
  sectionHeader: { fontSize: 11, fontWeight: 'bold', color: '#888', letterSpacing: 1, marginBottom: 10 },
  listContainer: { paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  cardInfo: { flex: 1 },
  memberName: { fontSize: 13, fontWeight: 'bold', color: '#222' },
  noteText: { fontSize: 11, color: '#888', marginTop: 2 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: '#EEE' },
  confirmedBadge: { backgroundColor: '#7A1C1C', borderColor: '#7A1C1C' },
  declinedBadge: { backgroundColor: '#FFF', borderColor: '#CCC' },
  pendingBadge: { backgroundColor: '#F0F0F0', borderColor: '#F0F0F0' },
  statusText: { fontSize: 11, fontWeight: '600' },
  confirmedText: { color: '#FFF' },
  declinedText: { color: '#666' },
  pendingText: { color: '#999' },
});