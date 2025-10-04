import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PlatformPicker({ selectedValue, onValueChange }) {
    const theme = useTheme(); // ✅ access theme colors

    return (
        <View style={styles.container}>
            <View style={[styles.pickerContainer, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}>
                <Picker
                    selectedValue={selectedValue || 'zomato'}
                    onValueChange={onValueChange}
                    style={[styles.picker, { color: theme.colors.text, backgroundColor: theme.colors.background }]}
                    dropdownIconColor={theme.colors.text}
                >
                    <Picker.Item label="Zomato" value="zomato" color={theme.colors.text} />
                    <Picker.Item label="Swiggy" value="swiggy" color={theme.colors.text} />
                    <Picker.Item label="Amazon" value="amazon" color={theme.colors.text} />
                    <Picker.Item label="Flipkart" value="flipkart" color={theme.colors.text} />
                    <Picker.Item label="Blinkit" value="blinkit" color={theme.colors.text} />
                    <Picker.Item label="Zepto" value="zepto" color={theme.colors.text} />
                    <Picker.Item label="Others" value="others" color={theme.colors.text} />
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconBadge: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',  
        paddingHorizontal: 12,
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
});
