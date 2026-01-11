import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
type Props = {
  id: string;
  nombre: string;
  precio: number;
  porKilo: boolean;
};
export default function ProductoItem({ id, nombre, precio, porKilo }: Props) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/${id}`)}
      style={({ pressed }) => ({
        padding: 25,
        paddingHorizontal: 15,
        marginTop: 7,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems:"center",
        gap:15,
        borderRadius: 8,
        backgroundColor: pressed ? "#222003" : "transparent", // 👈 efecto touch
      })}
    >
      <View style={{flex:1,flexDirection: "row",
        justifyContent: "space-between",alignItems:"center"}}>
        <Text style={{ fontSize: 18, color: "#fffba6" }}>{nombre}</Text>
        <Text style={{ fontSize: 15, color: "#fffba6" }}>
          ${precio} {porKilo ? "/kg" : "c/u"}
        </Text>
      </View>
      <View style={{alignItems:"center"}}><Ionicons name="chevron-forward" size={20} color="#fffba6" /></View>
    </Pressable>
  );
}
