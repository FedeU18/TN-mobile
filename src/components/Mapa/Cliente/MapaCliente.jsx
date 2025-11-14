import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import polyline from "@mapbox/polyline";
import styles from "../MapaStyles";
import PulsingDot from "../PulsingDot";

export default function MapaCliente({
  repartidorUbicacion,
  origenUbicacion,
  destinoUbicacion,
  estadoPedido, // IMPORTANTE: lo mismo que recibe MapaRepartidor
}) {
  const [rutaCoords, setRutaCoords] = useState(null);

  const API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;

  const obtenerRuta = async (inicio, fin) => {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: [
              [inicio.longitud, inicio.latitud],
              [fin.longitud, fin.latitud],
            ],
          }),
        }
      );

      const data = await response.json();

      const encoded = data.routes[0].geometry;
      const decodedCoords = polyline.decode(encoded).map((p) => ({
        latitude: p[0],
        longitude: p[1],
      }));

      setRutaCoords(decodedCoords);
    } catch (e) {
      console.error("Error obteniendo ruta ORS CLIENTE:", e);
    }
  };

  // --- ELEGIR RUTA SEGÚN EL ESTADO DEL PEDIDO ---
  useEffect(() => {
    if (!repartidorUbicacion) return;

    if (estadoPedido === "Asignado" && origenUbicacion) {
      obtenerRuta(repartidorUbicacion, origenUbicacion);
    } else if (estadoPedido === "En camino" && destinoUbicacion) {
      obtenerRuta(repartidorUbicacion, destinoUbicacion);
    } else {
      setRutaCoords(null);
    }
  }, [estadoPedido, repartidorUbicacion, origenUbicacion, destinoUbicacion]);

  if (!repartidorUbicacion && !origenUbicacion && !destinoUbicacion) {
    return (
      <View style={styles.mapaContainer}>
        <Text>Mapa no disponible para este pedido.</Text>
      </View>
    );
  }

  // UTILIDAD
  const toNumberCoord = (coord) => ({
    latitude: Number(coord?.latitud ?? coord?.lat),
    longitude: Number(coord?.longitud ?? coord?.lng),
  });

  const puntoInicial =
    repartidorUbicacion || origenUbicacion || destinoUbicacion;

  const initialRegion = {
    latitude: Number(puntoInicial.latitud),
    longitude: Number(puntoInicial.longitud),
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={styles.mapaContainer}>
      <MapView style={styles.mapa} initialRegion={initialRegion}>
        {/* Ruta */}
        {rutaCoords && (
          <Polyline
            coordinates={rutaCoords}
            strokeWidth={4}
            strokeColor="#FF6600"
          />
        )}

        {/* Origen */}
        {origenUbicacion && (
          <Marker
            coordinate={toNumberCoord(origenUbicacion)}
            title="Origen"
            pinColor="green"
          />
        )}

        {/* Destino */}
        {destinoUbicacion && (
          <Marker
            coordinate={toNumberCoord(destinoUbicacion)}
            title="Destino"
            pinColor="blue"
          />
        )}

        {/* Repartidor */}
        {repartidorUbicacion && (
          <Marker
            coordinate={toNumberCoord(repartidorUbicacion)}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <PulsingDot color="red" size={15} />
          </Marker>
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
