import { StyleSheet } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const { marginHorizontal } = appMetrics
const {} = appColors

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingBottom: 0,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  btnContainer: {
    paddingHorizontal: marginHorizontal,
    marginBottom: 0,
    position: 'absolute',
    bottom: 20,
  },
  addBtn: {
    marginBottom: 20,
    position: 'absolute',
    bottom: 20,

    width: '95%',
    alignSelf: 'center',
  },
  cell: {
    height: 60,
    flexDirection: 'row',

    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 2,
  },
  locationImg: {
    width: 14,
    height: 20,
    resizeMode: 'contain',
    marginRight: marginHorizontal,
    marginBottom: 13,
    marginTop: 5,
  },

  topText: {
    alignSelf: 'center',
    marginBottom: 0,
    marginTop: 0,
  },
  mapPin: {
    width: 56,
    height: 81,
    resizeMode: 'contain',
    position: 'absolute',
    alignSelf: 'center',
    marginTop: '40%',
  },
  whiteCirlce: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackLocation: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 2,
    marginTop: 2,
  },
  locationPin: {
    position: 'absolute',
    zIndex: 33,
    right: 5,
    bottom: 105,
  },
})
