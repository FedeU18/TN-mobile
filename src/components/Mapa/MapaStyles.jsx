import { StyleSheet, Dimensions } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// 60% del alto de la pantalla
const MAP_HEIGHT = SCREEN_HEIGHT * 0.55;

export default StyleSheet.create({
  mapWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  mapaContainer: {
    width: "100%",
    height: MAP_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  mapa: {
    width: "100%",
    height: "100%", // ahora usa el 100% del contenedor
  },
  leyendaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    gap: 16,
  },
  leyendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoRuta: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    zIndex: 10,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
  },
});
