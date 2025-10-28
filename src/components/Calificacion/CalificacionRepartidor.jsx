import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import styles from "./CalificacionRepartidorStyles";

const MAX_STARS = 5;
const MIN_RATING = 0.5;

export default function CalificacionRepartidor({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");

  const handleStarPress = (star) => {
    setRating(star);
    setError("");
  };

  const handleSubmit = () => {
    if (rating < MIN_RATING) {
      setError("Debes seleccionar una calificación (mínimo 0.5 estrellas)");
      return;
    }
    onSubmit({ rating, comentario });
    setRating(0);
    setComentario("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Califica al repartidor:</Text>
      <View style={styles.starsContainer}>
        {[...Array(MAX_STARS * 2)].map((_, i) => {
          const value = (i + 1) * 0.5;
          return (
            <TouchableOpacity
              key={value}
              onPress={() => handleStarPress(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(null)}
            >
              <Text style={
                value <= (hover || rating)
                  ? styles.starSelected
                  : styles.star
              }>
                {value % 1 === 0 ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.ratingText}>{rating ? `${rating} estrellas` : ""}</Text>
      <TextInput
        style={styles.input}
        placeholder="Deja un comentario (opcional)"
        value={comentario}
        onChangeText={setComentario}
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar calificación</Text>
      </TouchableOpacity>
    </View>
  );
}