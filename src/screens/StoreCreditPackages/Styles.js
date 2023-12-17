import { appColors, appMetrics, fontStyles } from '../../theme'
import { StyleSheet } from 'react-native'
const {
  baseMargin,
  globalPadding,
  doubleBaseMargin,
  smallMargin,
  marginHorizontal,
} = appMetrics
const { white, borderGrey, lightGreen, blackOpacity } = appColors
const { size } = fontStyles
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingHorizontal: baseMargin,
  },
  orderSection: { flex: 1 },
  balanceSection: { marginTop: doubleBaseMargin },
  orderSubSections: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: marginHorizontal * 2.4,

    alignItems: 'center',
    marginBottom: smallMargin * 1.5,
  },
  balanceText: {
    marginBottom: smallMargin * 1.5,
  },
  myDetailsList: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  myAccountCell: {
    height: 167,
    borderBottomWidth: 1,
    borderColor: borderGrey,

    alignItems: 'center',

    marginBottom: 33,
    backgroundColor: white,
    overflow: 'visible',
    marginTop: 15,
  },
  currentBlanceCell: {
    height: 53,

    backgroundColor: white,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: marginHorizontal,
  },
  btn: { marginTop: 0, width: 107 },
  text: { fontSize: size.regularPlus },
  margin: {
    marginLeft: smallMargin,
  },
  price: {
    marginTop: -25,
  },
  ///
  btn: { marginTop: 0 },
  text: { fontSize: size.regularPlus },
  cellHeaderRow: {
    flexDirection: 'row',
    height: 32,
    backgroundColor: lightGreen,
  },
  leftHeader: {
    width: 80,
  },
  rightHeader: {
    flex: 1,
    paddingRight: baseMargin,
  },

  savageMan: {
    width: 51,
    height: 57,
    resizeMode: 'contain',
    marginTop: -15,
    marginLeft: 12,
  },
  cellInnerRow: {
    flexDirection: 'row',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    borderWidth: 0,
    justifyContent: 'flex-end',
    marginTop: globalPadding,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: baseMargin,
  },
  textRowUpper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: baseMargin * 1.5,
  },
  tick: {
    width: 14,
    height: 10,
    resizeMode: 'contain',
  },
  crediSection: {
    alignItems: 'flex-end',
    marginRight: globalPadding * 1.1,
    marginTop: -4,
  },
  heading: {
    marginTop: baseMargin * 0.1,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    justifyContent: 'space-between',
  },
  bounce: {
    backgroundColor: white,
    borderRadius: 10,
    paddingHorizontal: smallMargin * 0.8,
    height: 22,
    paddingTop: smallMargin * 0.5,
  },
  info: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginLeft: smallMargin * 0.8,
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
