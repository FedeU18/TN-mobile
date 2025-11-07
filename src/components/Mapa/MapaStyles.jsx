import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mapaContainer: {
    width: '100%',
    height: 340,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  mapa: {
    width: '100%',
    height: 300,
  },
  leyendaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    gap: 16,
  },
  leyendaItem: {
    fontSize: 14,
    marginHorizontal: 8,
  },
});