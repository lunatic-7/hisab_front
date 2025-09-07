import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export default function LoadingSpinner({ text = "Loading..." }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator animating={true} color="#6C63FF" size="large" />
            <Text style={styles.text}>{text}</Text>
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
        color: '#AAA',
        marginTop: 16,
        fontSize: 16,
    },
});