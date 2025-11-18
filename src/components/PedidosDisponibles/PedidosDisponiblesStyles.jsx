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
  horaEstimada: {
    fontSize: 14,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
  pedidoInfo: {
    marginBottom: 15,
  },
  cliente: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 5,
  },
  direccion: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 3,
  },
  tomarButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  tomarButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  tomarButtonText: {
    color: '#fff',
    fontSize: 16,
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