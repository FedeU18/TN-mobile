import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

export default function MapaRepartidor({ latitud, longitud }) {
  if (!latitud || !longitud) return null;

  return (
    <View style={styles.mapContainer}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera
          zoomLevel={15}
          centerCoordinate={[longitud, latitud]}
        />
        <MapboxGL.PointAnnotation
          id="repartidor"
          coordinate={[longitud, latitud]}
        />
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
