import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Switch, Text, Card, Divider, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { api } from '../utils/api';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

export default function AddHisabScreen({ route, navigation }) {
  const preselectedPersonId = route.params?.personId;
  const personName = route.params?.personName;

  const editingMode = route.params?.mode === 'edit';
  const editingHisab = route.params?.hisab;

  const [persons, setPersons] = useState([]);
  const [hisab, setHisab] = useState({
    person: preselectedPersonId || '',
    item: '',
    price: '',
    description: '',
    if_online: false,
    platform: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [fetchingPersons, setFetchingPersons] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        setFetchingPersons(true);
        const res = await api.get('/persons/');
        setPersons(res.data);

        if (!preselectedPersonId && res.data.length > 0) {
          setHisab((prev) => ({ ...prev, person: res.data[0].id }));
        }
      } catch (error) {
        console.error('Failed to fetch persons:', error);
        Alert.alert('❌ Error', 'Failed to load persons. Please try again.');
      } finally {
        setFetchingPersons(false);
      }
    };

    fetchPersons();
  }, [preselectedPersonId]);

  useEffect(() => {
    if (editingMode && editingHisab) {
      setHisab({
        ...editingHisab,
        date: editingHisab.date,
      });
    }
  }, []);

  const submit = async () => {
    if (!hisab.item || !hisab.price || !hisab.person) {
      Alert.alert('⚠️ Missing Info', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (editingMode) {
        await api.put(`/hisabs/${editingHisab.id}/`, hisab);
      } else {
        await api.post('/hisabs/', hisab);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save hisab:', error);
      Alert.alert('❌ Error', 'Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={600} useNativeDriver style={styles.animatedView}>
        <Card style={styles.card}>
          <Card.Title
            title={`${editingMode ? 'Edit' : 'Add'} Transaction ${personName ? `for ${personName}` : ''}`}
            titleStyle={styles.cardTitle}
            left={(props) => <Icon {...props} name={editingMode ? "pencil" : "plus-circle"} size={24} color="#6C63FF" />}
          />

          <Card.Content>
            {fetchingPersons && !preselectedPersonId ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} color="#6C63FF" />
                <Text style={styles.loadingText}>Loading persons...</Text>
              </View>
            ) : (
              <>
                {!preselectedPersonId && (
                  <>
                    <Text style={styles.label}>
                      <Icon name="account" size={16} color="#AAA" /> Person *
                    </Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={hisab.person}
                        onValueChange={(value) => setHisab({ ...hisab, person: value })}
                        style={styles.picker}
                        dropdownIconColor="#6C63FF"
                      >
                        {persons.map((p) => (
                          <Picker.Item key={p.id} label={p.name} value={p.id} color="white" />
                        ))}
                      </Picker>
                    </View>
                  </>
                )}

                <TextInput
                  label="Item *"
                  value={hisab.item}
                  mode="outlined"
                  onChangeText={(val) => setHisab({ ...hisab, item: val })}
                  style={styles.input}
                  theme={styles.inputTheme}
                  left={<TextInput.Icon icon="shopping" color="#6C63FF" />}
                />

                <TextInput
                  label="Price *"
                  value={hisab.price}
                  mode="outlined"
                  keyboardType="numeric"
                  onChangeText={(val) => setHisab({ ...hisab, price: val })}
                  style={styles.input}
                  theme={styles.inputTheme}
                  left={<TextInput.Icon icon="currency-inr" color="#6C63FF" />}
                />

                <TextInput
                  label="Description"
                  value={hisab.description}
                  mode="outlined"
                  onChangeText={(val) => setHisab({ ...hisab, description: val })}
                  style={styles.input}
                  theme={styles.inputTheme}
                  left={<TextInput.Icon icon="text" color="#6C63FF" />}
                  multiline
                />

                <View style={styles.switchRow}>
                  <View style={styles.switchLabel}>
                    <Icon name="web" size={20} color="#AAA" />
                    <Text style={styles.switchText}> Online Purchase?</Text>
                  </View>
                  <Switch
                    value={hisab.if_online}
                    onValueChange={(val) =>
                      setHisab((prev) => ({
                        ...prev,
                        if_online: val,
                        platform: val ? 'zomato' : '',
                      }))
                    }
                    color="#6C63FF"
                  />
                </View>

                {hisab.if_online && (
                  <>
                    <Text style={styles.label}>
                      <Icon name="web" size={16} color="#AAA" /> Platform
                    </Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={hisab.platform || 'zomato'}
                        onValueChange={(value) => setHisab({ ...hisab, platform: value })}
                        style={styles.picker}
                        dropdownIconColor="#6C63FF"
                      >
                        <Picker.Item label="Zomato" value="zomato" color="white" />
                        <Picker.Item label="Swiggy" value="swiggy" color="white" />
                        <Picker.Item label="Amazon" value="amazon" color="white" />
                        <Picker.Item label="Flipkart" value="flipkart" color="white" />
                        <Picker.Item label="Blinkit" value="blinkit" color="white" />
                        <Picker.Item label="Zepto" value="zepto" color="white" />
                        <Picker.Item label="Others" value="others" color="white" />
                      </Picker>
                    </View>
                  </>
                )}

                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateText}>
                    <Icon name="calendar" size={16} color="#AAA" /> Date: {format(new Date(hisab.date), 'dd MMM yyyy')}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={new Date(hisab.date)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setHisab({ ...hisab, date: selectedDate.toISOString().split('T')[0] });
                      }
                    }}
                    maximumDate={new Date()}
                  />
                )}
              </>
            )}
          </Card.Content>

          <Divider style={styles.divider} />

          <Card.Actions style={styles.actions}>
            <Button
              mode="contained"
              onPress={submit}
              disabled={loading || fetchingPersons}
              loading={loading}
              style={styles.submitButton}
              labelStyle={styles.buttonLabel}
              icon={editingMode ? 'pencil' : 'check-circle'}
            >
              {loading
                ? editingMode
                  ? 'Updating...'
                  : 'Adding...'
                : editingMode
                  ? 'Update Transaction'
                  : 'Add Transaction'}
            </Button>
          </Card.Actions>
        </Card>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  animatedView: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#1E1E1E',
    elevation: 3,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 8,
    backgroundColor: '#1E1E1E',
  },
  inputTheme: {
    colors: {
      text: 'white',
      placeholder: '#AAA',
      primary: '#6C63FF',
      background: 'transparent',
      surface: '#1E1E1E',
    },
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    color: '#AAA',
  },
  label: {
    color: '#AAA',
    marginTop: 8,
    marginBottom: 4,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    color: 'white',
    backgroundColor: '#1E1E1E',
  },
  divider: {
    backgroundColor: '#333',
    marginVertical: 8,
  },
  actions: {
    justifyContent: 'center',
    padding: 16,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateText: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#AAA',
    marginTop: 16,
  },
});