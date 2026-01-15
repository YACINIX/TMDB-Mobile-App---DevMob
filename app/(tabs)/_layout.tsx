import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "Cine Passion",
        tabBarActiveTintColor: "#0B0B0F",
      }}
    >
      <Tabs.Screen
        name="movies"
        options={{
          title: "Films",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tv"
        options={{
          title: "Séries",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="tv-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="watchlist"
        options={{
          title: "À voir",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
