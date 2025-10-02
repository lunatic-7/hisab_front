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
                        <View style={styles.iconContainer}>
                            <Icon name="account-circle" size={24} color="#FFFFFF" />
                        </View>
                        <Text variant="titleMedium" style={styles.personName}>
                            {person.name}
                        </Text>
                    </View>
                    <IconButton
                        icon="trash-can-outline"
                        iconColor="#666666"
                        size={20}
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
        marginVertical: 6,
        marginHorizontal: 16,
        borderRadius: 16,
        backgroundColor: '#1A1A1A',
        elevation: 0,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    personInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#2A2A2A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    personName: {
        color: '#FFFFFF',
        marginLeft: 16,
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: 0.3,
        flex: 1,
    },
    deleteButton: {
        margin: 0,
    },
});