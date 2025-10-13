import { create } from 'zustand';
import {
    getMisPedidosCliente,
    getPedidoDetalle,
    getPedidoConUbicacion
} from '../utils/pedidoService';

const useClienteStore = create((set, get) => ({
    misPedidos: [],
    pedidoSeleccionado: null,
    ubicacionRepartidor: null,
    loading: false,
    error: null,
    intervaloUbicacion: null,

    // Obtener pedidos
    fetchMisPedidos: async () => {
        set({ loading: true, error: null });
        try {
            const pedidos = await getMisPedidosCliente();
            set({ misPedidos: pedidos, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // Seleccionar un pedido para ver detalles
    seleccionarPedido: (pedido) => {
        set({ pedidoSeleccionado: pedido, ubicacionRepartidor: null });
    },

    // Obtener ubicación del repartidor
    fetchUbicacionRepartidor: async (pedidoId) => {
        try {
            const ubicacion = await getPedidoConUbicacion(pedidoId);
            set({ ubicacionRepartidor: ubicacion });
            return ubicacion;
        } catch (error) {
            console.error('Error al obtener ubicación del repartidor:', error);
            set({ error: error.message });
        }
    },

    // Iniciar seguimiento de ubicación
    iniciarSeguimientoUbicacion: (pedidoId) => {
        const { intervaloUbicacion } = get();

        // Limpiar intervalo previo
        if (intervaloUbicacion) {
            clearInterval(intervaloUbicacion);
        }

        // Obtener ubicación inicial
        get().fetchUbicacionRepartidor(pedidoId);

        // Configurar intervalo para actualizar cada 10 segundos
        const nuevoIntervalo = setInterval(() => {
            get().fetchUbicacionRepartidor(pedidoId);
        }, 10000);

        set({ intervaloUbicacion: nuevoIntervalo });
    },

    // Detener seguimiento de ubicación
    detenerSeguimientoUbicacion: () => {
        const { intervaloUbicacion } = get();
        if (intervaloUbicacion) {
            clearInterval(intervaloUbicacion);
            set({ intervaloUbicacion: null });
        }
    },

    // Limpiar datos
    limpiarSeleccion: () => {
        const { intervaloUbicacion } = get();
        if (intervaloUbicacion) {
            clearInterval(intervaloUbicacion);
        }
        set({
            pedidoSeleccionado: null,
            ubicacionRepartidor: null,
            intervaloUbicacion: null,
        });
    },

    // Limpiar errores
    clearError: () => set({ error: null })
}));

export default useClienteStore;