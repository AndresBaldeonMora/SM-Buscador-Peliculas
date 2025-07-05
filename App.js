import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import PreferencesScreen from "./src/screens/PreferencesScreen";
import CatalogScreen from "./src/screens/CatalogScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import MovieDetailScreen from "./src/screens/MovieDetailScreen";
import AccountScreen from "./src/screens/AccountScreen";
import { FavoritesProvider } from "./src/context/FavoritesContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "Inicio") {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === "Favoritos") {
            return (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={size}
                color={focused ? "red" : color}
              />
            );
          } else if (route.name === "Cuenta") {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: "#0a84ff",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={CatalogScreen} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} />
      <Tab.Screen name="Cuenta" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <FavoritesProvider>
      <SafeAreaProvider>
        <NavigationContainer
          theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Preferences"
              component={PreferencesScreen}
              options={{ title: "Tus gustos" }}
            />
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MovieDetail"
              component={MovieDetailScreen}
              options={{ title: "Detalle" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </FavoritesProvider>
  );
}
