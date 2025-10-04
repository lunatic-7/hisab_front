import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import PersonHisabScreen from './screens/PersonHisabScreen';
import AddHisabScreen from './screens/AddHisabScreen';
import ViewHisabsScreen from './screens/ViewHisabsScreen';

const Stack = createNativeStackNavigator();

// 🎨 Premium Black & White Theme (inspired by modern dark UI)
const theme = {
  ...PaperDarkTheme,
  roundness: 16,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#FFFFFF',        // Pure white for primary elements
    accent: '#FFFFFF',         // White accent
    background: '#000000',     // Pure black background
    surface: '#1A1A1A',        // Dark gray for cards
    surfaceVariant: '#2A2A2A', // Lighter surface
    text: '#FFFFFF',           // White text
    onSurface: '#FFFFFF',      // White on surface
    onSurfaceVariant: '#AAAAAA', // Gray for secondary text
    placeholder: '#666666',    // Dark gray placeholders
    backdrop: '#00000099',     // Semi-transparent backdrop
    outline: '#333333',        // Subtle borders
    outlineVariant: '#2A2A2A', // Even subtler borders
    inverseSurface: '#FFFFFF', // White for special elements
    inverseOnSurface: '#000000', // Black text on white
    error: '#CF6679',          // Soft red for errors
    success: '#03daa1ff',        // Green for success
    warning: '#FFB300',        // Amber for warnings
    info: '#2196F3',           // Blue for informational text
    elevation: {
      level0: '#000000',
      level1: '#1A1A1A',
      level2: '#202020',
      level3: '#252525',
      level4: '#2A2A2A',
      level5: '#2F2F2F',
    },
  },
};

// 🚀 Smooth minimal animations
const openConfig = {
  animation: 'spring',
  config: {
    stiffness: 800,
    damping: 40,
    mass: 1,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 250,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
};

// ✨ Minimal Screen Options
const screenOptions = {
  headerStyle: {
    backgroundColor: '#000000',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: '600',
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerBackTitleVisible: false,
  headerBackImage: () => (
    <Icon name="chevron-left" size={28} color="#FFFFFF" style={{ marginLeft: 8 }} />
  ),
  cardStyle: {
    backgroundColor: '#000000',
  },
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: openConfig,
    close: closeConfig,
  },
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1, 1],
        }),
      },
    };
  },
};

export default function App() {
  return (
    <PaperProvider
      theme={theme}
      settings={{
        icon: props => <Icon {...props} />,
      }}
    >
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="PersonHisabs"
          screenOptions={{
            headerShown: true,
            ...screenOptions,
          }}
        >
          <Stack.Screen
            name="PersonHisabs"
            component={PersonHisabScreen}
            options={{
              title: 'Hisabs',
              headerLargeTitle: false,
            }}
          />
          <Stack.Screen
            name="ViewHisabs"
            component={ViewHisabsScreen}
            options={({ route }) => ({
              title: `${route.params?.personName || 'User'}`,
            })}
          />
          <Stack.Screen
            name="AddHisab"
            component={AddHisabScreen}
            options={({ route }) => ({
              title: route.params?.mode === 'edit'
                ? 'Edit Hisab'
                : 'New Hisab',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}