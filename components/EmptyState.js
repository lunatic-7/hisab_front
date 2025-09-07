import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

export default function EmptyState({ icon, title, subtitle }) {
    return (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.emptyContainer}>
            <Icon name={icon} size={60} color="#444" />
            <Text style={styles.emptyText}>{title}</Text>
            {subtitle && <Text style={styles.emptySubtext}>{subtitle}</Text>}
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
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
});