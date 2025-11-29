import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: "#3483fa",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
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
