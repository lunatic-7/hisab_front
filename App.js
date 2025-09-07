import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Easing } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import PersonHisabScreen from './screens/PersonHisabScreen';
import AddHisabScreen from './screens/AddHisabScreen';
import ViewHisabsScreen from './screens/ViewHisabsScreen';

import { SafeAreaView } from 'react-native';


const Stack = createNativeStackNavigator();

// Custom dark theme with vibrant accents
const theme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6C63FF', // Vibrant purple
    accent: '#FF6584', // Pink accent
    background: '#121212', // Dark background
    surface: '#1E1E1E', // Card surfaces
    text: '#FFFFFF', // White text
    placeholder: '#AAAAAA', // Placeholder text
    backdrop: '#00000090', // Backdrop for modals
    onSurface: '#FFFFFF', // Text on surfaces
    notification: '#FF6584', // Notification color
  },
  animation: {
    scale: 1.0,
  },
};

// Custom transition animation
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 200,
    easing: Easing.linear,
  },
};

const screenOptions = {
  headerStyle: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: theme.colors.primary,
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  headerBackTitleVisible: false,
  headerBackImage: () => (
    <Icon name="chevron-left" size={28} color={theme.colors.primary} />
  ),
  cardStyle: {
    backgroundColor: theme.colors.background,
  },
  cardOverlayEnabled: true,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: config,
    close: closeConfig,
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
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background}}>
          <Stack.Navigator
            initialRouteName="PersonHisabs"
            screenOptions={{
              headerShown: true,
              cardStyle: { backgroundColor: theme.colors.background },
              padding: 10,
              ...screenOptions,
            }}
          >
            <Stack.Screen
              name="PersonHisabs"
              component={PersonHisabScreen}
              options={{
                title: '💰 Hisabs',
                // headerRight: () => (
                //   <Icon
                //     name="finance"
                //     size={24}
                //     color={theme.colors.accent}
                //     style={{ marginRight: 15 }}
                //   />
                // ),
              }}
            />
            <Stack.Screen
              name="ViewHisabs"
              component={ViewHisabsScreen}
              options={({ route }) => ({
                title: `${route.params?.personName || 'User'} ka hisab`,
              })}
            />
            <Stack.Screen
              name="AddHisab"
              component={AddHisabScreen}
              options={({ route }) => ({
                title: route.params?.mode === 'edit'
                  ? 'Edit Hisab'
                  : 'Nya Hisab',
              })}
            />

          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider >
  );
}