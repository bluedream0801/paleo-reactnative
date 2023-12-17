import { Platform, StyleSheet } from 'react-native'
import Constants from 'expo-constants'
import { appFonts, appColors, appMetrics } from '../../theme'
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { lightGrey, blackOpacity } = appColors
const { headerHeight } = appMetrics
export default styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: appMetrics.headerHeight,
  },
  leftBtn: {
    width: '10%',
    alignItems: 'center',
    borderWidth: 0,

    height: appMetrics.headerHeight,
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
  },
  rightBtn: {
    width: '10%',
    alignItems: 'center',
    borderWidth: 0,

    height: appMetrics.headerHeight,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: appColors.white,

    textAlign: 'center',

    fontFamily: appFonts.GTWalsheim_Condensed_Bold,
    marginTop: 2,
  },
  backImg: {
    width: 25,
    height: 22,
    resizeMode: 'contain',
  },
  crossImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  searchImg: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
    marginTop: 2,
  },
  calenderImg: {
    width: 24,
    height: 23,
    resizeMode: 'contain',
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
  arrowImg: {
    width: 17,
    height: 14,
    resizeMode: 'contain',
  },
  margin: {
    marginLeft: 7,
    marginRight: 13,
    marginTop: 1,
  },
  largeHeading: {
    marginTop: 7,
  },
  overLay: {
    left: 0,
    right: 0,
    bottom: 0,
    top: -2,
    position: 'absolute',
    backgroundColor: blackOpacity,
  },
})
