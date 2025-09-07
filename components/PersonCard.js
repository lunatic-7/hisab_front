import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

export default function PersonCard({ person, index, onPress, onDelete }) {
    return (
        <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={index * 100}
            useNativeDriver
        >
            <Card style={styles.card} onPress={onPress}>
                <Card.Content style={styles.cardContent}>
                    <View style={styles.personInfo}>
                        <Icon name="account-circle" size={28} color="#6C63FF" />
                        <Text variant="titleMedium" style={styles.personName}>
                            {person.name}
                        </Text>
                    </View>
                    <IconButton
                        icon="delete"
                        iconColor="#FF6584"
                        size={24}
                        onPress={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        style={styles.deleteButton}
                    />
                </Card.Content>
            </Card>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: '#1E1E1E',
        elevation: 3,
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    personInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    personName: {
        color: 'white',
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    deleteButton: {
        margin: 0,
    },
});