import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapaRepartidor({ repartidorUbicacion, origenUbicacion, destinoUbicacion }) {
  if (!repartidorUbicacion && !origenUbicacion && !destinoUbicacion) {
    return (
      <View style={styles.mapaContainer}>
        <Text>No hay ubicaciones para mostrar.</Text>
      </View>
    );
  }

  // Centrar el mapa en el origen de la entrega
  let initialRegion = {
    latitude: origenUbicacion.latitud,
    longitude: origenUbicacion.longitud,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
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
            description="Origen del pedido"
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
            title="Dirección de entrega"
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
            description="Repartidor"
            pinColor="red"
          />
        )}
      </MapView>

      {/* Leyenda de colores */}
      <View style={styles.leyendaContainer}>
        <Text style={styles.leyendaItem}><Text style={{ color: 'green', fontWeight: 'bold' }}>●</Text> Origen</Text>
        <Text style={styles.leyendaItem}><Text style={{ color: 'blue', fontWeight: 'bold' }}>●</Text> Destino</Text>
        <Text style={styles.leyendaItem}><Text style={{ color: 'red', fontWeight: 'bold' }}>●</Text> Repartidor</Text>
      </View>
    </View>
  );
}
