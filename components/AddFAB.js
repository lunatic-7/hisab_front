import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

export default function AddFAB({ icon = "plus", onPress }) {
    const theme = useTheme();

    return (
        <Animatable.View
            animation="fadeIn"
            duration={300}
            style={styles.container}
        >
            <FAB
                icon={icon}
                style={[styles.fab, { 
                    backgroundColor: theme.colors.primary,
                    borderWidth: 0,
                }]}
                onPress={onPress}
                color="#000000"
                customSize={56}
                rippleColor="rgba(0, 0, 0, 0.1)"
            />
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    fab: {
        elevation: 4,
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
});