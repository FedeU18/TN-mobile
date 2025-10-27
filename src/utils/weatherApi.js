// Utilidad para obtener el clima actual y el de la próxima hora usando el backend (proxy seguro)
// location puede ser string (ciudad) o { latitud, longitud }

const API_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/weather`;

export async function getWeatherForecast(location) {
  let q;
  if (typeof location === "string") {
    q = location;
  } else if (location && location.latitud && location.longitud) {
    q = `${location.latitud},${location.longitud}`;
  } else {
    throw new Error("Ubicación no válida para el clima");
  }

  const url = `${API_URL}?q=${encodeURIComponent(q)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudo obtener el clima");
  const data = await response.json();
  return data;
}
