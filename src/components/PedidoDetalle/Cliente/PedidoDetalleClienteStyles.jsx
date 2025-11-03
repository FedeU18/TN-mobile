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
  
  // Estilos para el botón de escaneo QR
  botonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  botonEscanear: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    minWidth: 180,
    alignItems: "center",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  
  // Estilos para el modal del scanner
  modalScanner: {
    flex: 1,
    backgroundColor: "#000",
  },
  scannerHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  scannerTitulo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scannerSubtitulo: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraView: {
    width: '100%',
    height: '100%',
  },
  qrMarcoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrMarco: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#28a745',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  permisoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permisoTexto: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  botonPermiso: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  scannerFooter: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  botonCancelarTexto: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  
  // Estilos para el modal de calificación
  modalCalificacionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCalificacionContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    elevation: 5,
  },
  botonCalificar: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    minWidth: 180,
    alignItems: "center",
  },
  botonCancelarCalificacion: {
    marginTop: 10,
    alignItems: "center",
  },
  textoCancelarCalificacion: {
    color: "#007AFF",
  },
});