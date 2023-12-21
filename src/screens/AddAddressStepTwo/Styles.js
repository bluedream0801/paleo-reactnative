import { StyleSheet } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const { marginHorizontal, doubleBaseMargin, globalPadding } = appMetrics
const { white, borderGrey } = appColors

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    width: '100%',
    height: 140,
  },
  btnContainer: {
    paddingHorizontal: marginHorizontal,

    backgroundColor: white,
    flex: 1,
    height: 150,
  },
  addBtn: {},

  addBtn: { marginTop: 0 },
  topText: {
    alignSelf: 'center',
    marginBottom: marginHorizontal,
    marginTop: -10,
  },
  mapPin: {
    width: 45,
    height: 65,
    resizeMode: 'contain',
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 35,
  },
  whiteContainer: {
    backgroundColor: white,
    width: '100%',
    paddingHorizontal: marginHorizontal,
    paddingVertical: doubleBaseMargin,
  },
  padding: {
    marginLeft: marginHorizontal,
    marginBottom: marginHorizontal,
    marginTop: globalPadding,
  },

  chatSection: {
    height: 32,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: borderGrey,
    flexDirection: 'row',
    marginTop: doubleBaseMargin,
  },
  smallChat: {
    width: 25,
    height: 20,
    resizeMode: 'contain',
  },
  inputViewStyle: {
    marginTop: doubleBaseMargin,
  },
  inputBase: {
    width: '48%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingTop: doubleBaseMargin,
  },
  helpText: {
    marginHorizontal: marginHorizontal,
  },
  pinLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: marginHorizontal,
    alignItems: 'center',
    marginTop: globalPadding,
    marginBottom: marginHorizontal * 0.8,
  },
})
