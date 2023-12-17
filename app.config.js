import {
  GOOGLE_MAPS_API_KEY,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECTID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APPID,
  FIREBASE_MEASUREMENT_ID,
} from 'react-native-dotenv'
import 'dotenv/config'
module.exports = ({ config }) => {
  const appConfig = {
    ...config,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.food.paleorobbie',
      buildNumber: '1.0.0',
      config: {
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      package: 'com.food.paleorobbie',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      softwareKeyboardLayoutMode: 'pan',
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY,
        },
      },
    },
    extra: {
      // API_KEY: process.env.API_KEY === FIREBASE_API_KEY,
      // AUTH_DOMAIN: process.env.AUTH_DOMAIN === FIREBASE_AUTH_DOMAIN,
      // PROJECT_ID: process.env.PROJECT_ID === FIREBASE_PROJECTID,
      // STORAGE_BUCKET: process.env.STORAGE_BUCKET === FIREBASE_STORAGE_BUCKET,
      // MESSAGING_SENDER_ID:
      //   process.env.MESSAGING_SENDER_ID === FIREBASE_MESSAGING_SENDER_ID,
      // APPID: process.env.APPID === FIREBASE_APPID,
      // MEASUREMENT_ID: process.env.MEASUREMENT_ID === FIREBASE_MEASUREMENT_ID,
    },
  }
  return appConfig
}
