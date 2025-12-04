import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 0,
    paddingHorizontal: 0,
  },
  button: {
    backgroundColor: "#3483fa",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#999",
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  amount: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  amountBold: {
    fontWeight: "700",
    color: "#3483fa",
    fontSize: 16,
  },
});
