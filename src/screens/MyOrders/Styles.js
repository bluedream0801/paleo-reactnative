import { StyleSheet } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const { marginHorizontal, borderRadius, doubleBaseMargin } = appMetrics
const {} = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderList: {
    marginHorizontal: marginHorizontal,
    borderRadius: borderRadius,
    flex: 1,
    overflow: 'hidden',
  },
  orderListContainer: {
    flex: 1,
  },
  noOrder: {
    marginTop: doubleBaseMargin * 2,
  },
})
