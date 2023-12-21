import { StyleSheet } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'
const { globalPadding } = appMetrics
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    width: '100%',
    backgroundColor: appColors.black,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 52,
  },
  btnText: {
    fontFamily: appFonts.GTWalsheim_Regular,
    fontSize: 17,
    color: appColors.white,
    // marginVertical : '4%'
  },
  btnSelected: {
    opacity: 0.5
  },
  btnDisabled: {
    opacity: 0.5
  },
  smallBtn: {
    width: null,
    paddingHorizontal: globalPadding,
    height: 33,
  },
})
