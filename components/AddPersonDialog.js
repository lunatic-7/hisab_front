import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, TextInput, Button, useTheme } from 'react-native-paper';

export default function AddPersonDialog({
    visible,
    onDismiss,
    newPerson,
    setNewPerson,
    onAddPerson,
}) {
    const theme = useTheme();

    return (
        <Dialog
            visible={visible}
            onDismiss={onDismiss}
            style={[styles.dialog, {
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.outline,
            }]}
        >
            <View style={styles.dialogContent}>
                <Dialog.Title style={[styles.dialogTitle, { color: theme.colors.text }]}>
                    Add New Person
                </Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Person's Name"
                        value={newPerson}
                        onChangeText={setNewPerson}
                        mode="outlined"
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        style={[styles.input, { backgroundColor: theme.colors.background }]}
                        textColor={theme.colors.text}
                        theme={{
                            colors: {
                                text: theme.colors.text,
                                placeholder: theme.colors.placeholder,
                                onSurfaceVariant: theme.colors.placeholder,
                            },
                        }}
                        left={<TextInput.Icon icon="account" color={theme.colors.onSurfaceVariant} />}
                        autoFocus
                    />
                </Dialog.Content>
                <Dialog.Actions style={styles.actions}>
                    <Button
                        onPress={onDismiss}
                        textColor={theme.colors.onSurfaceVariant}
                        style={styles.cancelButton}
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={onAddPerson}
                        mode="contained"
                        buttonColor={theme.colors.primary}
                        textColor="#000000"
                        labelStyle={styles.addButtonLabel}
                        style={styles.addButton}
                    >
                        Add Person
                    </Button>
                </Dialog.Actions>
            </View>
        </Dialog>
    );
}

const styles = StyleSheet.create({
    dialog: {
        borderRadius: 16,
        marginHorizontal: 20,
    },
    dialogContent: {
        paddingHorizontal: 4,
        paddingVertical: 8,
    },
    dialogTitle: {
        fontWeight: '600',
        fontSize: 20,
    },
    input: {
        marginTop: 8,
    },
    actions: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
    },
    cancelButton: {
        borderRadius: 8,
    },
    addButton: {
        borderRadius: 8,
        elevation: 0,
    },
    addButtonLabel: {
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});