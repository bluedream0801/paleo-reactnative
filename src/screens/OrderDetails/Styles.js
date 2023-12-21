import { StyleSheet, Platform } from 'react-native'

import { appFonts, appColors, appMetrics, fontStyles } from '../../theme'

const { size } = fontStyles
const {
  marginHorizontal,
  smallMargin,
  doubleBaseMargin,
  baseMargin,
  globalPadding,
} = appMetrics
const { lightGreen, borderGrey, white, black, lightGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: marginHorizontal,
  },
  detailsSection: {
    width: '100%',
    backgroundColor: white,
    borderRadius: 5,
    paddingHorizontal: marginHorizontal,
    paddingVertical: marginHorizontal * 1.5,
  },
  orderSection: {
    width: '100%',
    marginBottom: doubleBaseMargin,
  },
  greenContainer: {
    height: 22,
    borderRadius: 11,
    width: 'auto',
    backgroundColor: lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: marginHorizontal,
  },
  multiDeliveryStatus: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  uperTextRow: {
    width: '100%',
    flexDirection: 'row',

    marginTop: smallMargin,
  },
  textRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: doubleBaseMargin,
  },
  myAccountCell: {
    borderBottomWidth: 1,
    borderColor: borderGrey,
    backgroundColor: white,

    paddingHorizontal: marginHorizontal,
    paddingTop: marginHorizontal,
    paddingBottom: 10,
    minHeight: 61,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: smallMargin * 1.3,
  },
  arrow: { width: 10, height: 14, resizeMode: 'contain' },
  smallTextRow: { flexDirection: 'row' },
  smallViewRow: { flexDirection: 'row', marginTop: smallMargin * 0.8 },
  price: { marginLeft: 40 },
  total: { marginLeft: 37 },
  addressText: {
    maxWidth: 190,
  },
  arrow: { width: 10, height: 14, resizeMode: 'contain' },
  orderSubSections: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
    marginBottom: smallMargin * 1.5,
    marginTop: 24
  },
  myDetailsList: {
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: white,
  },
  deliveryStatusesWrapper: {
    borderRadius: 5,
    backgroundColor: white,
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  deliveryStatusSection: {
    display: 'flex',
    flexDirection: 'row'
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  btn: { marginTop: 0 },
  invoiceBtn: {
    backgroundColor: white,
    width: 123,
    height: 26,
    alignSelf: 'flex-end',
  },
  invoiceBtnText: { color: black, fontSize: size.small },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  repeatBtn: {
    width: 98,
    height: 26,
    backgroundColor: white,
    marginRight: baseMargin,
  },
  viewProductsBtn: {
    backgroundColor: lightGrey,
    width: 104,
    height: 26,
    marginTop: 5
  },
  viewProductsBtnText: {
    color: black,
    fontSize: size.small
  },
  unitSection: { marginLeft: globalPadding },
  text: { fontSize: size.regularPlus },
  dateSection: { alignItems: 'flex-end', flex: 1 },
  nameText: {
    flex: 1,
    flexDirection: 'row',
  },
  deliveryDayWrapper: {
    overflow: 'hidden',
  },
  deliveryDay: {
    width: 54,
    height: 32,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 15,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  deliveryLine: {
    width: 54,
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center'
  },
  dashedLine: {
    width: 2,
    height: '100%'
  },
  downArrow: {
    width: 13,
    height: 13,
    position: 'absolute',
    bottom: 10
  },
  deliveryAddressText: {
    marginTop: 5
  }
})
