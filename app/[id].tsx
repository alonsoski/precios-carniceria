import { useLocalSearchParams } from "expo-router";
import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../src/firebase";
import { Producto } from "../src/models/Producto";

export default function DetalleProducto() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  const [editando, setEditando] = useState(false);
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  useEffect(() => {
    if (!id) return;

    const productoRef = ref(db, `/${id}`);

    const unsubscribe = onValue(productoRef, (snapshot) => {
      const data = snapshot.val();
      setProducto(data);
      if (data?.precio) {
        setNuevoPrecio(String(data.precio));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const guardarPrecio = async () => {
    if (!id) return;

    const precioNumero = Number(nuevoPrecio);

    if (isNaN(precioNumero)) {
      alert("Precio inválido");
      return;
    }

    const productoRef = ref(db, `/${id}`);

    await update(productoRef, {
      precio: precioNumero,
    });

    setEditando(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!producto) {
    return <Text>Producto no encontrado</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 25, paddingTop: 10, backgroundColor: "#0e0e0d" }}>
      <View style={{backgroundColor: "#5c5a3c59",borderRadius:8, justifyContent:"center",alignItems:"center",paddingTop:10}}>
        <Text style={{ fontSize: 26, fontWeight: "bold", color: "#fffba6" }}>
          {producto.nombre}
        </Text>

        {/* PRECIO */}
        <View style={{ marginVertical: 12, }}>
          {!editando ? (
            <>
              <Text style={{ fontSize: 20, paddingBottom: 15, color: "#fffba6" }}>
                ${producto.precio} {producto.porKilo ? "/kg" : "c/u"}
              </Text>

              <Button title="Cambiar precio" onPress={() => setEditando(true)} />
            </>
          ) : (
            <>
              <TextInput
                value={nuevoPrecio}
                onChangeText={setNuevoPrecio}
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 8,
                  marginBottom: 8,
                  fontSize: 18,
                  color: "#fffba6"
                }}
              />
              <Button title="Guardar" onPress={guardarPrecio} />
              <View style={{ height: 8 }} />
              <Button
                title="Cancelar"
                color="gray"
                onPress={() => {
                  setNuevoPrecio(String(producto.precio));
                  setEditando(false);
                }}
              />
            </>
          )}
        </View>
      </View>


      <Text style={{ marginVertical: 8, color: "#fffba6" }}>
        Categorías: {producto.categoria?.join(", ")}
      </Text>
      <View style={{ flex: 1, backgroundColor: "#5c5a3c59", borderRadius: 8, padding: 20, paddingTop: 0 }}>
        <Text style={{ marginTop: 12, fontSize: 16, color: "#fffba6" }}>
          {producto.descripcion}
        </Text>
      </View>

    </SafeAreaView>
  );
}
