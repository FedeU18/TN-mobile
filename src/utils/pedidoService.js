import api from './api';

export const getPedidosDisponibles = async () => {
    try {
        const response = await api.get('/pedidos/disponibles');
        return response.data;
    } catch (error) {
        console.error('Error al obtener pedidos disponibles:', error);
        throw error;
    }
};

export const asignarPedido = async (pedidoId) => {
    try {
        const response = await api.put(`/pedidos/asignar/${pedidoId}`);
        return response.data;
    } catch (error) {
        console.error('Error al asignar pedido:', error);
        throw error;
    }
};

export const getMisPedidos = async () => {
    try {
        const response = await api.get('/pedidos/mis-pedidos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener mis pedidos:', error);
        throw error;
    }
};

export const getPedidoDetalle = async (pedidoId) => {
    try {
        const response = await api.get(`/pedidos/${pedidoId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalle del pedido:', error);
        throw error;
    }
};

export const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
        const response = await api.put(`/pedidos/${pedidoId}/estado/`, { estado: nuevoEstado });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        throw error;
    }
}; 