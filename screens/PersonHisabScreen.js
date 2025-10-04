import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Portal } from 'react-native-paper';
import { api } from '../utils/api';
import PersonCard from '../components/cards/PersonCard';
import AddPersonDialog from '../components/extras/AddPersonDialog';
import AddFAB from '../components/extras/AddFAB';
import EmptyState from '../components/extras/EmptyState';
import LoadingSpinner from '../components/extras/LoadingSpinner';

export default function PersonHisabScreen({ navigation }) {
    const [persons, setPersons] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [newPerson, setNewPerson] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchPersons = async () => {
        try {
            setLoading(true);
            const res = await api.get('/persons/');
            setPersons(res.data);
        } catch (err) {
            console.error('Failed to fetch persons:', err);
            Alert.alert('❌ Error', 'Failed to fetch persons. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPerson = async () => {
        if (!newPerson.trim()) {
            Alert.alert('⚠️ Oops', 'Please enter a name');
            return;
        }

        try {
            await api.post('/persons/', { name: newPerson });
            setNewPerson('');
            setShowDialog(false);
            fetchPersons();
        } catch (error) {
            console.error('Failed to add person:', error);
            Alert.alert('❌ Error', 'Failed to add person. Please try again.');
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchPersons);
        return unsubscribe;
    }, [navigation]);

    const handleDeletePerson = async (id, name) => {
        Alert.alert(
            '🗑️ Uda de moti ji?',
            `Are you sure you want to delete ${name}?`,
            [
                {
                    text: 'Nhi nhi',
                    style: 'cancel',
                },
                {
                    text: 'Chle na',
                    style: 'destructive',
                    onPress: async () => {
                        await api.delete(`/persons/${id}/delete/`);
                        await fetchPersons();
                    }
                }
            ]
        );
    };

    const renderPerson = ({ item, index }) => (
        <PersonCard
            person={item}
            index={index}
            onPress={() => navigation.navigate('ViewHisabs', {
                personId: item.id,
                personName: item.name
            })}
            onDelete={() => handleDeletePerson(item.id, item.name)}
        />
    );

    return (
        <View style={styles.container}>
            {loading && persons.length === 0 ? (
                <LoadingSpinner text="Loading persons..." />
            ) : (
                <FlatList
                    data={persons}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPerson}
                    ListEmptyComponent={
                        <EmptyState
                            icon="account-multiple"
                            title="No persons added yet"
                            subtitle="Tap the + button to add someone"
                        />
                    }
                    contentContainerStyle={persons.length === 0 && styles.emptyList}
                    refreshing={loading}
                    onRefresh={fetchPersons}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Portal>
                <AddPersonDialog
                    visible={showDialog}
                    onDismiss={() => setShowDialog(false)}
                    newPerson={newPerson}
                    setNewPerson={setNewPerson}
                    onAddPerson={handleAddPerson}
                />
            </Portal>

            <AddFAB
                icon="account-plus"
                onPress={() => setShowDialog(true)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000000', // Pure black background
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
    },
});