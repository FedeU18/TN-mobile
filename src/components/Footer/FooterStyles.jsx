import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  menuItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  menuIcon: {
    marginBottom: 4,
  },
  menuLabel: {
    color: COLORS.gray[600],
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuLabelActive: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default styles;