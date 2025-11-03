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

export const actualizarEstadoPedido = async (pedidoId, nuevoEstado, qr_token = null) => {
    try {
        const body = { nuevoEstado };
        // Si se proporciona un token QR, se incluye en el body
        if (qr_token) {
            body.qr_token = qr_token;
        }
        const response = await api.put(`/pedidos/estado/${pedidoId}`, body);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        throw error;
    }
};

// --SERVICIOS PARA CLIENTES--
export const getMisPedidosCliente = async () => {
    try {
        console.log('PedidoService - Llamando a /clientes/pedidos');
        // Los clientes usan un endpoint específico para sus pedidos
        const response = await api.get('/clientes/pedidos');
        console.log('PedidoService - Respuesta exitosa:', response.data.length, 'pedidos');
        return response.data;
    } catch (error) {
        console.error('PedidoService - Error al obtener pedidos del cliente:', error.response?.data || error.message);
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

// Servicio específico para que los clientes obtengan detalles de sus pedidos
export const getPedidoDetalleCliente = async (pedidoId) => {
    try {
        const response = await api.get(`/clientes/pedidos/${pedidoId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalle del pedido del cliente:', error);
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

// Calificar al repartidor después de la entrega
export const calificarRepartidor = async (pedidoId, puntuacion, comentario) => {
    try {
        const response = await api.post('/repartidores/calificar', {
            pedidoId,
            puntuacion,
            comentario: comentario || null,
        });
        return response.data;
    } catch (error) {
        console.error('Error al calificar al repartidor:', error);
        throw error;
    }
};

// Validar QR y confirmar entrega del pedido
export const validarQREntrega = async (pedidoId, qr_token) => {
    try {
        // Usa el endpoint existente PUT /pedidos/estado/:id que ya valida el token
        return await actualizarEstadoPedido(pedidoId, 'Entregado', qr_token);
    } catch (error) {
        console.error('Error al validar QR de entrega:', error);
        throw error;
    }
};
