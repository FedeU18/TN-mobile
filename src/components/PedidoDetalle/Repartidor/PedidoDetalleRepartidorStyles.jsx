import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9f9f9" },
    card: {
        backgroundColor: "#fff",
        margin: 15,
        padding: 15,
        borderRadius: 12,
        elevation: 2,
    },
    titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333" },
    estado: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
    texto: { fontSize: 15, marginBottom: 6 },
    label: { fontWeight: "bold", color: "#555" },
    boton: {
        marginHorizontal: 15,
        marginVertical: 10,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    botonTexto: { color: "#fff", fontWeight: "600", fontSize: 16 },
    botonesEstado: {
        marginTop: 10,
        marginBottom: 25,
        gap: 10,
        marginHorizontal: 15,
    },
    botonEstado: { padding: 14, borderRadius: 10, alignItems: "center" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        width: "80%",
        alignItems: "center",
    },
});
