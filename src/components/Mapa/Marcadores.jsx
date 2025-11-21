import React from "react";
import { View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// Marcador para el Origen (local/comercio)
export function MarcadorOrigen() {
  return (
    <View
      style={{
        width: 32,
        height: 32,
        backgroundColor: "#22c55e",
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons name="store" size={16} color="#fff" />
    </View>
  );
}

// Marcador para el Destino (casa)
export function MarcadorDestino() {
  return (
    <View
      style={{
        width: 32,
        height: 32,
        backgroundColor: "#3b82f6",
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons name="home" size={16} color="#fff" />
    </View>
  );
}

// Marcador para el Repartidor (moto/bike)
export function MarcadorRepartidor() {
  return (
    <View
      style={{
        width: 32,
        height: 32,
        backgroundColor: "#ef4444",
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons name="bike" size={16} color="#fff" />
    </View>
  );
}
