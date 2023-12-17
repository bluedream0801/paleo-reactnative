import { StyleSheet, Platform } from 'react-native'
import { appColors, appMetrics, appFonts } from '../../theme'
const {
  marginHorizontal,
  borderRadius,
  doubleBaseMargin,
  smallMargin,
  baseMargin,
  headerHeight,
  globalPadding,
} = appMetrics
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { white, switchBorder, borderGrey, blackOpacity, lightGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderList: {
    marginHorizontal: marginHorizontal,
    borderRadius: borderRadius,
    flex: 1,
    overflow: 'hidden',
    marginTop: doubleBaseMargin,

    width: '100%',
    height: '100%',
  },
  listInnerContainer: {
    flex: 1,
    backgroundColor: white,
  },
  orderListContainer: {
    flex: 1,
  },
  defaultAddress: {
    height: 125,
  },
  defaultHeading: {
    marginBottom: marginHorizontal,
  },
  heading: {
    marginBottom: marginHorizontal,
    marginTop: doubleBaseMargin,
  },
  addBtn: {
    marginBottom: 30,
  },
  body: {
    flex: 1,
  },
  addBtnUpper: {
    marginTop: marginHorizontal * 3,
  },

  inputStyle: {},
  leftIconStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: marginHorizontal,
  },
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIc: {
    width: 18,
    height: 19,
    resizeMode: 'contain',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: baseMargin,
    paddingVertical: smallMargin * 1.5,
  },
  cell: {
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: borderGrey,
    width: '100%',
    alignItems: 'center',
  },

  cateCategory: {
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: borderGrey,
    width: '100%',
    alignItems: 'center',
  },
  locationImg: {
    width: 59,
    height: 59,
    resizeMode: 'contain',
  },
  infoImg: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginLeft: smallMargin,
  },
  googleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 5,
    height: 32,
    width: '100%',
    borderColor: borderGrey,
    marginTop: 40,
  },
  normalText: {
    fontWeight: 'normal',
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
  historyContainer: {
    backgroundColor: white,
    flexDirection: 'row',
    width: '100%',
    paddingBottom: doubleBaseMargin,
    paddingHorizontal: marginHorizontal,
    flexWrap: 'wrap',
  },
  popularCell: {
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: 'row',
    paddingHorizontal: marginHorizontal * 1.4,
    paddingVertical: marginHorizontal * 0.5,
    marginRight: globalPadding,
    marginTop: doubleBaseMargin,
    borderColor: borderGrey,
    alignItems: 'center',
  },
  historyCell: {
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: 'row',

    paddingVertical: marginHorizontal * 0.5,
    marginRight: globalPadding,
    marginTop: doubleBaseMargin,
    borderColor: borderGrey,
    alignItems: 'center',
    height: 30,
  },
  closeImg: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  cockImg: {
    width: 13,
    height: 15,
    resizeMode: 'contain',
    marginRight: smallMargin * 2,
  },
  papularMain: {
    width: '100%',
    marginTop: doubleBaseMargin,
  },
  searchMain: {
    width: '100%',
    marginTop: doubleBaseMargin * 0.2,
  },
  row: {
    backgroundColor: lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    height: headerHeight,
    justifyContent: 'space-between',
    borderWidth: 0,
    width: '100%',
    paddingRight: smallMargin * 2,
  },
  backImg: {
    width: 25,
    height: 24,
    resizeMode: 'contain',
  },
  inputViewStyle: {
    backgroundColor: white,
    borderColor: switchBorder,
    marginTop: 0,
    height: 40,
  },
  leftIconStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: marginHorizontal,
  },
  leftBtn: {
    width: '12%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    
    height: '100%',
  },
  highlightedText: {
    fontFamily: appFonts.GTWalsheim_Condensed_Bold,
  },
  listText: {
    marginLeft: marginHorizontal,
    paddingRight: marginHorizontal,
    flex: 1,
  },
  categoryText: {
    marginBottom: marginHorizontal * 0.8,
  },
  productText: {
    marginBottom: marginHorizontal * 0.8,
    marginTop: doubleBaseMargin,
  },
  queryText: {
    paddingLeft: 14,
    paddingRight: 10,
  },
})
