import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "./CalificacionRepartidorStyles.jsx";

const MAX_STARS = 5;

export default function CalificacionRepartidor({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");

  const handleStarPress = (star) => {
    setRating(star);
    setError("");
  };

  const handleSubmit = () => {
    // Validar que se haya seleccionado una puntuación
    if (rating < 1) {
      setError("Debés seleccionar al menos 1 estrella");
      return;
    }

    // Enviar la calificación (comentario es opcional)
    onSubmit({ rating, comentario: comentario.trim() || null });
    
    // Resetear el formulario
    setRating(0);
    setComentario("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Califica al repartidor:</Text>
      
      {/* Sistema de estrellas */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            style={styles.starButton}
          >
            <Text style={star <= rating ? styles.starSelected : styles.star}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Mostrar puntuación actual */}
      {rating > 0 && (
        <Text style={styles.ratingText}>
          {rating} {rating === 1 ? "estrella" : "estrellas"}
        </Text>
      )}
      
      {/* Input de comentario opcional */}
      <TextInput
        style={styles.input}
        placeholder="Deja un comentario (opcional)"
        placeholderTextColor="#999"
        value={comentario}
        onChangeText={setComentario}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
      
      {/* Mensaje de error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      {/* Botón enviar */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar calificación</Text>
      </TouchableOpacity>
    </View>
  );
}