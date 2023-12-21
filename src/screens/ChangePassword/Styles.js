import { StyleSheet, Platform } from 'react-native'
import { appFonts, appColors, appMetrics } from '../../theme'
const { doubleBaseMargin } = appMetrics
const { white, lightGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGrey,
  },
  body: {
    width: '100%',
    alignSelf: 'center',

    alignItems: 'center',

    backgroundColor: white,
    paddingVertical: doubleBaseMargin,
  },
  innerContainer: {
    width: '95%',
    alignSelf: 'center',

    alignItems: 'center',

    backgroundColor: white,
  },
  forgotText: {
    marginTop: 20,
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    color: appColors.green,
  },
  signupText: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    color: appColors.darkGray,
  },
  footer: {
    width: '100%',
    backgroundColor: appColors.lightGrey,
    height: Platform.OS == 'ios' ? 80 : 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCustomStyles: {
    marginTop: 20,
  },
})
