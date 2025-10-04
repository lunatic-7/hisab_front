import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Platform, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePicker({ date, onDateChange }) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const theme = useTheme();

    return (
        <>
            <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[styles.container, {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.outline,
                }]}
                activeOpacity={0.7}
            >
                <View style={styles.content}>
                    <Icon name="calendar-month" size={20} color={theme.colors.onSurfaceVariant} />
                    <Text style={[styles.dateText, { color: theme.colors.text }]}>
                        {format(new Date(date), 'dd MMM yyyy')}
                    </Text>
                    <Icon name="chevron-down" size={20} color={theme.colors.onSurfaceVariant} />
                </View>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={new Date(date)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                            onDateChange(selectedDate.toISOString().split('T')[0]);
                        }
                    }}
                    maximumDate={new Date()}
                    themeVariant="dark"
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    dateText: {
        fontSize: 15,
        fontWeight: '500',
    },
});