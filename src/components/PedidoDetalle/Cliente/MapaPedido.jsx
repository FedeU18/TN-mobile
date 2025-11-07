import React from "react";
import { View, Text } from "react-native";
import MapaCliente from "../../Mapa/Cliente/MapaCliente";
import styles from "./PedidoDetalleClienteStyles";

export default function MapaPedido({ repartidorUbicacion, origen, destino }) {
  if (!repartidorUbicacion && !origen && !destino) {
    return (
      <View style={styles.noMapa}>
        <Text>Mapa no disponible para este pedido.</Text>
      </View>
    );
  }

  return (
    <MapaCliente
      repartidorUbicacion={repartidorUbicacion}
      origenUbicacion={origen}
      destinoUbicacion={destino}
    />
  );
}
