import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function OnlinePurchaseSwitch({ value, onValueChange }) {
    const theme = useTheme(); // ✅ use the Paper theme

    return (
        <View style={[styles.switchRow, { backgroundColor: theme.colors.background, borderColor: theme.colors.outline }]}>
            <View style={styles.switchLabel}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Icon name="web" size={18} color={theme.colors.text} />
                </View>
                <Text style={[styles.switchText, { color: theme.colors.text }]}>Online?</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                color={theme.colors.primary}
                theme={{
                    colors: {
                        surfaceDisabled: theme.colors.surfaceVariant,
                    }
                }}
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
        paddingHorizontal: 4,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    switchLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    switchText: {
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
});
