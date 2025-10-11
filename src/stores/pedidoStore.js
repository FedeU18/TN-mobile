import { create } from "zustand";
import {
    getPedidosDisponibles,
    asignarPedido,
    getMisPedidos,
    getPedidoDetalle,
    actualizarEstadoPedido
} from "../utils/pedidoService";

const usePedidoStore = create((set, get) => ({
    pedidosDisponibles: [],
    misPedidos: [],
    loading: false,
    error: null,

    //Obtener pedidos disponibles
    fetchPedidosDisponibles: async () => {
        set({ loading: true, error: null });
        try {
            const pedidos = await getPedidosDisponibles();
            set({ pedidosDisponibles: pedidos, loading: false });
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
                pedido => pedido.id_pedido !== pedidoId
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

            const { misPedidos, pedidoSeleccionado } = get();

            //Actualizar localmente en misPedidos
            const misPedidosActualizados = misPedidos.map(pedido =>
                pedido.id_pedido === pedidoId
                    ? { ...pedido, estado: { nombre_estado: nuevoEstado } }
                    : pedido
            );

            //También actualizar pedidoSeleccionado si coincide
            const pedidoSeleccionadoActualizado = pedidoSeleccionado?.id_pedido === pedidoId
                ? { ...pedidoSeleccionado, estado: { nombre_estado: nuevoEstado } }
                : pedidoSeleccionado;

            set({
                misPedidos: misPedidosActualizados,
                pedidoSeleccionado: pedidoSeleccionadoActualizado,
                loading: false
            });

            return pedidoActualizado;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    //Actualizar estado
    actualizarEstado: async (pedidoId, nuevoEstado) => {
        const { cambiarEstadoPedido } = get();
        return await cambiarEstadoPedido(pedidoId, nuevoEstado);
    },

    //Limpiar pedido seleccionado
    clearPedidoSeleccionado: () => set({ pedidoSeleccionado: null }),

    //Limpiar errores
    clearError: () => set({ error: null }),
}));

export default usePedidoStore;