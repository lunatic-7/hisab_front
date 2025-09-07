import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, parseISO } from 'date-fns';
import * as Animatable from 'react-native-animatable';

export default function HisabCard({ hisab, index, onPress, onDelete }) {
    return (
        <Animatable.View animation="fadeInUp" duration={600} delay={index * 80} useNativeDriver>
            <TouchableOpacity onPress={onPress}>
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.topRow}>
                            <View style={styles.titleContainer}>
                                <Icon
                                    name={hisab.if_online ? "web" : "cash"}
                                    size={18}
                                    color={hisab.if_online ? "#3B82F6" : "#10B981"}
                                    style={styles.icon}
                                />
                                <Text style={styles.itemName} numberOfLines={1}>
                                    {hisab.item}
                                </Text>
                            </View>
                            <Text style={styles.itemPrice}>
                                ₹{parseFloat(hisab.price)}
                            </Text>
                        </View>

                        {hisab.description && (
                            <Text style={styles.description} numberOfLines={2}>
                                {hisab.description}
                            </Text>
                        )}

                        <View style={styles.bottomRow}>
                            <View style={styles.metaContainer}>
                                <Icon name="calendar" size={12} color="#64748B" />
                                <Text style={styles.metaText}>
                                    {format(parseISO(hisab.date), 'dd MMM')}
                                </Text>
                                {hisab.if_online && (
                                    <>
                                        <View style={styles.dotSeparator} />
                                        <Icon name="web" size={12} color="#64748B" />
                                        <Text style={styles.metaText}>
                                            {hisab.platform}
                                        </Text>
                                    </>
                                )}
                            </View>
                            <IconButton
                                icon="trash-can-outline"
                                iconColor="#64748B"
                                size={16}
                                onPress={onDelete}
                                style={styles.deleteButton}
                            />
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginVertical: 4,
        marginHorizontal: 8,
        backgroundColor: '#FFFFFF',
        elevation: 1,
    },
    cardContent: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    icon: {
        marginRight: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1E293B',
        flexShrink: 1,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },
    description: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 8,
        lineHeight: 18,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#64748B',
        marginLeft: 4,
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 6,
    },
    deleteButton: {
        margin: -8,
        marginRight: -8,
    },
});