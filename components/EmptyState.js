import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

export default function EmptyState({ icon, title, subtitle }) {
    return (
        <Animatable.View animation="fadeIn" duration={1000} style={styles.emptyContainer}>
            <View style={styles.iconContainer}>
                <Icon name={icon} size={64} color="#FFFFFF" style={styles.icon} />
            </View>
            <Text style={styles.emptyText}>{title}</Text>
            {subtitle && <Text style={styles.emptySubtext}>{subtitle}</Text>}
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#1A1A1A',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    icon: {
        opacity: 0.9,
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: 20,
        marginTop: 20,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    emptySubtext: {
        color: '#AAAAAA',
        fontSize: 15,
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
});