import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import polyline from "@mapbox/polyline";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import styles from "../MapaStyles";
import PulsingDot from "../PulsingDot";
import { MarcadorOrigen, MarcadorDestino, MarcadorRepartidor } from "../Marcadores";

export default function MapaRepartidor({
  repartidorUbicacion,
  origenUbicacion,
  destinoUbicacion,
  estadoPedido,
}) {
  const [rutaCoords, setRutaCoords] = useState(null);
  const [infoRuta, setInfoRuta] = useState(null);

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
      const decodedCoords = polyline
        .decode(encoded)
        .map((p) => ({ latitude: p[0], longitude: p[1] }));

      setRutaCoords(decodedCoords);

      const summary = data.routes[0].summary;

      // DISTANCIA RESTANTE + DURACIÓN RESTANTE
      setInfoRuta({
        distanciaRestante: summary.distance,
        duracion: summary.duration,
      });
    } catch (e) {
      console.error("Error obteniendo ruta ORS:", e);
    }
  };

  useEffect(() => {
    if (!repartidorUbicacion) return;

    if (estadoPedido === "Asignado" && origenUbicacion) {
      obtenerRuta(repartidorUbicacion, origenUbicacion);
    } else if (estadoPedido === "En camino" && destinoUbicacion) {
      obtenerRuta(repartidorUbicacion, destinoUbicacion);
    } else {
      setRutaCoords(null);
      setInfoRuta(null);
    }
  }, [estadoPedido, repartidorUbicacion, origenUbicacion, destinoUbicacion]);

  if (!repartidorUbicacion && !origenUbicacion && !destinoUbicacion) {
    return (
      <View style={styles.mapaContainer}>
        <Text>No hay ubicaciones para mostrar.</Text>
      </View>
    );
  }

  const puntoInicial =
    origenUbicacion || destinoUbicacion || repartidorUbicacion;

  const initialRegion = {
    latitude: puntoInicial?.latitud || -34.6037,
    longitude: puntoInicial?.longitud || -58.3816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.mapWrapper}>
      <View style={styles.mapaContainer}>
        {/* PANEL DE DISTANCIA RESTANTE */}
      {infoRuta && (
        <View style={styles.infoRuta}>
          <Text style={styles.infoText}>
            Distancia restante: {(infoRuta.distanciaRestante / 1000).toFixed(1)}{" "}
            km
          </Text>
          <Text style={styles.infoText}>
            Duración: {(infoRuta.duracion / 60).toFixed(0)} min
          </Text>
        </View>
      )}

      <MapView style={styles.mapa} initialRegion={initialRegion}>
        {origenUbicacion && (
          <Marker
            coordinate={{
              latitude: origenUbicacion.latitud,
              longitude: origenUbicacion.longitud,
            }}
            title="Origen"
          >
            <MarcadorOrigen />
          </Marker>
        )}

        {destinoUbicacion && (
          <Marker
            coordinate={{
              latitude: destinoUbicacion.latitud,
              longitude: destinoUbicacion.longitud,
            }}
            title="Destino"
          >
            <MarcadorDestino />
          </Marker>
        )}

        {repartidorUbicacion && (
          <Marker
            coordinate={{
              latitude: Number(repartidorUbicacion.latitud),
              longitude: Number(repartidorUbicacion.longitud),
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <MarcadorRepartidor />
          </Marker>
        )}

        {rutaCoords && (
          <Polyline
            coordinates={rutaCoords}
            strokeWidth={4}
            strokeColor="#FF6600"
          />
        )}
      </MapView>
      </View>

      <View style={styles.leyendaContainer}>
        <View style={styles.leyendaItem}>
          <MaterialCommunityIcons name="store" size={16} color="#22c55e" style={{ marginRight: 6 }} />
          <Text>Origen</Text>
        </View>
        <View style={styles.leyendaItem}>
          <MaterialCommunityIcons name="home" size={16} color="#3b82f6" style={{ marginRight: 6 }} />
          <Text>Destino</Text>
        </View>
        <View style={styles.leyendaItem}>
          <MaterialCommunityIcons name="bike" size={16} color="#ef4444" style={{ marginRight: 6 }} />
          <Text>Repartidor</Text>
        </View>
      </View>
    </View>
  );
}
