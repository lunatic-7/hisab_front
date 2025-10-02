import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

export default function DescriptionInput({ value, onChangeText }) {
    const theme = useTheme();

    return (
        <TextInput
            label="Description"
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
            left={<TextInput.Icon icon="text" color={theme.colors.onSurfaceVariant} />}
            multiline
            numberOfLines={3}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        marginVertical: 3,
    },
});