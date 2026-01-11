import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{
        headerShown: false, // 👈 oculta la barra superior en TODAS las pantallas
      }} />;
}
