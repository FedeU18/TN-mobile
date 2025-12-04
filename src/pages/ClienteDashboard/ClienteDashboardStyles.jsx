import { StyleSheet } from 'react-native';
import COLORS from '../../utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  
  // ============== HEADER GRADIENT ==============
  headerGradient: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  greetingSmall: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -0.5,
  },

  // ============== SECTION SUBTITLE ==============
  sectionSubtitle: {
    fontSize: 15,
    color: COLORS.gray[600],
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },

  // ============== MENU CONTAINER ==============
  menuContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },

  // ============== PRIMARY MENU ITEM ==============
  primaryMenuItem: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabelPrimary: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  menuDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginTop: 4,
  },

  // ============== SECONDARY MENU ITEM ==============
  secondaryMenuItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  menuLabelSecondary: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  // ============== FOOTER SPACE ==============
  footerSpace: {
    height: 40,
  },
});

export default styles;