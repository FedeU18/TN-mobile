import { StyleSheet } from 'react-native';
import COLORS from '../../utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.gray[900],
    flex: 1,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray[600],
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  repartidorName: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginTop: 2,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    paddingVertical: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.gray[700],
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  verDetalles: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
});

export default styles;
