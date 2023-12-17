import { StyleSheet, Platform } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const {
  marginHorizontal,
  borderRadius,
  doubleBaseMargin,
  headerHeight,
} = appMetrics
const { white } = appColors
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
  },
  orderListContainer: {
    flex: 1,
  },
  defaultAddress: { flex: 1 },
  defaultHeading: {
    marginBottom: marginHorizontal,
  },
  heading: {
    marginBottom: marginHorizontal,
    marginTop: -250,
  },
  addBtn: {
    marginBottom: 15,
  },
  noAddress: {
    flex: 1,
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: marginHorizontal,
    marginBottom: 30,
    marginTop: doubleBaseMargin,
    position: 'absolute',
    left: 0,
    right: 0,
    top: headerHeight,
    bottom: 0,
  },
  addBtnUpper: {
    marginTop: marginHorizontal * 3,
  },
})
