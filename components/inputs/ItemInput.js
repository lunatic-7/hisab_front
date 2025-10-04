import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

export default function ItemInput({ value, onChangeText }) {
    const theme = useTheme();

    return (
        <TextInput
            label="Item *"
            value={value}
            mode="outlined"
            onChangeText={onChangeText}
            style={[styles.input, { backgroundColor: theme.colors.background }]}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.text}
            theme={{
                colors: {
                    text: theme.colors.text,
                    placeholder: theme.colors.placeholder,
                    onSurfaceVariant: theme.colors.placeholder,
                },
            }}
            left={<TextInput.Icon icon="shopping" color="#FFFFFF" />}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        marginVertical: 3,
    },
});
