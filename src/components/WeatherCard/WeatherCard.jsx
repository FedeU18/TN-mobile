import { View, Text, Image, StyleSheet } from "react-native";

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const { actual, en1hora } = weather;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clima actual</Text>
      <View style={styles.row}>
        {actual?.icon && (
          <Image source={{ uri: "https:" + actual.icon }} style={styles.icon} />
        )}
        <Text style={styles.text}>
          {actual?.condition} ({actual?.temp}°C)
        </Text>
      </View>

      <Text style={styles.title}>En 1 hora</Text>
      <View style={styles.row}>
        {en1hora?.icon && (
          <Image
            source={{ uri: "https:" + en1hora.icon }}
            style={styles.icon}
          />
        )}
        <Text style={styles.text}>
          {en1hora?.condition} ({en1hora?.temp}°C)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    width: 32,
    height: 32,
  },
  text: {
    marginLeft: 8,
    fontSize: 15,
  },
});

export default WeatherCard;
