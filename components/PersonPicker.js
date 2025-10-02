import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PersonPicker({ persons, selectedValue, onValueChange }) {
    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <View style={styles.iconBadge}>
                    <Icon name="account" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.label}>Person *</Text>
            </View>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={styles.picker}
                    dropdownIconColor="#FFFFFF"
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
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconBadge: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#2A2A2A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
    },
    picker: {
        color: '#FFFFFF',
        backgroundColor: '#1A1A1A',
        height: 50,
    },
});