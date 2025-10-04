import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PersonPicker({ persons, selectedValue, onValueChange }) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {/* Label */}
            <View style={styles.labelContainer}>
                <View style={[styles.iconBadge, { backgroundColor: colors.surfaceVariant }]}>
                    <Icon name="account" size={16} color={colors.onSurface} />
                </View>
                <Text style={[styles.label, { color: colors.onSurface}]}>
                    Person *
                </Text>
            </View>

            {/* Picker */}
            <View
                style={[
                    styles.pickerContainer,
                    {
                        borderColor: colors.outline,
                        backgroundColor: colors.surface,
                    },
                ]}
            >
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={[styles.picker, { color: colors.onSurface}]}
                    dropdownIconColor={colors.onSurface}
                >
                    {persons.map((p) => (
                        <Picker.Item
                            key={p.id}
                            label={p.name}
                            value={p.id}
                            color={colors.onSurface}
                        />
                    ))}
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
        height: 50,
    },
});
