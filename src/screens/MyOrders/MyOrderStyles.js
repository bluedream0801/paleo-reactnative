import { StyleSheet } from 'react-native'
import { appColors, appMetrics } from '../../theme'

const { marginHorizontal, smallMargin } = appMetrics
const { lightGreen, borderGrey, white } = appColors

export default styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    height: 103,
    borderColor: borderGrey,
    backgroundColor: white,
  },
  orderSection: {
    height: 103,

    alignItems: 'center',
    paddingHorizontal: marginHorizontal,
    justifyContent: 'center',
  },
  greenContainer: {
    height: 22,
    borderRadius: 11,
    backgroundColor: lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: marginHorizontal,
  },
  textRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: smallMargin * 1.3,
  },
  arrow: { width: 10, height: 14, resizeMode: 'contain' },
  smallTextRow: {
    justifyContent: 'space-between',
  },
  smallViewRow: {
    marginTop: smallMargin * 0.8,
    justifyContent: 'space-between',
  },
  price: { marginLeft: 40, marginTop: 1 },
  total: { marginLeft: 40 },
  innerTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
