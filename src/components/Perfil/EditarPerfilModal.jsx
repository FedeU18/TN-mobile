import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "../libs/axios";

export default function ProfileEditScreen() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    foto_perfil: "",
  });

  const CLOUD_NAME = "dlqqalmj4";
  const UPLOAD_PRESET = "tracknow";

  // =============================
  // 1. Cargar usuario
  // =============================
  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const res = await axios.get("/users/me");

      setUser(res.data);
      setForm({
        nombre: res.data.nombre || "",
        apellido: res.data.apellido || "",
        telefono: res.data.telefono || "",
        foto_perfil: res.data.foto_perfil || "",
      });
    } catch (e) {
      console.error(e);
      alert("Error al cargar perfil");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // =============================
  // 2. Elegir foto desde galería
  // =============================
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      await uploadToCloudinary(img.uri);
    }
  };

  // =============================
  // 3. Subir a Cloudinary
  // =============================
  const uploadToCloudinary = async (imageUri) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profile.jpg",
      });
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      const res = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setForm({ ...form, foto_perfil: data.secure_url });
      } else {
        console.log(data);
        throw new Error("Error subiendo imagen");
      }
    } catch (e) {
      console.error(e);
      alert("Error al subir foto");
    } finally {
      setUploading(false);
    }
  };

  // =============================
  // 4. Guardar cambios en backend
  // =============================
  const handleSubmit = async () => {
    try {
      setSaving(true);

      const res = await axios.put("/users/me", form);

      alert("Perfil actualizado correctamente");
      setUser(res.data.user);
    } catch (e) {
      console.error(e);
      alert("Error al actualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loadingUser) return <Text>Cargando...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Editar perfil</Text>

      {/* FOTO DE PERFIL */}
      <TouchableOpacity onPress={pickImage}>
        {form.foto_perfil ? (
          <Image
            source={{ uri: form.foto_perfil }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              marginBottom: 10,
            }}
          />
        ) : (
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#ccc",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 40 }}>
              {user?.nombre?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="small" color="#000" />}

      {/* CAMPOS */}
      <Text>Nombre</Text>
      <TextInput
        value={form.nombre}
        onChangeText={(t) => setForm({ ...form, nombre: t })}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>Apellido</Text>
      <TextInput
        value={form.apellido}
        onChangeText={(t) => setForm({ ...form, apellido: t })}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>Teléfono</Text>
      <TextInput
        value={form.telefono}
        onChangeText={(t) => setForm({ ...form, telefono: t })}
        style={{ borderWidth: 1, padding: 8, marginBottom: 20 }}
      />

      <Button
        title={saving ? "Guardando..." : "Guardar"}
        onPress={handleSubmit}
        disabled={saving || uploading}
      />
    </View>
  );
}
