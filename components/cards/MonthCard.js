import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text, Divider, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

export default function MonthCard({ month, onPress }) {
    const theme = useTheme();

    return (
        <Animatable.View animation="fadeInUp" duration={800} useNativeDriver>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <Card
                    style={[
                        styles.monthCard,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                        },
                    ]}
                >
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.monthHeader}>
                            <Text style={[styles.monthName, { color: theme.colors.text }]}>
                                {month.monthName}
                            </Text>
                            <View
                                style={[
                                    styles.chevronContainer,
                                    { backgroundColor: theme.colors.surfaceVariant },
                                ]}
                            >
                                <Icon name="chevron-right" size={20} color={theme.colors.primary} />
                            </View>
                        </View>

                        <Divider
                            style={[
                                styles.divider,
                                { backgroundColor: theme.colors.outline },
                            ]}
                        />

                        <View style={styles.monthStats}>
                            <View style={styles.statItem}>
                                <Icon name="receipt" size={16} color={theme.colors.placeholder} />
                                <Text style={[styles.statText, { color: theme.colors.placeholder }]}>
                                    {month.count} transactions
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={[styles.totalAmount, { color: theme.colors.text }]}>
                                    ₹{month.total}
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    monthCard: {
        marginVertical: 6,
        marginHorizontal: 16,
        borderRadius: 16,
        elevation: 0,
        borderWidth: 1,
    },
    cardContent: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    monthName: {
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    chevronContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 14,
        marginLeft: 6,
        fontWeight: '500',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    divider: {
        marginVertical: 12,
        height: 1,
    },
});
