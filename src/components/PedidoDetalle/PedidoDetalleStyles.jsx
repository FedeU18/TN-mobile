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