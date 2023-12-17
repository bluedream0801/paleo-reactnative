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
  textDarkGray,
  blueOpacity,
  whiteOpacity,
  notifyBlue,
  borderGrey,
  headerBgColor,
  addressGrey,
  lowOpacity,
} = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blueContainer: {
    padding: baseMargin,
    backgroundColor: blueOpacity,
    margin: baseMargin,
  },
  whiteContainer: {
    backgroundColor: white,
  },
  timeContainer: {
    backgroundColor: white,
    borderRadius: 5,
    flexDirection: 'row',
    height: 64,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    marginTop: smallMargin,
  },
  arrowImg: {
    width: 12,
    height: 14,
    resizeMode: 'contain',
  },
  clockImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
  },
  marginContainer: {
    paddingHorizontal: baseMargin,
    paddingTop: globalPadding,
  },
  nothing: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  white: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
    borderRadius: 5,
    height: 26,
    paddingHorizontal: globalPadding,
    marginTop: 30,
  },
  stylesimagesRow: {
    flexDirection: 'row',
  },
  mealImg: {
    height: 50,
    width: (screenWidth - 35) / 4,
    resizeMode: 'contain',

    marginRight: 1,
  },
  imagesRow: {
    flexDirection: 'row',
    paddingHorizontal: baseMargin,
    justifyContent: 'space-between',
    marginTop: smallMargin,
  },
  topMargin: {
    marginTop: smallMargin * 2,
  },
  imgContainer: {
    marginTop: 30,
  },
  textRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: baseMargin * 1.4,
  },
  pastOrders: {
    color: appColors.buttonRed,
    fontFamily: appFonts.GTWalsheim_Bold,
  },
  seeAll: {
    color: appColors.buttonRed,
    fontFamily: appFonts.GTWalsheim,
  },
  flex: {
    flex: 1,
    paddingHorizontal: 10,
  },
  listStyle: {
    marginHorizontal: baseMargin,
    borderRadius: 5,
    overflow: 'hidden',
  },
  cellRowrow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    flex: 1,
  },
  Unavailable: {
    width: 86,
    height: 16,
    borderBottomStartRadius: 5,
    backgroundColor: lowOpacity,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Unavailable_Text: {
    color: appColors.white,
    fontSize: 11,
  },
  imgContainerCell: {
    height: 64,
    width: 102,
  },
  favouries: {
    height: 64,
    resizeMode: 'contain',
  },
  textContainer: {
    height: 54,
    marginLeft: baseMargin,
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 10,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
    minWidth: 33,
    height: 33,
    borderColor: appColors.quantityGreen,
    borderWidth: 1,
    justifyContent: "center",
    backgroundColor: appColors.white,
    //marginLeft: 15,
    //padding: 10,
  },
  saveBtn: {
    padding: 10,
    backgroundColor: appColors.black,
    borderRadius: 4,
    marginRight: 'auto',
    fontSize: 12,
    fontFamily: appFonts.GTWalsheim_Bold,
  },
  delImg: {
    width: 14,
    height: 18,
    resizeMode: 'contain',
  },
  OkImg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  itemCell: {
    height: 64,
    backgroundColor: white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: borderGrey,
    overflow: 'hidden',
    paddingRight: baseMargin,
  },
  itemContainerCell: {
    borderColor: borderGrey,
    borderRadius: 5,
  },

  delRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
    minWidth: 33,
    height: 33,
    // borderColor: appColors.quantityGreen,
    // borderWidth: 1,
    justifyContent: "center",
  },
  smallTtitle: {
    fontWeight: 'normal',
  },
  expendedDetails: {
    padding: baseMargin,
    backgroundColor: white,
  },
  dropDownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallArrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    transform: [{ rotate: '90deg' }],
    marginLeft: smallMargin,
  },
  bottomText: {
    paddingHorizontal: smallMargin,
    marginTop: baseMargin,
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
  bottom: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 35,
  },
  underline: {
    borderBottomWidth: 1,

    marginLeft: 3,

    borderBottomColor: addressGrey,
  },
  smallMargin: {
    marginTop: 2,
  },
  marginBottom: {
    marginBottom: 6,
  },
  detailsText: {},

  moewToThis: {
    height: 33,
    borderWidth: 1,

    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 5,
    borderColor: addressGrey,
    borderStyle: 'dashed',
    backgroundColor: white,
  },
  opacityView: {
    position: 'absolute',
    width: '100%',

    zIndex: 4,
    backgroundColor: whiteOpacity,
    height: 50,
  },
  //
})
