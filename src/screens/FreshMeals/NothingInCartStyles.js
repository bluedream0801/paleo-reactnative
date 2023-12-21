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
    height: 70,
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
    height: 57,
    flex: 1,
  },
  imgContainerCell: {
    height: 57,
    width: 86,
  },
  favouries: {
    width: 86,
    height: 57,
    resizeMode: 'contain',
  },
  textContainer: {
    height: 34,
    marginLeft: baseMargin,
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 10,
  },
  addBtn: {
    marginLeft: 15,
    padding: 10,
  },
  delImg: {
    width: 14,
    height: 18,
    resizeMode: 'contain',
    tintColor: textDarkGray,
  },
  itemCell: {
    height: 57,
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
