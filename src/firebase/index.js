//import Constants from 'expo-constants'

import firestore from '@react-native-firebase/firestore'

// const firebaseConfig = {
//   apiKey: Constants.manifest.extra.API_KEY,
//   authDomain: Constants.manifest.extra.AUTH_DOMAIN,
//   projectId: 'paleo-robbie-db',
//   storageBucket: Constants.manifest.extra.STORAGE_BUCKET,
//   messagingSenderId: Constants.manifest.extra.MESSAGING_SENDER_ID,
//   appId: Constants.manifest.extra.APPID,
//   measurementId: Constants.manifest.extra.MEASUREMENT_ID,
// }

// firebase.initializeApp(firebaseConfig)

const db = firestore()
db.settings({
  persistence: true,
  cacheSizeBytes: 1048576,
})
export default db
