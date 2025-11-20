import api from './api';

/**
 * Obtiene los datos del perfil del usuario autenticado
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw error;
  }
};

/**
 * Actualiza el perfil del usuario autenticado
 * @param {Object} profileData - Objeto con los campos a actualizar
 * @param {string} profileData.nombre - Nombre del usuario
 * @param {string} profileData.apellido - Apellido del usuario
 * @param {string} profileData.email - Email del usuario
 * @param {string} profileData.telefono - Teléfono del usuario
 * @param {string} profileData.foto_perfil - URL o base64 de la foto de perfil
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/me', profileData);
    return response.data;
  } catch (error) {
    console.error('userService.updateProfile - Error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export default {
  getProfile,
  updateProfile,
};
