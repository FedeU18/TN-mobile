import { StyleSheet } from 'react-native';
import COLORS from '../../utils/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
  },
  listContainer: {
    padding: 15,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pedidoId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pedidoInfo: {
    marginBottom: 10,
  },
  cliente: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 5,
  },
  repartidor: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.success,
    marginBottom: 5,
  },
  seguimientoIndicador: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  seguimientoTexto: {
    fontSize: 12,
    color: '#155724',
    fontWeight: 'bold',
  },
  direccion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  fecha: {
    fontSize: 12,
    color: '#999',
  },
  verDetalleContainer: {
    alignItems: 'flex-end',
  },
  verDetalleText: {
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
});