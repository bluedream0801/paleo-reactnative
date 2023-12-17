import { StyleSheet, Platform } from 'react-native'

import { appFonts, appColors, appMetrics, fontStyles } from '../../theme'

const { size, RegularText, BoldText } = fontStyles
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
  whiteMinOpacity,
  notifyBlue,
  borderGrey,
  headerBgColor,
  darkGray,
  lightGrey,
  orderDarkGray,
  dotOpacity,
  blueOpacity,
  transparent,
} = appColors

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGrey,
  },
  body: {
    flex: 1,
  },
  itemImg: {
    width: '100%',
    height: 350,
    resizeMode: 'contain',

    backgroundColor: white,
  },
  crossImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  heartSelectedImg: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  heartImg: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
  crossContainer: {
    position: 'absolute',
    top: 40,
    right: 10,
    width: 34,
    height: 34,
    backgroundColor: whiteMinOpacity,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  heartContainer: {
    position: 'absolute',
    bottom: 10,
    right: smallMargin * 1.5,
    zIndex: 4,
  },
  textContainer: {
    backgroundColor: white,
    paddingTop: baseMargin * 1.5,
    flex: 1,
  },
  fromContainer: {
    borderRadius: 10,

    alignItems: 'flex-start',

    marginLeft: 0,
  },
  fromContainerText: {
    backgroundColor: headerBgColor,
    borderRadius: 7,
    height: 15,
    paddingTop: 0,
    marginLeft: baseMargin,
    paddingHorizontal: 9,

    borderWidth: 1,
    borderColor: white,
    overflow: 'hidden',
    paddingTop: IS_IOS ? 0 : 1,
  },
  line: {
    backgroundColor: borderGrey,
    width: '100%',
    height: 1,
    marginVertical: globalPadding,
  },
  textSubContainer: {
    paddingHorizontal: baseMargin,
    paddingBottom: doubleBaseMargin,
  },
  nutrition: {
    paddingHorizontal: baseMargin,
    marginTop: doubleBaseMargin,
    paddingBottom: 30,
  },
  subContainer: {
    backgroundColor: white,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: baseMargin,
    paddingVertical: baseMargin,
    justifyContent: 'space-between',
    height: 50,
  },
  arrow: {
    width: 9,
    height: 11,
    resizeMode: 'contain',
  },
  slotContainer: {
    flex: 1,
    paddingHorizontal: globalPadding,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    backgroundColor: white,
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: baseMargin,
    borderColor: borderGrey,
  },
  cell: {
    height: 84,
    flex: 1,

    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
    backgroundColor: white,
    borderColor: borderGrey,
    marginLeft: baseMargin,
    width: 290,
    paddingLeft: 1,
  },
  ImgContainer: {
    width: 82,
    height: 82,
  },
  cellImg: {
    height: 82,
    resizeMode: 'contain',
    width: 80,
  },
  rightContainer: {
    flex: 1,

    height: '100%',
    paddingTop: smallMargin,
    overflow: 'visible',
    paddingBottom: 10,
    paddingRight: 10,
  },
  inner: {
    paddingLeft: 10,

    justifyContent: 'space-between',

    flex: 1,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bottomRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',

    alignItems: 'flex-end',
  },

  addImg: {
    width: 33,
    height: 28,
    resizeMode: 'contain',
    marginTop: 1,
  },
  listContainer: {
    paddingLeft: 20,
    marginTop: globalPadding * 0.9,
  },
  imgSection: {
    paddingTop: 0,
    backgroundColor: white,
  },
  textMargin: {
    marginTop: smallMargin * 2,
    marginBottom: smallMargin * 2,
    marginLeft: baseMargin,
  },
  padding: {
    marginLeft: baseMargin,
  },
  cartContainer: {
    height: 92,
    backgroundColor: white,

    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: baseMargin,
    paddingRight: baseMargin,
    width: '100%',

    borderColor: borderGrey,
    borderTopWidth: 1,
  },
  cartNotifyContainer: {
    height: 92,
    backgroundColor: white,

    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: baseMargin,
    paddingRight: baseMargin,
    width: '100%',

    borderColor: borderGrey,
    borderTopWidth: 1,
    justifyContent: 'space-between',
  },

  cartBtn: {
    height: 52,
    width: 167,
    backgroundColor: quantityGreen,
    marginTop: 0,
  },
  itemPrice: {
    marginRight: globalPadding,
    alignItems: 'flex-end',
    paddingTop: baseMargin * 0.8,
  },
  itemPriceRow: {
    marginRight: globalPadding,
    alignItems: 'flex-end',
    paddingTop: 3,
  },
  notifyItemPrice: {
    marginRight: globalPadding,

    paddingTop: baseMargin * 0.4,
    marginLeft: 15,
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
  priceRow: {
    borderWidth: 0,
    marginBottom: -3,
  },

  slider: { backgroundColor: '#000', height: 350 },
  content1: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content2: {
    width: '100%',
    height: 100,
    marginTop: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: { color: '#fff' },
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    width: 15,
    height: 15,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: headerBgColor,
    margin: 5,
  },
  buttonSelected: {
    opacity: 1,
    color: 'white',
  },
  customSlide: {
    backgroundColor: 'green',
  },
  customImage: {
    width: 100,
    height: 100,
  },
  webViewContainer: {
    width: 200,
    height: 200,
  },
  activeDot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    marginHorizontal: 0,
    backgroundColor: orderDarkGray,
  },
  inactiveDotStyle: {
    backgroundColor: dotOpacity,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: orderDarkGray,
  },
  dotMainContainer: {
    position: 'absolute',
    bottom: 0,
    left: 50,
    right: 50,

    paddingBottom: 33,
  },
  dotContainerStyle: {
    marginHorizontal: 2.5,
  },
  bell: {
    width: 14,
    height: 18,
    resizeMode: 'contain',
  },
  notifyRow: {
    flexDirection: 'row',
  },
  notifyBtn: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: quantityGreen,
    width: 127,
    height: 52,
    borderRadius: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  notifyText: {
    marginTop: 2,
  },
  notification: {
    width: '70%',
    height: 52,
    backgroundColor: blueOpacity,

    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 0,
  },
  circle: {
    height: 16,
    width: 16,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: notifyBlue,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: baseMargin * 0.7,
  },
  tick: {
    width: 8,
    height: 8,
    resizeMode: 'contain',
    tintColor: notifyBlue,
  },
})

export const detailsTextStyles = StyleSheet.create({
  font: {
    ...RegularText,
    color: darkGray,
    lineHeight: 20,
  },
  p: {
    ...RegularText,
    color: darkGray,
    lineHeight: 20,
  },

  b: {
    ...BoldText,
    color: darkGray,
    lineHeight: 20,
  },
})
