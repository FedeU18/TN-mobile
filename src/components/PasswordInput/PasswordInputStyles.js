import { StyleSheet } from 'react-native';

const COLORS = {
  gray: {
    300: '#d1d5db',
    600: '#4b5563',
  },
  primary: '#0950C3',
};

export default StyleSheet.create({
  passwordInputContainer: {
    width: '100%',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gray[300],
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 4,
    fontSize: 16,
    color: '#1f2937',
  },
  toggleButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
