import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { BibleSearchScreen } from '@/screens/BibleSearchScreen';
import { colors, typography } from '@/constants/theme';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.backgroundDark,
    card: colors.surfaceDark,
    text: colors.textPrimaryDark,
    border: colors.borderDark,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surfaceDark },
          headerTintColor: colors.textPrimaryDark,
          headerTitleStyle: { fontWeight: typography.fontWeight.bold },
          contentStyle: { backgroundColor: colors.backgroundDark },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="BibleSearch"
          component={BibleSearchScreen}
          options={{ title: 'Buscar na Bíblia' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
