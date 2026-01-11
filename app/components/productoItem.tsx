import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";
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
      style={{
        padding: 12,
        paddingLeft:20,
        borderBottomWidth: 1,
        borderColor: "#ddd",
        
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "800" }}>{nombre}</Text>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        ${precio} {porKilo ? "/kg" : "c/u"}
      </Text>
    </Pressable>
  );
}
