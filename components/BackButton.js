import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BackButton({ onPress }) {
    return (
        <TouchableOpacity style={styles.backButton} onPress={onPress}>
            <Icon name="arrow-left" size={20} color="#6C63FF" />
            <Text style={styles.backButtonText}>Back to months</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
    },
    backButtonText: {
        color: '#6C63FF',
        marginLeft: 8,
        fontSize: 16,
    },
});