import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Divider, FAB, useTheme } from 'react-native-paper';
import { api } from '../utils/api';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  const theme = useTheme();
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

      if (route.params?.onGoBack) route.params.onGoBack();

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
    <KeyboardAwareScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
    >
      <Animatable.View animation="fadeInUp" duration={600} useNativeDriver>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
          <FAB
            icon={editingMode ? "pencil" : "plus-circle"}
            style={[styles.titleFab, { backgroundColor: theme.colors.primary }]}
            color={theme.colors.background}
            size="small"
            customSize={40}
            onPress={() => { }}
          />

          <Card.Title
            title={`${editingMode ? 'Edit' : 'Add'} hisab ${personName ? `for ${personName}` : ''}`}
            titleStyle={[styles.cardTitle, { color: theme.colors.text }]}
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
                    if (value) updateHisab('platform', 'zomato');
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

          <Divider style={{ backgroundColor: theme.colors.outline, marginVertical: 8 }} />

          <Card.Actions style={{ justifyContent: 'center', padding: 16 }}>
            <SubmitButton
              loading={loading}
              disabled={loading || fetchingPersons}
              editingMode={editingMode}
              onPress={submit}
            />
          </Card.Actions>
        </Card>
      </Animatable.View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 0,
    borderWidth: 1,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 0.2,
    marginTop: 30,
    marginLeft: 50,
    marginBottom: 10,
  },
  titleFab: {
    position: 'absolute',
    top: 19,
    left: 16,
  },
});
