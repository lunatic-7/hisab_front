import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export default function LoadingSpinner({ text = "Loading..." }) {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
            <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 20,
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
});
