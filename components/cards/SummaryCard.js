// components/SummaryCard.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

export default function SummaryCard({ personName, totalAmount, onPDFPress, subtitle = 'Total Amount' }) {
    const theme = useTheme();

    return (
        <Animatable.View animation="fadeInDown" duration={600} useNativeDriver>
            <Card
                style={[
                    styles.summaryCard,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
                ]}
            >
                <Card.Content style={styles.summaryContent}>
                    <View style={styles.summaryHeader}>
                        <Text style={[styles.personName, { color: theme.colors.onSurfaceVariant }]}>
                            {personName} ka hisab
                        </Text>
                        <IconButton
                            icon="file-pdf-box"
                            iconColor={theme.colors.error}
                            size={24}
                            onPress={onPDFPress}
                            style={styles.pdfButton}
                        />
                    </View>
                    <View style={styles.totalContainer}>
                        <Text style={[styles.totalLabel, { color: theme.colors.onSurfaceVariant }]}>
                            {subtitle}
                        </Text>
                        <Text style={[styles.totalAmount, { color: theme.colors.text }]}>
                            ₹{totalAmount}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    summaryCard: {
        borderRadius: 16,
        marginBottom: 16,
        elevation: 0,
        borderWidth: 1,
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
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.2,
        marginBottom: 8,
    },
    pdfButton: {
        margin: 0,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '500',
    },
    totalAmount: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
});
