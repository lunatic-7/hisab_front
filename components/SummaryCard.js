// components/SummaryCard.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

export default function SummaryCard({ personName, totalAmount, onPDFPress, subtitle = 'Total Amount' }) {
    return (
        <Animatable.View animation="fadeInDown" duration={600} useNativeDriver>
            <Card style={styles.summaryCard}>
                <Card.Content style={styles.summaryContent}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.personName}>{personName} ka hisab</Text>
                        <IconButton
                            icon="file-pdf-box"
                            iconColor="#FF5252"
                            size={24}
                            onPress={onPDFPress}
                        />
                    </View>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>{subtitle}</Text>
                        <Text style={styles.totalAmount}>₹{totalAmount}</Text>
                    </View>
                </Card.Content>
            </Card>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    summaryCard: {
        borderRadius: 12,
        backgroundColor: '#1E1E1E',
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    summaryContent: {
        padding: 20,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    personName: {
        color: '#AAA',
        fontSize: 16,
        marginBottom: 8,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 18,
        color: '#AAA',
    },
    totalAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6C63FF',
    },
});