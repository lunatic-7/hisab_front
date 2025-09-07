import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function DescriptionInput({ value, onChangeText }) {
    return (
        <TextInput
            label="Description"
            value={value}
            mode="outlined"
            onChangeText={onChangeText}
            style={styles.input}
            theme={inputTheme}
            left={<TextInput.Icon icon="text" color="#6C63FF" />}
            multiline
        />
    );
}

const styles = StyleSheet.create({
    input: {
        marginVertical: 8,
        backgroundColor: '#1E1E1E',
    },
});

const inputTheme = {
    colors: {
        text: 'white',
        placeholder: '#AAA',
        primary: '#6C63FF',
        background: 'transparent',
        surface: '#1E1E1E',
    },
};