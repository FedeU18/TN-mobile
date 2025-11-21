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
    pedidoSeleccionado: null,
    pedidoEnSeguimiento: null,
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
            return pedido;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    //Cambiar estado de un pedido
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

            //Actualizar pedidoSeleccionado si es el mismo
            const pedidoSeleccionadoActualizado = pedidoSeleccionado?.id_pedido === pedidoId
                ? { ...pedidoSeleccionado, estado: { nombre_estado: nuevoEstado } }
                : pedidoSeleccionado;

                //Gestionar seguimiento de ubicación
                let pedidoEnSeguimiento = get().pedidoEnSeguimiento;
                if (nuevoEstado === 'En camino') {
                    pedidoEnSeguimiento = pedidoId;
                }else if (nuevoEstado === 'Entregado' && pedidoEnSeguimiento === pedidoId){
                    pedidoEnSeguimiento = null;
                }

            set({
                misPedidos: misPedidosActualizados,
                pedidoSeleccionado: pedidoSeleccionadoActualizado,
                pedidoEnSeguimiento,
                loading: false
            });

            return pedidoActualizado;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    //Establecer pedido en seguimiento
    setPedidoEnSeguimiento: (pedidoId) => {
        set({ pedidoEnSeguimiento: pedidoId });
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