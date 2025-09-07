import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePicker({ date, onDateChange }) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.container}>
                <Text style={styles.dateText}>
                    <Icon name="calendar" size={16} color="#AAA" /> Date: {format(new Date(date), 'dd MMM yyyy')}
                </Text>
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
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    dateText: {
        color: '#AAA',
        fontSize: 14,
        textAlign: 'center',
    },
});