import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  refreshButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  estadoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  clienteNombre: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  clienteInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  direccionContainer: {
    marginBottom: 10,
  },
  direccionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  direccionText: {
    fontSize: 16,
    color: '#666',
    paddingLeft: 20,
  },
  fechaCreacion: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  qrCodigo: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  botonesContainer: {
    margin: 15,
  },
  botonEstado: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonEnCamino: {
    backgroundColor: '#FF9500',
  },
  botonEntregado: {
    backgroundColor: '#28a745',
  },
  botonEstadoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  estadoCompletado: {
    margin: 15,
    padding: 20,
    backgroundColor: '#d4edda',
    borderRadius: 10,
    alignItems: 'center',
  },
  estadoCompletadoText: {
    fontSize: 18,
    color: '#155724',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  estadoCompletadoSubtext: {
    fontSize: 14,
    color: '#155724',
    opacity: 0.8,
  },
  estadoActualContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  estadoActualLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
    marginBottom: 4,
  },
  estadoActualText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonEstadoSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  estadisticaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  estadisticaLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  estadisticaValor: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  progresoContainer: {
    marginTop: 16,
  },
  progresoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  progresoBarra: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progresoRelleno: {
    height: '100%',
    borderRadius: 4,
  },
  progresoEtapas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  etapa: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monitoreoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  monitoreoButtonActivo: {
    backgroundColor: '#d1ecf1',
    borderColor: '#bee5eb',
  },
  monitoreoButtonText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  monitoreoButtonTextActivo: {
    color: '#0c5460',
  },
  monitoreoIndicador: {
    backgroundColor: '#d1ecf1',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#17a2b8',
  },
  monitoreoTexto: {
    fontSize: 12,
    color: '#0c5460',
    fontWeight: '500',
  },
  ultimaActualizacionTexto: {
    fontSize: 10,
    color: '#0c5460',
    opacity: 0.8,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});