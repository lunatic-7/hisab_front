import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export default function SubmitButton({ loading, disabled, editingMode, onPress }) {
    const theme = useTheme(); // ✅ access theme colors

    return (
        <Button
            mode="contained"
            onPress={onPress}
            disabled={disabled}
            loading={loading}
            style={[
                styles.submitButton,
                {
                    backgroundColor: disabled ? theme.colors.outline : theme.colors.primary,
                    borderColor: theme.colors.outline,
                },
            ]}
            labelStyle={[
                styles.buttonLabel,
                { color: disabled ? theme.colors.onSurfaceVariant : theme.colors.background },
            ]}
            contentStyle={styles.buttonContent}
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
        borderRadius: 12,
        elevation: 0,
        shadowOpacity: 0,
        borderWidth: 1,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.3,
    },
});
