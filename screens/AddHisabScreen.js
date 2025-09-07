import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Divider, FAB } from 'react-native-paper';
import { api } from '../utils/api';
import * as Animatable from 'react-native-animatable';
import PersonPicker from '../components/PersonPicker';
import ItemInput from '../components/ItemInput';
import PriceInput from '../components/PriceInput';
import DescriptionInput from '../components/DescriptionInput';
import OnlinePurchaseSwitch from '../components/OnlinePurchaseSwitch';
import PlatformPicker from '../components/PlatformPicker';
import DatePicker from '../components/DatePicker';
import SubmitButton from '../components/SubmitButton';
import LoadingSpinner from '../components/LoadingSpinner';

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
  }, [editingMode, editingHisab]);

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

      // Call the onGoBack callback if provided
      if (route.params?.onGoBack) {
        route.params.onGoBack();
      }

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save hisab:', error);
      Alert.alert('❌ Error', 'Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateHisab = (field, value) => {
    setHisab(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={600} useNativeDriver style={styles.animatedView}>
        <Card style={styles.card}>
          <FAB
            icon={editingMode ? "pencil" : "plus-circle"}
            style={styles.titleFab}
            color="white"
            size="small"
            customSize={40}
            theme={{ colors: { accent: '#6C63FF' } }}
            onPress={() => { }} // Empty handler since it's just decorative
          />
          <Card.Title
            title={`${editingMode ? 'Edit' : 'Add'} hisab ${personName ? `for ${personName}` : ''}`}
            titleStyle={styles.cardTitle}
          />

          <Card.Content>
            {fetchingPersons && !preselectedPersonId ? (
              <LoadingSpinner text="Loading persons..." />
            ) : (
              <>
                {!preselectedPersonId && (
                  <PersonPicker
                    persons={persons}
                    selectedValue={hisab.person}
                    onValueChange={(value) => updateHisab('person', value)}
                  />
                )}

                <ItemInput
                  value={hisab.item}
                  onChangeText={(value) => updateHisab('item', value)}
                />

                <PriceInput
                  value={hisab.price}
                  onChangeText={(value) => updateHisab('price', value)}
                />

                <DescriptionInput
                  value={hisab.description}
                  onChangeText={(value) => updateHisab('description', value)}
                />

                <OnlinePurchaseSwitch
                  value={hisab.if_online}
                  onValueChange={(value) => {
                    updateHisab('if_online', value);
                    if (value) {
                      updateHisab('platform', 'zomato');
                    }
                  }}
                />

                {hisab.if_online && (
                  <PlatformPicker
                    selectedValue={hisab.platform}
                    onValueChange={(value) => updateHisab('platform', value)}
                  />
                )}

                <DatePicker
                  date={hisab.date}
                  onDateChange={(date) => updateHisab('date', date)}
                />
              </>
            )}
          </Card.Content>

          <Divider style={styles.divider} />

          <Card.Actions style={styles.actions}>
            <SubmitButton
              loading={loading}
              disabled={loading || fetchingPersons}
              editingMode={editingMode}
              onPress={submit}
            />
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
    fontSize: 20,
    marginTop: 30,
    marginLeft: 50,
    marginBottom: 10,
  },
  titleFab: {
    position: 'absolute',
    top: 19,
    left: 16,
  },
  divider: {
    backgroundColor: '#333',
    marginVertical: 8,
  },
  actions: {
    justifyContent: 'center',
    padding: 16,
  },
});