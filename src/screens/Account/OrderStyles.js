import { StyleSheet, Platform } from 'react-native'
import { appFonts, appColors, appMetrics } from '../../theme'

const { marginHorizontal, globalPadding } = appMetrics
const { lightGreen, borderGrey } = appColors

export default styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    height: 64,
    borderColor: borderGrey,
  },
  orderSection: {
    justifyContent: 'space-between',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: marginHorizontal,
  },
  greenContainer: {
    height: 22,
    borderRadius: 11,
    backgroundColor: lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: marginHorizontal,
  },
  priceLine: {
    marginTop: 5,
  },
})
