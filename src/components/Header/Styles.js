import { Platform, StyleSheet } from 'react-native'
import Constants from 'expo-constants'
import { appFonts, appColors, appMetrics } from '../../theme'
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { white } = appColors
const { headerHeight } = appMetrics

export default styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: appColors.headerBgColor,
    flexDirection: 'row',
    alignItems: 'center',
    height: headerHeight,
    justifyContent: 'center',
  },
  leftBtn: {
    width: '10%',
    alignItems: 'center',
    borderWidth: 0,

    height: 55,
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: appColors.white,

    textAlign: 'center',

    fontFamily: appFonts.GTWalsheim_Condensed_Bold
  },
})
