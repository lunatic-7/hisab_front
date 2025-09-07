import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PlatformPicker({ selectedValue, onValueChange }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                <Icon name="web" size={16} color="#AAA" /> Platform
            </Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedValue || 'zomato'}
                    onValueChange={onValueChange}
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