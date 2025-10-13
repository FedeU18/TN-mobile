import api from './api';


// --SERVICIOS PARA REPARTIDORES --
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
        const response = await api.put(`/pedidos/tomar/${pedidoId}`);
        return response.data;
    } catch (error) {
        console.error('Error al tomar pedido:', error);
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

export const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
        const response = await api.put(`/pedidos/estado/${pedidoId}`, { nuevoEstado });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        throw error;
    }
};

// --SERVICIOS PARA CLIENTES--
export const getMisPedidosCliente = async () => {
    try {
        // El backend usa el mismo endpoint pero filtra por rol del usuario
        const response = await api.get('/pedidos/mis-pedidos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener pedidos del cliente:', error);
        throw error;
    }
};

// --SERVICIOS COMUNES--
export const getPedidoDetalle = async (pedidoId) => {
    try {
        const response = await api.get(`/pedidos/${pedidoId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalle del pedido:', error);
        throw error;
    }
};

export const getPedidoConUbicacion = async (pedidoId) => {
    try {
        const response = await api.get(`/pedidos/${pedidoId}/ubicacion`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener ubicación del repartidor:', error);
        throw error;
    }
};

