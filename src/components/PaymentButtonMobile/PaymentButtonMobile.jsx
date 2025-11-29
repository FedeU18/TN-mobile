import React, { useState } from "react";
import { TouchableOpacity, Text, Alert, ActivityIndicator, View } from "react-native";
import { crearPreferenciaPagoMobile, abrirCheckoutMercadoPago } from "../../services/pagosService";
import styles from "./PaymentButtonMobile.styles";

export default function PaymentButtonMobile({ id_pedido, estado_pago, estado_pedido, monto }) {
  const [loading, setLoading] = useState(false);

  // Solo mostrar botón si el pedido está en "No pagado"
  const mostrarBoton = estado_pedido === "No pagado";

  const handlePagar = async () => {
    if (!mostrarBoton) return;

    try {
      setLoading(true);

      // Crear preferencia en Mercado Pago
      const { init_point } = await crearPreferenciaPagoMobile(id_pedido);

      // Abrir checkout en navegador
      await abrirCheckoutMercadoPago(init_point, id_pedido);

      // Notificar al usuario
      Alert.alert(
        "Pago iniciado",
        "Se abrirá Mercado Pago en el navegador. Completa el pago y vuelve a la app.",
        [{ text: "OK" }]
      );
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Error al iniciar pago",
        [{ text: "OK" }]
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!mostrarBoton) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePagar}
        disabled={loading}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pagar con Mercado Pago</Text>
        )}
      </TouchableOpacity>

      {monto && (
        <Text style={styles.amount}>
          Monto a pagar: <Text style={styles.amountBold}>${parseFloat(monto).toFixed(2)}</Text>
        </Text>
      )}
    </View>
  );
}
