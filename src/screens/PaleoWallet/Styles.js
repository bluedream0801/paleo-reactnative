import { appColors, appMetrics, fontStyles } from '../../theme'
import { StyleSheet, Platform } from 'react-native'
const {
  baseMargin,
  borderRadius,
  globalPadding,
  doubleBaseMargin,
  smallMargin,
  marginHorizontal,
} = appMetrics
const { white, lightGrey, borderGrey } = appColors
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
    backgroundColor: white,

    borderRadius: 5,
    overflow: 'hidden',
  },
  myAccountCell: {
    height: 64,
    borderBottomWidth: 1,
    borderColor: borderGrey,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: marginHorizontal,
  },
  currentBlanceCell: {
    height: 53,

    backgroundColor: white,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: marginHorizontal,
  },
  btn: { marginTop: 0 },
  text: { fontSize: size.regularPlus },
  margin: {
    marginBottom: smallMargin,
  },
  price: {
    marginTop: 5,
  },
})
