import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, IconButton, FAB, Portal, Dialog, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { api } from '../utils/api';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

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
        <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={index * 100}
            useNativeDriver
        >
            <Card
                style={styles.card}
                onPress={() => navigation.navigate('ViewHisabs', {
                    personId: item.id,
                    personName: item.name
                })}
            >
                <Card.Content style={styles.cardContent}>
                    <View style={styles.personInfo}>
                        <Icon name="account-circle" size={28} color="#6C63FF" />
                        <Text variant="titleMedium" style={styles.personName}>
                            {item.name}
                        </Text>
                    </View>
                    <IconButton
                        icon="delete"
                        iconColor="#FF6584"
                        size={24}
                        onPress={(e) => {
                            e.stopPropagation();
                            handleDeletePerson(item.id, item.name);
                        }}
                        style={styles.deleteButton}
                    />
                </Card.Content>
            </Card>
        </Animatable.View>
    );

    return (
        <View style={styles.container}>
            {loading && persons.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        animating={true}
                        color="#6C63FF"
                        size="large"
                    />
                    <Text style={styles.loadingText}>Loading your hisabs...</Text>
                </View>
            ) : (
                <FlatList
                    data={persons}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPerson}
                    ListEmptyComponent={
                        <Animatable.View
                            animation="fadeIn"
                            duration={1000}
                            style={styles.emptyContainer}
                        >
                            <Icon name="account-multiple" size={60} color="#444" />
                            <Text style={styles.emptyText}>No persons added yet</Text>
                            <Text style={styles.emptySubtext}>Tap the + button to add someone</Text>
                        </Animatable.View>
                    }
                    contentContainerStyle={persons.length === 0 && styles.emptyList}
                    refreshing={loading}
                    onRefresh={fetchPersons}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Portal>
                <Dialog
                    visible={showDialog}
                    onDismiss={() => setShowDialog(false)}
                    style={styles.dialog}
                >
                    <View style={styles.dialogContent}>
                        <Dialog.Title style={styles.dialogTitle}>➕ Add New Person</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                label="Person's Name"
                                value={newPerson}
                                onChangeText={setNewPerson}
                                mode="outlined"
                                outlineColor="#6C63FF"
                                activeOutlineColor="#6C63FF"
                                style={styles.input}
                                theme={{ colors: { text: 'white', placeholder: '#AAA' } }}
                                left={<TextInput.Icon icon="account" color="#6C63FF" />}
                                autoFocus
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                onPress={() => setShowDialog(false)}
                                textColor="#AAA"
                            >
                                Cancel
                            </Button>
                            <Button
                                onPress={handleAddPerson}
                                textColor="#6C63FF"
                                labelStyle={{ fontWeight: 'bold' }}
                            >
                                Add Person
                            </Button>
                        </Dialog.Actions>
                    </View>
                </Dialog>
            </Portal>

            <Animatable.View
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
                duration={2000}
            >
                <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={() => setShowDialog(true)}
                    color="white"
                    animated
                    customSize={60}
                    theme={{ colors: { accent: '#6C63FF' } }}
                />
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
    card: {
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: '#1E1E1E',
        elevation: 3,
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    personInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    personName: {
        color: 'white',
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    deleteButton: {
        margin: 0,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        backgroundColor: '#6C63FF',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#888',
        fontSize: 18,
        marginTop: 16,
        fontWeight: '500',
    },
    emptySubtext: {
        color: '#555',
        fontSize: 14,
        marginTop: 8,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
    },
    dialog: {
        borderRadius: 16,
        backgroundColor: '#1E1E1E',
    },
    dialogContent: {
        backgroundColor: '#1E1E1E',
        padding: 8,
    },
    dialogTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#1E1E1E',
        marginTop: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#AAA',
        marginTop: 16,
    },
});