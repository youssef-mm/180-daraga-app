import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { AuthContext } from '../../App';
import { API_URL } from '../config/api';

export default function AddMeetingScreen({ navigation }) {
  const [title, setTitle] = useState('');

  // Date/Time States
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDeadline, setSelectedDeadline] = useState(null);

  // Pickers Visibility States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDeadlineDatePicker, setShowDeadlineDatePicker] = useState(false);
  const [showDeadlineTimePicker, setShowDeadlineTimePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const { userToken } = useContext(AuthContext);

  // دالة تنسيق التاريخ ليكون: mm/dd/yyyy
  const formatDate = (date) => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // دالة تنسيق الوقت ليكون: --:-- -- (12 Hours AM/PM)
  const formatTime = (date) => {
    if (!date) return '';
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');
    return `${strHours}:${minutes} ${ampm}`;
  };

  // دالة تنسيق الـ Deadline ليكون: mm/dd/yyyy --:-- --
  const formatDateTime = (date) => {
    if (!date) return '';
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  // معالجة اختيار التاريخ
  const onDateChange = (event, date) => {
    if (Platform.OS !== 'ios') setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // معالجة اختيار الوقت
  const onTimeChange = (event, time) => {
    if (Platform.OS !== 'ios') setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  // معالجة اختيار تاريخ الـ Deadline ثم وقته
  const onDeadlineDateChange = (event, date) => {
    if (Platform.OS !== 'ios') setShowDeadlineDatePicker(false);
    if (date) {
      const current = selectedDeadline ? new Date(selectedDeadline) : new Date();
      current.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      setSelectedDeadline(current);
      if (Platform.OS !== 'ios') {
        setShowDeadlineTimePicker(true);
      }
    }
  };

  const onDeadlineTimeChange = (event, time) => {
    if (Platform.OS !== 'ios') setShowDeadlineTimePicker(false);
    if (time) {
      const current = selectedDeadline ? new Date(selectedDeadline) : new Date();
      current.setHours(time.getHours(), time.getMinutes());
      setSelectedDeadline(current);
    }
  };

  const handleCreateMeeting = async () => {
    const formattedDate = formatDate(selectedDate);
    const formattedTime = formatTime(selectedTime);
    const formattedDeadline = formatDateTime(selectedDeadline);

    if (!title.trim() || !formattedDate || !formattedTime || !formattedDeadline) {
      Alert.alert('تنبيه', 'برجاء اختيار جميع البيانات المطلوبة (العنوان، التاريخ، الوقت، والموعد النهائي)');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/meetings`, {
        title: title.trim(),
        date: formattedDate,
        time: formattedTime,
        confirmationDeadline: formattedDeadline,
      });

      if (res.data.success || res.status === 201) {
        Alert.alert('نجاح', 'تمت إضافة الاجتماع بنجاح!');
        navigation.navigate('Home');
      }
    } catch (err) {
      console.log('Error creating meeting:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'فشل إضافة الاجتماع، تأكد من الاتصال بالباك إند';
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
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>New General Meeting</Text>

        {/* Meeting Title */}
        <Text style={styles.label}>Meeting Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Spring General Assembly"
          placeholderTextColor="#A0A0A0"
          value={title}
          onChangeText={setTitle}
        />

        {/* Date Field */}
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="mm/dd/yyyy"
              placeholderTextColor="#A0A0A0"
              value={formatDate(selectedDate)}
              editable={false}
            />
          </View>
        </TouchableOpacity>

        {/* Time Field */}
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} activeOpacity={0.8}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="--:-- --"
              placeholderTextColor="#A0A0A0"
              value={formatTime(selectedTime)}
              editable={false}
            />
          </View>
        </TouchableOpacity>

        {/* Confirmation Deadline Field */}
        <Text style={styles.label}>Confirmation Deadline</Text>
        <TouchableOpacity 
          onPress={() => {
            setShowDeadlineDatePicker(true);
            if (Platform.OS === 'ios') setShowDeadlineTimePicker(true);
          }} 
          activeOpacity={0.8}
        >
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="mm/dd/yyyy --:-- --"
              placeholderTextColor="#A0A0A0"
              value={formatDateTime(selectedDeadline)}
              editable={false}
            />
          </View>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.createBtn, loading && { opacity: 0.7 }]}
          onPress={handleCreateMeeting}
          disabled={loading}
        >
          <Text style={styles.createBtnText}>
            {loading ? 'Creating...' : 'Create Meeting'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Pickers Modals for iOS / Android */}
      {showDatePicker && (
        <View style={styles.pickerWrapper}>
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.doneBtn} onPress={() => setShowDatePicker(false)}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          )}
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            textColor="#000000"
            themeVariant="light"
          />
        </View>
      )}

      {showTimePicker && (
        <View style={styles.pickerWrapper}>
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.doneBtn} onPress={() => setShowTimePicker(false)}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          )}
          <DateTimePicker
            value={selectedTime || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
            textColor="#000000"
            themeVariant="light"
          />
        </View>
      )}

      {showDeadlineDatePicker && (
        <View style={styles.pickerWrapper}>
          {Platform.OS === 'ios' && (
            <TouchableOpacity 
              style={styles.doneBtn} 
              onPress={() => {
                setShowDeadlineDatePicker(false);
                setShowDeadlineTimePicker(false);
              }}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          )}
          <DateTimePicker
            value={selectedDeadline || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDeadlineDateChange}
            textColor="#000000"
            themeVariant="light"
          />
        </View>
      )}

      {showDeadlineTimePicker && Platform.OS === 'ios' && (
        <View style={styles.pickerWrapper}>
          <DateTimePicker
            value={selectedDeadline || new Date()}
            mode="time"
            display="spinner"
            onChange={onDeadlineTimeChange}
            textColor="#000000"
            themeVariant="light"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 5 },
  backArrow: { fontSize: 22, color: '#333' },
  content: { paddingHorizontal: 20, marginTop: 10 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 25 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 18,
    color: '#333',
  },
  createBtn: {
    backgroundColor: '#7A1C1C',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  createBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  doneBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F0F0F0',
    width: '100%',
    alignItems: 'flex-end',
  },
  doneBtnText: {
    color: '#7A1C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});