import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    margin: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 32,
    color: "#ddd",
  },
  starSelected: {
    fontSize: 32,
    color: "#FFD700",
  },
  ratingText: {
    fontSize: 14,
    marginBottom: 15,
    color: "#555",
    textAlign: "center",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "#ff3b30",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 14,
  },
});