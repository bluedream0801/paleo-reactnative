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
  screenHeight,
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
  lightGrey,
  greenOpacity,
  buttonBorder,
  buttonRed,
  darkGray,
  transparent,
  redOpacity,
  orderDarkGray,
  dotOpacity,
} = appColors

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
  },
  body: {
    flex: 1,
    backgroundColor: white,
  },
  itemImg: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  crossImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  heartImg: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
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
    bottom: 0,
    right: smallMargin,
  },
  textContainer: {
    backgroundColor: white,
    paddingTop: baseMargin,
  },
  fromContainer: {
    backgroundColor: greenOpacity,
    borderRadius: 10,
    height: 15,

    alignItems: 'center',
    maxWidth: 39,
    paddingTop: 1.5,
    marginLeft: smallMargin,
    paddingHorizontal: smallMargin,
  },
  fromKetoContainer: {
    backgroundColor: greenOpacity,
    borderRadius: 10,
    height: 15,

    alignItems: 'center',
    maxWidth: 39,
    paddingTop: 1.5,
    marginLeft: smallMargin,
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  fromRedContainer: {
    backgroundColor: redOpacity,
    borderRadius: 10,
    height: 15,

    alignItems: 'center',
    maxWidth: 39,
    paddingTop: 1.5,
    marginLeft: baseMargin,
    marginBottom: 5,
    paddingHorizontal: 5,
  },

  line: {
    backgroundColor: borderGrey,
    width: 1,
    height: 15,
  },
  textSubContainer: {
    paddingHorizontal: baseMargin,
    paddingBottom: doubleBaseMargin,
  },
  nutrition: {
    paddingHorizontal: baseMargin,
    marginTop: doubleBaseMargin,
    marginBottom: 20,
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
    width: 10,
    height: 12,
    resizeMode: 'contain',
  },
  slotContainer: {
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
    minHeight: 84,
    flex: 1,

    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
    backgroundColor: white,

    borderColor: borderGrey,

    marginLeft: baseMargin,

    marginBottom: 20,
    marginTop: 10,
    minWidth: 290,
  },
  ImgContainer: {
    width: 82,
  },
  cellImg: {
    height: 84,
    resizeMode: 'contain',
    width: 82,
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
  },
  listContainer: {
    paddingLeft: 20,
    marginTop: globalPadding * 0.9,
  },
  imgSection: {
    backgroundColor: white,
  },
  textMargin: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: baseMargin,
  },
  padding: {
    marginLeft: baseMargin,
  },
  cartContainer: {
    height: 92,
    backgroundColor: white,

    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: baseMargin,
    paddingRight: baseMargin,
    width: '100%',
    borderTopWidth: 1,
    borderColor: borderGrey,
    paddingLeft: 10,
  },
  cartBtn: {
    height: 52,
    width: 116,
    backgroundColor: quantityGreen,
    marginTop: 0,
  },
  itemPrice: {
    marginRight: globalPadding,
    alignItems: 'flex-end',
    paddingTop: baseMargin * 0.8,
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

  tabsRow: {
    flexDirection: 'row',
    backgroundColor: lightGrey,
    borderRadius: 0,
    overflow: 'hidden',
    marginHorizontal: 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  tab: {
    height: 36,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsText: {
    marginBottom: 10,
  },
  sizeRow: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: buttonBorder,
    height: 30,
    width: 94,
    flexDirection: 'row',
    padding: 1,
  },
  animatedView: {
    position: 'absolute',

    height: '100%',
    borderRadius: 3,

    top: 1,
    left: 1,

    backgroundColor: buttonRed,
    borderRadius: 3,
  },
  jumboBnt: {
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
    flex: 1,
  },
  qImg: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginRight: 5,
  },
  qRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  btnrow: {
    flexDirection: 'row',
  },
  bottomContent: {
    backgroundColor: lightGrey,
    borderWidth: 0,
  },
  priceRow: {
    borderWidth: 0,
    marginBottom: -3,
  },
  badgesRow: {
    flexDirection: 'row',
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
  },
  dotContainerStyle: {
    marginHorizontal: 2.5,
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
