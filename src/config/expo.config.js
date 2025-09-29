import Constants from 'expo-constants';

// Detectar automáticamente la IP usando Expo Constants
const getExpoIP = () => {
  if (__DEV__) {
    // Método 1: Usar debuggerHost (más común)
    if (Constants.manifest?.debuggerHost) {
      const debuggerHost = Constants.manifest.debuggerHost;
      const ip = debuggerHost.split(':')[0];
      console.log(`📱 IP detectada desde debuggerHost: ${ip}`);
      return ip;
    }
    
    // Método 2: Usar manifest2 (nueva versión de Expo)
    if (Constants.manifest2?.extra?.expoGo?.debuggerHost) {
      const debuggerHost = Constants.manifest2.extra.expoGo.debuggerHost;
      const ip = debuggerHost.split(':')[0];
      console.log(`📱 IP detectada desde manifest2: ${ip}`);
      return ip;
    }
    
    // Método 3: Usar experienceUrl si está disponible
    if (Constants.linkingUrl) {
      try {
        const url = new URL(Constants.linkingUrl);
        if (url.hostname && url.hostname !== 'localhost') {
          console.log(`📱 IP detectada desde linkingUrl: ${url.hostname}`);
          return url.hostname;
        }
      } catch (e) {
        // Si falla el parsing de URL, continúa con fallback
      }
    }
    
    // Método 4: Buscar en las variables de entorno de Expo
    if (process.env.EXPO_PUBLIC_SERVER_IP) {
      console.log(`📱 IP desde variable de entorno: ${process.env.EXPO_PUBLIC_SERVER_IP}`);
      return process.env.EXPO_PUBLIC_SERVER_IP;
    }
  }
  
  // Fallback: mostrar instrucciones claras
  console.error(`❌ No se pudo detectar la IP automáticamente.`);
  console.error(`📝 Soluciones:`);
  console.error(`   1. Usa 'expo start --tunnel' para generar una URL pública`);
  console.error(`   2. O ejecuta 'ipconfig' en Windows para encontrar tu IPv4`);
  console.error(`   3. O crea un archivo .env con: EXPO_PUBLIC_SERVER_IP=TU_IP`);
  
  // En lugar de usar tu IP, usar localhost (que dará error claro)
  return 'localhost'; // Esto fallará pero será más claro que el problema es la IP
};

export const EXPO_CONFIG = {
  getAutoIP: getExpoIP,
  getAPIUrl: () => {
    const ip = getExpoIP();
    const url = `http://${ip}:3000/api`;
    console.log(`� API URL configurada: ${url}`);
    return url;
  }
};