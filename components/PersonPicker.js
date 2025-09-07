import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PersonPicker({ persons, selectedValue, onValueChange }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                <Icon name="account" size={16} color="#AAA" /> Person *
            </Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={styles.picker}
                    dropdownIconColor="#6C63FF"
                >
                    {persons.map((p) => (
                        <Picker.Item key={p.id} label={p.name} value={p.id} color="white" />
                    ))}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: '#AAA',
        marginBottom: 4,
        fontSize: 14,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        color: 'white',
        backgroundColor: '#1E1E1E',
    },
});