import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function MeetingDetailScreen({ route, navigation }) {
  const { meeting } = route.params || {};
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState(null); // 'Confirmed' or 'Declined'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('تنبيه', 'برجاء إدخال اسمك الكامل');
      return;
    }
    if (!attendance) {
      Alert.alert('تنبيه', 'برجاء تحديد موقفك من الحضور');
      return;
    }
    if (!meeting?.id) {
      Alert.alert('خطأ', 'تعذر تحديد رقم الاجتماع، يرجى المحاولة لاحقاً');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/meetings/${meeting.id}/responses`, {
        name: name.trim(),
        status: attendance,
      });

      if (res.data.success || res.status === 201 || res.status === 200) {
        Alert.alert('نجاح', 'تم تسجيل موقفك من الحضور بنجاح!');
        navigation.goBack();
      }
    } catch (err) {
      console.log('Submit response error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'فشل إرسال الرد، تأكد من الاتصال بالباك إند';
      Alert.alert('خطأ', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meeting Details</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{meeting?.title || 'General Assembly — Spring Semester'}</Text>
        <Text style={styles.date}>
          📅 {meeting?.date} {meeting?.time ? `- ${meeting.time}` : ''}
        </Text>

        <View style={styles.badgeBanner}>
          <Text style={styles.badgeText}>
            ⏰ {meeting?.confirmationDeadline || meeting?.deadline || 'Confirm soon'}
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full name as registered"
            placeholderTextColor="#A0A0A0"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Will you attend?</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.choiceBtn, attendance === 'Confirmed' && styles.selectedChoice]}
              onPress={() => setAttendance('Confirmed')}
            >
              <Text style={[styles.choiceText, attendance === 'Confirmed' && styles.selectedText]}>
                I'll Attend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.choiceBtn, attendance === 'Declined' && styles.selectedChoice]}
              onPress={() => setAttendance('Declined')}
            >
              <Text style={[styles.choiceText, attendance === 'Declined' && styles.selectedText]}>
                I Can't Attend
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!name.trim() || !attendance || loading) && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!name.trim() || !attendance || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Response</Text>
            )}
          </TouchableOpacity>
        </View>
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
    paddingBottom: 10,
  },
  backArrow: { fontSize: 22, color: '#333', marginRight: 15 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  content: { paddingHorizontal: 20, marginTop: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', lineHeight: 26 },
  date: { fontSize: 13, color: '#666', marginTop: 8 },
  badgeBanner: {
    backgroundColor: '#7A1C1C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 18,
  },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', textAlign: 'center' },
  formSection: { marginTop: 25 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 6 },
  choiceBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  selectedChoice: { borderColor: '#7A1C1C', backgroundColor: '#FFF0F0' },
  choiceText: { fontSize: 13, color: '#333', fontWeight: '500' },
  selectedText: { color: '#7A1C1C', fontWeight: 'bold' },
  submitBtn: {
    backgroundColor: '#7A1C1C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  submitBtnDisabled: { backgroundColor: '#BDBDBD' },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});