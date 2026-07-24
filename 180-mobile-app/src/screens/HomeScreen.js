import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../../App';
import { API_URL } from '../config/api';

export default function HomeScreen({ navigation }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userToken, logout } = useContext(AuthContext);

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${API_URL}/meetings`);
      if (res.data.success && res.data.data) {
        setMeetings(res.data.data);
      }
    } catch (err) {
      console.log('Fetch meetings error:', err.message);
      setMeetings((prev) => 
        prev.length > 0 ? prev : [
          {
            id: 1,
            title: 'General Assembly — Spring Semester',
            date: 'Tuesday, 8 July 2026 - 6:00 PM',
            deadline: 'Confirm by 5 July 2026',
            isConfirmed: true, // 👈 مثال لاجتماع تم تأكيده
          },
          {
            id: 2,
            title: 'Emergency Assembly — Budget Rev...',
            date: 'Saturday, 12 July 2026 - 3:00 PM',
            deadline: 'Confirm by 10 July 2026',
            isConfirmed: false,
          },
          {
            id: 3,
            title: 'End-of-Year Closing Ceremony',
            date: 'Friday, 25 July 2026 - 7:30 PM',
            deadline: 'Confirm by 20 July 2026',
            isConfirmed: false,
          },
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMeetings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchMeetings();
  };

  const renderMeetingCard = ({ item }) => {
    // التأكد من حالة الحضور (سواء جاية من السيرفر أو متخزنة محلياً)
    const confirmed = item.isConfirmed || item.userStatus === 'attending';

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('MeetingDetail', { meeting: item })}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
          
          <Text style={styles.cardDate}>
            📅 {item.date} {item.time ? `- ${item.time}` : ''}
          </Text>
          
          {/* شريط الحالة المخصص حسب التأكيد */}
          <View style={styles.deadlineRow}>
            {confirmed ? (
              <View style={styles.confirmedBadge}>
                <Text style={styles.confirmedText}>✓ Attendance Confirmed</Text>
              </View>
            ) : (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>
                  ⏰ {item.confirmationDeadline || item.deadline}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {userToken && (
          <TouchableOpacity
            style={styles.responsesBtn}
            onPress={() => navigation.navigate('Responses', { meeting: item })}
          >
            <Text style={styles.responsesBtnText}>📊 View Responses</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image
          source={require('../../assets/180daraga.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {userToken ? (
          <TouchableOpacity onPress={logout}>
            <Text style={styles.loginLink}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Highboard Login</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Meetings</Text>
        <Text style={styles.subtitle}>Tap a meeting to confirm your attendance</Text>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#7A1C1C" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={meetings}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          renderItem={renderMeetingCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#7A1C1C']}
              tintColor="#7A1C1C"
            />
          }
        />
      )}

      {/* Floating Action Button (Highboard Only) */}
      {userToken && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddMeeting')}
        >
          <Text style={styles.fabText}>+ Add Meeting</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  logoImage: { width: 45, height: 45 },
  loginLink: { color: '#7A1C1C', fontWeight: 'bold', fontSize: 13 },
  header: { paddingHorizontal: 20, marginTop: 15, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 13, color: '#777', marginTop: 4 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#222', flex: 1 },
  chevron: { fontSize: 20, color: '#CCC', marginLeft: 8 },
  cardDate: { fontSize: 12, color: '#666', marginTop: 8 },
  deadlineRow: { marginTop: 12 },
  
  // شارات التاكيد الجديدة
  pendingBadge: {
    backgroundColor: '#FFF5F5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  pendingText: { fontSize: 11, color: '#990000', fontWeight: '600' },
  
  confirmedBadge: {
    backgroundColor: '#E6F4EA',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  confirmedText: { fontSize: 11, color: '#137333', fontWeight: 'bold' },

  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#7A1C1C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  responsesBtn: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'flex-end',
  },
  responsesBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7A1C1C',
  },
});