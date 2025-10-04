import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

export default function BackButton({ onPress }) {
    const theme = useTheme();

    return (
        <TouchableOpacity
            style={[styles.backButton, {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
            }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Icon name="arrow-left" size={20} color={theme.colors.text} />
            <Text style={[styles.backButtonText, { color: theme.colors.text }]}>
                Back to months
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        width: '40%',
    },
    backButtonText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '500',
    },
});