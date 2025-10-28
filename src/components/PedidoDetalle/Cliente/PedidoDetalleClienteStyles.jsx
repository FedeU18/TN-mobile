import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  estado: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  texto: {
    fontSize: 15,
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  seguimiento: {
    backgroundColor: "#e6f7ff",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  seguimientoTexto: {
    color: "#007AFF",
    fontWeight: "600",
  },
  entregadoTexto: {
    color: "#28a745",
    fontWeight: "600",
  },
  noMapa: {
    alignItems: "center",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});