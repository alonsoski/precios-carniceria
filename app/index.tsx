import { Picker } from "@react-native-picker/picker";
import { onValue, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../src/firebase";
import type { Producto } from "../src/models/Producto";
import ProductoItem from "./components/productoItem";
export default function Index() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");

  useEffect(() => {
    const productosRef = ref(db, "/");

    const unsubscribe = onValue(productosRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setProductos([]);
        return;
      }

      const lista: Producto[] = Object.entries(data)
        .filter(([_, v]) => v !== null)
        .map(([key, value]: any) => ({
          id: key,
          ...value,
        }));

      setProductos(lista);
    });

    return () => unsubscribe();
  }, []);

  // 👇 categorías únicas
  const categorias = useMemo(() => {
    const set = new Set<string>();
    productos.forEach(p => p.categoria?.forEach(c => set.add(c)));
    return Array.from(set);
  }, [productos]);

  // 👇 filtro combinado
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const coincideTexto =
        p.nombre.toLowerCase().includes(filtroTexto.toLowerCase());

      const coincideCategoria =
        !filtroCategoria || p.categoria?.includes(filtroCategoria);

      return coincideTexto && coincideCategoria;
    });
  }, [productos, filtroTexto, filtroCategoria]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, paddingTop: 0, backgroundColor: "#0e0e0d" }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 40, fontWeight: "500", color: "#fff" }}>Productos</Text>
        {/* 🔍 Buscador */}
        <TextInput
          placeholder="Buscar producto..."
          placeholderTextColor="#888"
          value={filtroTexto}
          onChangeText={setFiltroTexto}
          style={{
            borderWidth: 1,
            borderColor: "#fff",
            margin: 10,
            padding: 10,
            borderRadius: 8,
            fontSize: 16,
            color: "#f1e83a"

          }}
        />

        {/* 🏷️ Filtro categoría */}
        <View
          style={{
            marginHorizontal: 10,
            borderWidth: 1,
            borderColor: "#fff",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <Picker
            selectedValue={filtroCategoria}
            onValueChange={(value) => setFiltroCategoria(value)}
          >
            <Picker.Item label="Todas las categorías" color="#888" value="" />
            {categorias.map(cat => (
              <Picker.Item key={cat} label={cat} color="#888" value={cat} />
            ))}
          </Picker>
        </View>
      </View>


      {/* 📋 Lista */}
      <View style={{ paddingHorizontal:10 }}>
        <FlatList
          data={productosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductoItem
              id={item.id}
              nombre={item.nombre}
              precio={item.precio}
              porKilo={item.porKilo}
            />
          )}
          style={{ backgroundColor: "#5c5a3c59", borderRadius: 18 }}
        />
      </View>

    </SafeAreaView>
  );
}
