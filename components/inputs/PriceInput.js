import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

export default function PriceInput({ value, onChangeText }) {
    const theme = useTheme();

    return (
        <TextInput
            label="Price *"
            value={value}
            mode="outlined"
            keyboardType="numeric"
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
            left={<TextInput.Icon icon="currency-inr" color="#FFFFFF" />}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        marginVertical: 3,
    }
});
