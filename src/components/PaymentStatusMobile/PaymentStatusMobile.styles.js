import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderLeftWidth: 5,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  monto: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 8,
    paddingTop: 12,
  },
  fecha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
});
