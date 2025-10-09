import { create } from "zustand";
import {
    getPedidosDisponibles,
    asignarPedido,
    getMisPedidos,
    getPedidoDetalle,
    actualizarEstadoPedido
} from "../utils/pedidoService";

const usePedidoStore = create((set, get) => ({
    getPedidosDisponibles: [],
    misPedidos: [],
    loading: false,
    error: null,

    //Obtener pedidos disponibles
    fetchPedidosDisponibles: async () => {
        set({ loading: true, error: null });
        try {
            const pedidos = await getPedidosDisponibles();
            set({ getPedidosDisponibles: pedidos, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    //Tomar un pedido
    tomarPedido: async (pedidoId) => {
        set({ loading: true, error: null });
        try {
            const pedidoAsignado = await asignarPedido(pedidoId);

            // Actualizar listas localmente
            const { pedidosDisponibles, misPedidos } = get();

            //Remover de pedidos disponibles
            const nuevosDisponibles = pedidosDisponibles.filter(
                pedido => pedido.id !== pedidoId
            );

            //Agregar a pedidos del repartidor
            const nuevosMisPedidos = [...misPedidos, pedidoAsignado];

            set({
                pedidosDisponibles: nuevosDisponibles,
                misPedidos: nuevosMisPedidos,
                loading: false
            });

            return pedidoAsignado;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    //Obtener mis pedidos asignados
    fetchMisPedidos: async () => {
        set({ loading: true, error: null });
        try {
            const pedidos = await getMisPedidos();
            set({ misPedidos: pedidos, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    //Obtener detalle de un pedido
    fetchPedidoDetalle: async (pedidoId) => {
        set({ loading: true, error: null });
        try {
            const pedido = await getPedidoDetalle(pedidoId);
            set({ pedidoSeleccionado: pedido, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    //Actualizar estado de un pedido
    cambiarEstadoPedido: async (pedidoId, nuevoEstado) => {
        set({ loading: true, error: null });
        try {
            const pedidoActualizado = await actualizarEstadoPedido(pedidoId, nuevoEstado);

            const { misPedidos } = get();

            //Actualizar localmente
            const misPedidosActualizados = misPedidos.map(pedido =>
                pedido.id === pedidoId
                    ? { ...pedido, estado: { nombre_estado: nuevoEstado } }
                    : pedido
            );

            set({
                misPedidos: misPedidosActualizados,
                loading: false
            });

            return pedidoActualizado;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    //Limpiar pedido seleccionado
    clearPedidoSeleccionado: () => set({ pedidoSeleccionado: null }),

    //Limpiar errores
    clearError: () => set({ error: null }),
}));

export default usePedidoStore;