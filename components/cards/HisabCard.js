import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, parseISO } from 'date-fns';
import * as Animatable from 'react-native-animatable';

export default function HisabCard({ hisab, index, onPress, onDelete }) {
    const theme = useTheme();

    return (
        <Animatable.View animation="fadeInUp" duration={600} delay={index * 80} useNativeDriver>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <Card
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                        },
                    ]}
                >
                    <Card.Content style={styles.cardContent}>
                        <View style={styles.topRow}>
                            <View style={styles.titleContainer}>
                                <View
                                    style={[
                                        styles.iconBadge,
                                        { backgroundColor: theme.colors.surfaceVariant },
                                    ]}
                                >
                                    <Icon
                                        name={hisab.if_online ? "web" : "cash"}
                                        size={14}
                                        color={hisab.if_online ? theme.colors.warning : theme.colors.success}
                                    />
                                </View>
                                <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={1}>
                                    {hisab.item}
                                </Text>
                            </View>
                            <Text style={[styles.itemPrice, { color: theme.colors.text }]}>
                                ₹{parseFloat(hisab.price)}
                            </Text>
                        </View>

                        {hisab.description && (
                            <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                                {hisab.description}
                            </Text>
                        )}

                        <View style={styles.bottomRow}>
                            <View style={styles.metaContainer}>
                                <Icon name="calendar" size={12} color={theme.colors.placeholder} />
                                <Text style={[styles.metaText, { color: theme.colors.placeholder }]}>
                                    {format(parseISO(hisab.date), 'dd MMM')}
                                </Text>
                                {hisab.if_online && (
                                    <>
                                        <View style={[styles.dotSeparator, { backgroundColor: theme.colors.outline }]} />
                                        <Icon name="web" size={12} color={theme.colors.placeholder} />
                                        <Text style={[styles.metaText, { color: theme.colors.placeholder }]}>
                                            {hisab.platform}
                                        </Text>
                                    </>
                                )}
                            </View>
                            <IconButton
                                icon="trash-can-outline"
                                iconColor={theme.colors.error}
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
        borderRadius: 16,
        marginVertical: 6,
        marginHorizontal: 16,
        elevation: 0,
        borderWidth: 1,
    },
    cardContent: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconBadge: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        flexShrink: 1,
        letterSpacing: 0.2,
    },
    itemPrice: {
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    description: {
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
        marginLeft: 38,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 38,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        marginLeft: 4,
        fontWeight: '500',
    },
    dotSeparator: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        marginHorizontal: 8,
    },
    deleteButton: {
        margin: -8,
        marginRight: -8,
    },
});
