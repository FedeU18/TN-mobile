import React from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import styles from "../MapaStyles";

export default function MapaCliente({
  repartidorUbicacion,
  origenUbicacion,
  destinoUbicacion,
}) {
  // Si no hay ubicaciones, mostrar mensaje
  if (!repartidorUbicacion && !origenUbicacion && !destinoUbicacion) {
    return (
      <View style={styles.mapaContainer}>
        <Text>Mapa no disponible para este pedido.</Text>
      </View>
    );
  }

  // Determinar punto inicial válido
  const puntoInicial =
    repartidorUbicacion || origenUbicacion || destinoUbicacion;

  const initialRegion = {
    latitude: puntoInicial?.latitud || -34.6037, // fallback Buenos Aires
    longitude: puntoInicial?.longitud || -58.3816,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={styles.mapaContainer}>
      <MapView
        style={styles.mapa}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Origen */}
        {origenUbicacion && (
          <Marker
            coordinate={{
              latitude: origenUbicacion.latitud,
              longitude: origenUbicacion.longitud,
            }}
            title="Origen del pedido"
            description="Punto de retiro"
            pinColor="green"
          />
        )}

        {/* Destino */}
        {destinoUbicacion && (
          <Marker
            coordinate={{
              latitude: destinoUbicacion.latitud,
              longitude: destinoUbicacion.longitud,
            }}
            title="Destino del pedido"
            description="Dirección de entrega"
            pinColor="blue"
          />
        )}

        {/* Repartidor */}
        {repartidorUbicacion && (
          <Marker
            coordinate={{
              latitude: repartidorUbicacion.latitud,
              longitude: repartidorUbicacion.longitud,
            }}
            title="Repartidor"
            description="Ubicación actual del repartidor"
            pinColor="red"
          />
        )}
      </MapView>

      {/* Leyenda */}
      <View style={styles.leyendaContainer}>
        <Text style={styles.leyendaItem}>
          <Text style={{ color: "green", fontWeight: "bold" }}>●</Text> Origen
        </Text>
        <Text style={styles.leyendaItem}>
          <Text style={{ color: "blue", fontWeight: "bold" }}>●</Text> Destino
        </Text>
        <Text style={styles.leyendaItem}>
          <Text style={{ color: "red", fontWeight: "bold" }}>●</Text> Repartidor
        </Text>
      </View>
    </View>
  );
}
