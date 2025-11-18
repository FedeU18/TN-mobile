/**
 * Paleta de Colores - TrackNow
 * 
 * ESTRUCTURA:
 * - Colores Primarios: Azul
 * - Colores de Éxito: Verde
 * - Colores de Alerta: Naranja para pedidos en tránsito
 * - Colores de Error: Rojo para problemas y alertas
 * - Colores Neutros: Grises para información secundaria
 * - Estados de Pedido: Colores específicos para cada estado
 * 
 * USO:
 * import COLORS from '../../utils/colors';
 * backgroundColor: COLORS.primary       // #0066CC
 * backgroundColor: COLORS.success       // #10B981
 * backgroundColor: COLORS.status.pending // #FBBF24
 */

export const COLORS = {
  // ================== COLORES PRIMARIOS ==================
  primary: "#0066CC",      // Azul principal - botones, links
  primaryDark: "#0052A3",  // Azul oscuro - estados focus/hover
  primaryLight: "#E6F0FF", // Azul claro - fondos sutiles

  // ================== COLORES DE ÉXITO ==================
  success: "#10B981",      // Verde - entregas completadas, éxito
  successDark: "#059669",  // Verde oscuro - énfasis y hover
  successLight: "#D1FAE5", // Verde claro - fondos positivos

  // ================== COLORES DE ALERTA/URGENCIA ==================
  warning: "#F97316",      // Naranja - en tránsito, repartidores, acción
  warningDark: "#EA580C",  // Naranja oscuro - énfasis e intensidad
  warningLight: "#FED7AA", // Naranja claro - fondos suaves

  // ================== COLORES DE ERROR ==================
  error: "#EF4444",        // Rojo - errores, alertas, problemas
  errorDark: "#DC2626",    // Rojo oscuro - énfasis crítico
  errorLight: "#FEE2E2",   // Rojo claro - fondos de alerta

  // ================== COLORES DE INFORMACIÓN ==================
  info: "#6B7280",         // Gris - información neutra
  infoDark: "#4B5563",     // Gris oscuro - textos secundarios
  infoLight: "#F3F4F6",    // Gris claro - fondos neutros

  // ================== COLORES NEUTROS ==================
  white: "#FFFFFF",        // Blanco puro - fondos principales
  black: "#000000",        // Negro puro - textos oscuros

  // ================== ESCALA DE GRISES (10 NIVELES) ==================
  gray: {
    50: "#F9FAFB",   // Fondo muy claro
    100: "#F3F4F6",  // Fondo principal de la app
    200: "#E5E7EB",  // Fondo secundario
    300: "#D1D5DB",  // Bordes sutiles
    400: "#9CA3AF",  // Textos deshabilitados
    500: "#6B7280",  // Información media
    600: "#4B5563",  // Textos secundarios
    700: "#374151",  // Textos más oscuros
    800: "#1F2937",  // Textos principales
    900: "#111827",  // Muy oscuro (casi negro)
  },

  // ================== ESTADOS DE PEDIDO ==================
  status: {
    pending: "#FBBF24",     // Amarillo - pendiente (requiere atención)
    inTransit: "#F97316",   // Naranja - en tránsito (movimiento activo)
    delivered: "#10B981",   // Verde - entregado (completado)
    cancelled: "#EF4444",   // Rojo - cancelado (problema)
    assigned: "#0066CC",    // Azul - asignado (confirmado)
  },

  // ================== COMPATIBILIDAD ==================
  // Mantiene colores antiguos por si se necesita transición
  legacy: {
    blue: "#0950C3",        // Azul antiguo
    green: "#1D6325",       // Verde antiguo
    red: "#ef4444",         // Rojo antiguo
    darkGray: "#1f2937",    // Gris oscuro antiguo
    lightGray: "#f3f4f6",   // Gris claro antiguo
    borderGray: "#d1d5db",  // Gris de bordes antiguo
    textGray: "#666",       // Gris de texto antiguo
  }
};

export default COLORS;