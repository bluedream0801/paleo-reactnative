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
  IS_IOS,
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
  lightPink,
} = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: { flex: 1 },
  headerContainer: {
    backgroundColor: headerBgColor,
    height: 143 - (IS_IOS? 0 : 30),
    paddingHorizontal: baseMargin,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 62 - (IS_IOS? 0 : 30),
  },
  searchIc: {
    width: 34,
    height: 34,
    resizeMode: 'contain',

    tintColor: white,
  },
  time: {
    height: 33,
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',

    borderRadius: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  calanderIc: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 8,
  },
  upcoming: {
    height: 69,

    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: white,
    borderRadius: 5,
    marginHorizontal: 10,
    paddingLeft: 10,
    paddingRight: 15,
    justifyContent: 'space-between',
    marginTop: 15,
  },
  arrowRight: {
    width: 10,
    height: 14,
    resizeMode: 'contain',
    marginLeft: 26,
  },
  arrowRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  todayText: {
    marginTop: 3,
  },
  creditContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  creditRow: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    backgroundColor: white,
    justifyContent: 'space-between',
    paddingRight: 15,
    paddingLeft: 14,
    borderBottomWidth: 1,
    borderColor: borderGrey,
  },
  creditFirstRow: {
    marginTop: 15,
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
  },
  creditLattRow: {
    borderBottomWidth: 0,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,
  },
  lastOrderImg: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
    marginRight: 7,
  },
  smallRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeImg: {
    height: 238,
    width: '100%',
    marginTop: doubleBaseMargin,
  },
  promiseText: {
    alignSelf: 'center',
    marginTop: 29,
  },
  paleoText: {
    marginLeft: 16,
    marginTop: 13,
  },
  promiseRow: {
    flexDirection: 'row',

    marginTop: 14,
    borderWidth: 0,
  },
  promiseImg: {
    width: 83,
    height: 83,
    resizeMode: 'contain',
  },
  promiseSection: {
    paddingHorizontal: 10,
    paddingRight: 5,
    flex: 1,
  },
  promiseInner: {
    flex: 1,
    paddingLeft: 16,
  },
  whiteContainer: {
    height: 31,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: white,
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 17,
  },
  realText: {
    fontFamily: appFonts.FuturaPassata_Display,
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
})
