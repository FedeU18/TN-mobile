import 'dotenv/config';

export default () => ({
  expo: {
    name: "TN-mobile",
    slug: "TN-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE",
        "FOREGROUND_SERVICE_LOCATION",
      ],
      package: "com.anonymous.TNmobile",
    },

    plugins: [
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "Esta aplicación necesita acceso a la ubicación para realizar el seguimiento de entregas.",
          locationAlwaysPermission:
            "Esta aplicación necesita acceso continuo a la ubicación incluso en segundo plano.",
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
          isAndroidForegroundServiceEnabled: true,
        },
      ],
    ],

    /**
     * Todas las variables EXPO_PUBLIC_* del .env
     * quedan disponibles en Constants.expoConfig.extra
     */
    extra: {
      eas: {
        projectId: "f9c9de20-934a-4714-a897-673644580360",
      },

      // 🔥 EXPONE TODO LO EXPO_PUBLIC_* AUTOMÁTICAMENTE
      SERVER_IP: process.env.EXPO_PUBLIC_SERVER_IP,
      MAPBOX_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_TOKEN,
      MAPS_DOWNLOAD_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_MAPS_DOWNLOAD_TOKEN,

      BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL,
      API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
      ORS_API_KEY: process.env.EXPO_PUBLIC_ORS_API_KEY,
    },

  },
});
