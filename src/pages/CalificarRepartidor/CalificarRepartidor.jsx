import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import ConfirmacionModal from './ConfirmacionModal';
import {styles} from "./CalificarRepartidorStyles";

const CalificarRepartidor = ({ route, navigation }) => {
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleComentario = (text) => {
    setComentario(text);
  };

  const handleEnviar = async () => {
    // Conectar con POST /repartidores/calificar
    // Ejemplo de payload:
    // {
    //   pedidoId: route.params.pedidoId,
    //   repartidorId: route.params.repartidorId,
    //   puntuacion: rating,
    //   comentario: comentario
    // }
    // Usar axios/fetch para enviar la calificación
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Califica al repartidor</Text>
      <AirbnbRating
        count={5}
        reviews={['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente']}
        defaultRating={5}
        size={30}
        onFinishRating={handleRating}
      />
      <TextInput
        style={styles.input}
        placeholder="Dejá un comentario..."
        value={comentario}
        onChangeText={handleComentario}
        multiline
      />
      <Button title="Enviar calificación" onPress={handleEnviar} />
      <ConfirmacionModal visible={modalVisible} onClose={() => { setModalVisible(false); navigation.goBack(); }} />
    </View>
  );
};

export default CalificarRepartidor;
