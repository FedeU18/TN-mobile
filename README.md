# TN-Mobile - Configuración de Desarrollo

## 🚀 Inicio Rápido

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

3. **La app debería detectar automáticamente tu IP local** y conectarse a la API.

## 🔧 Si la detección automática falla

Si ves errores de conexión, sigue estos pasos:

### Paso 1: Encuentra tu IP local
- **Windows**: Abre CMD y ejecuta `ipconfig`
- **Mac/Linux**: Ejecuta `ifconfig` o `ip addr show`
- Busca tu **IPv4 Address** (ej: `192.168.1.105`, `192.168.0.40`, etc.)

### Paso 2: Configura manualmente
1. Copia `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` y descomenta la línea:
   ```
   EXPO_PUBLIC_SERVER_IP=TU_IP_AQUÍ
   ```

3. Reemplaza `TU_IP_AQUÍ` con tu IP real:
   ```
   EXPO_PUBLIC_SERVER_IP=192.168.1.105
   ```

### Paso 3: Reinicia Expo
```bash
npm start
```

## ⚠️ Requisitos Importantes

- **Misma red WiFi**: Tu computadora y dispositivo móvil deben estar conectados a la misma red WiFi
- **API funcionando**: Asegúrate de que `TN-api` esté corriendo en el puerto 3000
- **Firewall**: En Windows, puede que necesites permitir la conexión en el firewall

## 🐛 Solución de Problemas

Si aún tienes problemas:

1. **Verifica que la API esté corriendo**:
   - Ve a `TN-api` y ejecuta `npm run dev`
   - Debería mostrar "Server running on port 3000"

2. **Prueba la conexión desde tu navegador**:
   - Abre `http://TU_IP:3000/api/health` en tu navegador
   - Deberías ver una respuesta de la API

3. **Usa el túnel de Expo** (última opción):
   ```bash
   npm run start -- --tunnel
   ```
   Esto creará una URL pública pero será más lento.