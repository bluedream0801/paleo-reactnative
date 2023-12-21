import { StyleSheet, Platform } from 'react-native'

import { appFonts, appColors, appMetrics, fontStyles } from '../../theme'

const { size } = fontStyles
const {
  marginHorizontal,
  smallMargin,
  doubleBaseMargin,
  baseMargin,
  globalPadding,
  screenWidth,
  IS_IOS,
} = appMetrics
const {
  lightGreen,
  quantityGreen,
  white,
  blackOpacity,
  lowOpacity,
  greenOpacity,
  whiteOpacity,
  lightGrey,
  accountSettingGray,
  blueOpacity,

  notifyBlue,
  borderGrey,
  headerBgColor,
  buttonBorder,
  transparent,
  redOpacity,
  lowRedOpacity,
  darkGrey,
} = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: { flex: 1 },
  cell: {
    height: 133,
    flex: 1,

    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
    backgroundColor: white,
    borderBottomWidth: 1,
    borderColor: borderGrey,
  },
  whiteContainer: {
    backgroundColor: white,
  },
  inner: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',

    flex: 1,
  },
  cellImg: {
    height: 133,
    resizeMode: 'contain',
    width: '100%',
  },
  overlay: {
    width: screenWidth - 10,
    height: 128,
    paddingLeft: globalPadding,
    paddingTop: baseMargin * 0.7,
  },
  listStyle: {
    flex: 1,
  },
  modalContain: {
    backgroundColor: blackOpacity,
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  ImgContainer: {
    flex: 0.8,
  },
  rightContainer: {
    flex: 1,

    height: '100%',
    paddingTop: baseMargin,
    overflow: 'visible',
  },
  bottomRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 0,
  },
  addImg: {
    width: 33,
    height: 28,
    resizeMode: 'contain',
  },
  priceContainer: {
    width: 33,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: quantityGreen,
  },
  Unavailable: {
    width: '100%',
    height: 54,
    backgroundColor: lowOpacity,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    width: '100%',
    height: 54,
    backgroundColor: blueOpacity,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 7,
    right: 0,
    left: 0,
  },

  notAvailable: {
    width: 120,
    height: 34,
    backgroundColor: lowOpacity,
    position: 'absolute',
    bottom: baseMargin,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  notAvailableImg: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: smallMargin,
    paddingTop: IS_IOS ? 4 : 2,
  },
  bestseller: {
    right: 0,

    height: 15,
    top: baseMargin + smallMargin,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: greenOpacity,
    borderWidth: 1,
    borderColor: whiteOpacity,
    alignSelf: 'flex-end',
    paddingHorizontal: 6,
    paddingTop: 1,
  },
  bestsellerLocall: {
    right: 0,

    height: 15,
    top: baseMargin + baseMargin,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: greenOpacity,
    borderWidth: 1,
    borderColor: whiteOpacity,
    alignSelf: 'flex-end',
    paddingHorizontal: 6,
    paddingTop: 1,
  },
  redBestSeller: {
    right: 0,
    top: baseMargin,
    height: 15,

    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: redOpacity,
    borderWidth: 1,
    borderColor: whiteOpacity,
    alignSelf: 'flex-end',
    paddingHorizontal: 6,
    paddingTop: 1,
  },

  tabBar: {
    flexDirection: 'row',
    paddingTop: 20,
    backgroundColor: lightGrey,
    opacity: 1,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tab: {
    backgroundColor: lightGrey,
    opacity: 1,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarTextStyle: {
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: appFonts.GTWalsheim_Regular,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    height: 33,
  },
  circle: {
    height: 16,
    width: 16,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: notifyBlue,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: baseMargin,
  },
  tick: {
    width: 8,
    height: 8,
    resizeMode: 'contain',
    tintColor: notifyBlue,
  },

  headingContainer: {
    height: 40,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingTop: 15,
    borderColor: borderGrey,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  heart: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  tabBarUnderlineStyle: {
    backgroundColor: headerBgColor,
    height: 3,
    flex: 1,
  },
  tabStyle: {
    paddingHorizontal: 0,
    marginHorizontal: -10,

    borderWidth: 0,
  },
  ScrollableTabBar: {
    borderWidth: 0,
    height: 38,
  },
  leftText: {},
  sizeRow: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: buttonBorder,
    height: 22,
    width: 94,
    flexDirection: 'row',
    padding: 1,
  },
  jumboBnt: {
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
    flex: 1,
  },
  topRed: {
    backgroundColor: lowRedOpacity,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    marginHorizontal: baseMargin,
    height: 44,

    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    marginTop: baseMargin,
    marginBottom: baseMargin,
  },
  calenderImg: {
    width: 17,
    height: 17,
    resizeMode: 'contain',

    marginLeft: smallMargin * 2,
    marginTop: 2,
  },
  changeRow: {
    flexDirection: 'row',

    borderWidth: 0,

    alignItems: 'center',
    marginTop: -2,
  },
  modalContain: {
    backgroundColor: blackOpacity,
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  exvat: {
    marginTop: -0,

    marginLeft: 2,
    marginTop: 1,
  },
  priceRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
