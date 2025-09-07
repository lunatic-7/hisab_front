import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

export default function MonthCard({ month, onPress }) {
    return (
        <Animatable.View animation="fadeInUp" duration={800} useNativeDriver>
            <TouchableOpacity onPress={onPress}>
                <Card style={styles.monthCard}>
                    <Card.Content>
                        <View style={styles.monthHeader}>
                            <Text style={styles.monthName}>{month.monthName}</Text>
                            <Icon name="chevron-right" size={24} color="#6C63FF" />
                        </View>
                        <Divider style={styles.divider} />
                        <View style={styles.monthStats}>
                            <View style={styles.statItem}>
                                <Icon name="receipt" size={16} color="#AAA" />
                                <Text style={styles.statText}>{month.count} transactions</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statText}>₹{month.total}</Text>
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
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: '#1E1E1E',
        elevation: 2,
    },
    monthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    monthName: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
    monthStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        color: '#AAA',
        fontSize: 14,
        marginLeft: 8,
    },
    divider: {
        backgroundColor: '#333',
        marginVertical: 8,
    },
});