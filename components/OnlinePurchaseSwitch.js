import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function OnlinePurchaseSwitch({ value, onValueChange }) {
    return (
        <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
                <Icon name="web" size={20} color="#AAA" />
                <Text style={styles.switchText}> Online Purchase?</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                color="#6C63FF"
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
});