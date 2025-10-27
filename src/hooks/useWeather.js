import { useEffect, useState } from "react";
import usarUbicacion from "./usarUbicacion";
import { getWeatherForecast } from "../utils/weatherApi";

export default function useWeather(defaultCity = "Neuquen") {
  const { ultimaUbicacion } = usarUbicacion();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const location =
          ultimaUbicacion?.latitud && ultimaUbicacion?.longitud
            ? {
                latitud: ultimaUbicacion.latitud,
                longitud: ultimaUbicacion.longitud,
              }
            : defaultCity;

        const data = await getWeatherForecast(location);
        setWeather(data);
      } catch (e) {
        setError("No se pudo obtener el clima.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [ultimaUbicacion]);

  return { weather, loading, error };
}
