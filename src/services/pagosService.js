import axios from "axios";
import * as Linking from "expo-linking";
import useAuthStore from "../stores/authStore";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.1.40:3000";

/**
 * Crear preferencia de pago en Mercado Pago
 * Retorna el init_point (URL del checkout)
 */
export const crearPreferenciaPagoMobile = async (id_pedido) => {
  try {
    const token = getToken();

    const response = await axios.post(
      `${BACKEND_URL}/api/pagos/crear-preferencia/${id_pedido}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear preferencia de pago:", error);
    throw error;
  }
};

/**
 * Obtener estado de pago de un pedido
 */
export const obtenerEstadoPagoMobile = async (id_pedido) => {
  try {
    const token = getToken();

    const response = await axios.get(
      `${BACKEND_URL}/api/pagos/estado/${id_pedido}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener estado de pago:", error);
    throw error;
  }
};

/**
 * Abrir navegador para pagar con Mercado Pago
 * @param {string} init_point - URL del checkout de Mercado Pago
 * @param {number} id_pedido - ID del pedido
 * @returns {Promise} - Resultado del pago
 */
export const abrirCheckoutMercadoPago = async (init_point, id_pedido) => {
  try {
    // Abrir URL en navegador externo
    const supported = await Linking.canOpenURL(init_point);

    if (supported) {
      await Linking.openURL(init_point);
    } else {
      throw new Error("No se puede abrir la URL de pago");
    }

    // Retornar success para que la app recargue el estado
    return { status: "success", message: "Checkout abierto en navegador" };
  } catch (error) {
    console.error("Error al abrir checkout:", error);
    throw error;
  }
};

/**
 * Helper para obtener token del almacenamiento
 */
const getToken = () => {
  return useAuthStore.getState().token || "";
};
