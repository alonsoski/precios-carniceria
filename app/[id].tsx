import { useLocalSearchParams } from "expo-router";
import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
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
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold" }}>
        {producto.nombre}
      </Text>

      {/* PRECIO */}
      <View style={{ marginVertical: 12 }}>
        {!editando ? (
          <>
            <Text style={{ fontSize: 20, paddingBottom:15 }}>
              ${producto.precio} {producto.porKilo ? "/kg" : "c/u"}
            </Text>
            <Pressable>
              <Text>Cambiar precio</Text>
            </Pressable>
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

      <Text style={{ marginVertical: 8 }}>
        Categorías: {producto.categoria?.join(", ")}
      </Text>

      <Text style={{ marginTop: 12, fontSize: 16 }}>
        {producto.descripcion}
      </Text>
    </View>
  );
}
