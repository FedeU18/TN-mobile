import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", paddingTop: 16 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Card / info
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333" },
  estado: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  texto: { fontSize: 15, marginBottom: 6, color: "#333" },
  label: { fontWeight: "bold", color: "#555" },

  // Primary button used for start/stop tracking and modal close
  boton: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  botonTexto: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Row of state action buttons
  botonesEstado: {
    marginTop: 10,
    marginBottom: 25,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  botonesFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 25,
    gap: 8,
  },

  botonEstado: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  // Modal (QR)
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxWidth: 420,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
    color: "#222",
  },
  qrImage: { width: 220, height: 220, alignSelf: "center", marginVertical: 8 },

  // Small helpers
  smallText: { fontSize: 13, color: "#666" },

  // Map container helper (if you want a wrapper for the map component)
  mapWrapper: {
    height: 300,
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
});
