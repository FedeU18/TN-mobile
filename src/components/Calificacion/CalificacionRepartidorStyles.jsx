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
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  star: {
    fontSize: 28,
    color: "#ccc",
    marginHorizontal: 2,
  },
  starSelected: {
    fontSize: 28,
    color: "#FFD700",
    marginHorizontal: 2,
  },
  ratingText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    minHeight: 40,
    marginBottom: 10,
    backgroundColor: "#f7f7f7",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});