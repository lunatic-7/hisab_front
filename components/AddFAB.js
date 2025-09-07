import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

export default function AddFAB({ icon = "plus", onPress }) {
    return (
        <Animatable.View animation="pulse" easing="ease-out" iterationCount="infinite" duration={2000}>
            <FAB
                icon={icon}
                style={styles.fab}
                onPress={onPress}
                color="white"
                animated
                customSize={60}
                theme={{ colors: { accent: '#6C63FF' } }}
            />
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        backgroundColor: '#6C63FF',
    },
});