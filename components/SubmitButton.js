import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function SubmitButton({ loading, disabled, editingMode, onPress }) {
    return (
        <Button
            mode="contained"
            onPress={onPress}
            disabled={disabled}
            loading={loading}
            style={styles.submitButton}
            labelStyle={styles.buttonLabel}
            icon={editingMode ? 'pencil' : 'check-circle'}
        >
            {loading
                ? editingMode
                    ? 'Updating...'
                    : 'Adding...'
                : editingMode
                    ? 'Update Hisab'
                    : 'Add Hisab'}
        </Button>
    );
}

const styles = StyleSheet.create({
    submitButton: {
        width: '100%',
        backgroundColor: '#6C63FF',
        borderRadius: 8,
        paddingVertical: 6,
    },
    buttonLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});