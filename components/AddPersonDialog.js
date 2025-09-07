import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Text, TextInput, Button } from 'react-native-paper';

export default function AddPersonDialog({ visible, onDismiss, newPerson, setNewPerson, onAddPerson }) {
    return (
        <Dialog
            visible={visible}
            onDismiss={onDismiss}
            style={styles.dialog}
        >
            <View style={styles.dialogContent}>
                <Dialog.Title style={styles.dialogTitle}>➕ Add New Person</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Person's Name"
                        value={newPerson}
                        onChangeText={setNewPerson}
                        mode="outlined"
                        outlineColor="#6C63FF"
                        activeOutlineColor="#6C63FF"
                        style={styles.input}
                        theme={{ colors: { text: 'white', placeholder: '#AAA' } }}
                        left={<TextInput.Icon icon="account" color="#6C63FF" />}
                        autoFocus
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button
                        onPress={onDismiss}
                        textColor="#AAA"
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={onAddPerson}
                        textColor="#6C63FF"
                        labelStyle={{ fontWeight: 'bold' }}
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
        backgroundColor: '#1E1E1E',
    },
    dialogContent: {
        backgroundColor: '#1E1E1E',
        padding: 8,
    },
    dialogTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#1E1E1E',
        marginTop: 8,
    },
});