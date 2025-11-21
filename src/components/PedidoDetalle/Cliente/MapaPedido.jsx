import React from "react";
import { View, Text } from "react-native";
import MapaCliente from "../../Mapa/Cliente/MapaCliente";
import styles from "./PedidoDetalleClienteStyles";

export default function MapaPedido({
  repartidorUbicacion,
  origen,
  destino,
  estadoPedido, // ← AGREGADO
}) {
  // No mostrar mapa si el pedido está cancelado o entregado
  if (estadoPedido === "Cancelado" || estadoPedido === "Entregado") {
    return null;
  }

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
      estadoPedido={estadoPedido} // ← PASADO AL MAPA CLIENTE
    />
  );
}
