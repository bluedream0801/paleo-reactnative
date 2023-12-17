import { StyleSheet, Platform } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const { marginHorizontal, borderRadius, baseMargin } = appMetrics
const { white, borderGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardList: {
    marginHorizontal: marginHorizontal,
    borderRadius: borderRadius,

    overflow: 'hidden',
    marginTop: baseMargin * 1.5,
    flex: 1,
  },
  orderListContainer: { borderWidth: 0 },
  cardCell: {
    borderBottomWidth: 1,
    borderColor: borderGrey,
    alignItems: 'center',
    paddingLeft: marginHorizontal * 1.6,
    paddingRight: marginHorizontal,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: white,
    height: 50,
    borderRadius: borderRadius,
  },
  delete: { width: 14, height: 18, resizeMode: 'contain' },
  smallRow: { flexDirection: 'row', alignItems: 'center' },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: baseMargin * 2.4,
    justifyContent: 'space-between',
    width: 50,
  },

  card: {
    width: 36,
    height: 17,
    resizeMode: 'contain',
    marginRight: 23,
  },

  smalpeCard: { width: 31, height: 22, resizeMode: 'contain', marginRight: 23 },
  smallCard: { width: 21, height: 14, resizeMode: 'contain' },
  smallHeading: { marginBottom: baseMargin * 0.8 },
  newCard: { marginTop: baseMargin * 2.6 },
  arrow: { width: 10, height: 14, resizeMode: 'contain' },
  textMargin: { marginTop: 3 },
})
