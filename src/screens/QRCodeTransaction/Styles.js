import { appFonts, appColors, appMetrics, fontStyles } from '../../theme'
import { StyleSheet, Platform } from 'react-native'
const { size } = fontStyles
const {
  marginHorizontal,
  smallMargin,
  doubleBaseMargin,
  baseMargin,
  globalPadding,
  screenWidth,
} = appMetrics
const {
  lowOpacity,
  borderGrey,
  white,
  headerBgColor,
  lightGrey,
  whiteLowOpacity,
  cartGrey,
  quantityGreen,
  progress,
  progressOrange,
  blackOpacity,
  darkGrey,
  lowRedOpacity,
  redProgress,
  lightRedProgress,
  accountSettingGray,
  addressGrey,
  notifyGreen,
  paymentLightBlue,
  blueOpacity,
} = appColors
export default styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: white,
    marginTop: 10,
  },
  orderText: {
    alignSelf: 'center',
    marginTop: -10,
  },
  qrcodeTime: {
    backgroundColor: lowRedOpacity,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    margin: baseMargin,
    marginBottom: globalPadding,
  },
  thaiImg: {
    width: 119,
    height: 51,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 35,
    marginBottom: globalPadding,
  },
  qrcodeImg: {
    width: 171,
    height: 171,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 7,
  },
  saveImgText: {
    marginTop: 35,
  },
  banksImg: {
    width: 263,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 27,
    marginBottom: 10,
  },
  saveImg: {
    backgroundColor: quantityGreen,
    alignSelf: 'center',
    width: '95%',
    marginBottom: 22
  },
  modalContain: {
    backgroundColor: blackOpacity,
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: -22,
    bottom: 0,
  },
  helpTouch: {
    marginBottom: -4,
  },
})
