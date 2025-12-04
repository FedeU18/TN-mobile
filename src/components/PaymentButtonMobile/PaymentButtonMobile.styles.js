import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 0,
    paddingHorizontal: 0,
  },
  button: {
    backgroundColor: "#3483fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  amount: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
  },
  amountBold: {
    fontWeight: "700",
    color: "#3483fa",
    fontSize: 16,
  },
});
