import { StyleSheet, Platform } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const {
  marginHorizontal,
  borderRadius,
  baseMargin,
  smallMargin,
  doubleBaseMargin,
} = appMetrics
const { white, borderGrey, circleBorder, darkGrey, blackOpacity } = appColors
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
    width: 75,
  },

  card: {
    width: 36,
    height: 17,
    resizeMode: 'contain',
    marginRight: 23,
  },
  inStorecard: {
    width: 44,
    height: 34,
    resizeMode: 'contain',
    marginRight: 23,
  },

  smalpeCard: { width: 31, height: 22, resizeMode: 'contain', marginRight: 23 },
  smallCard: { width: 21, height: 14, resizeMode: 'contain' },
  smallHeading: { marginBottom: baseMargin * 0.8 },
  newCard: { marginTop: baseMargin * 2.6 },
  arrow: { width: 10, height: 14, resizeMode: 'contain' },
  textMargin: { marginTop: 3 },
  cardImg: {
    width: 32,
    height: 32,
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: circleBorder,
  },
  orderBtn: {
    marginBottom: 30,
    marginTop: 0,
  },
  coloredCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 10,
    borderColor: darkGrey,
    marginRight: -4,
  },
  processingContainer: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  processingImg: {
    width: 143,
    height: 143,
    resizeMode: 'contain',
  },
  processHeading: {
    marginTop: smallMargin * 1.4,
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: baseMargin,
    backgroundColor: white,
  },
  forgotRestImg: {
    width: 109,
    height: 114,
    resizeMode: 'contain',
    marginTop: doubleBaseMargin * 1.5,
    marginLeft: 18,
  },
  successTitle: {
    marginTop: doubleBaseMargin * 0.6,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: borderGrey,
    marginBottom: doubleBaseMargin,
    marginTop: doubleBaseMargin,
  },
  containerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  minContainer: {
    flex: 0.4,
  },
  minLeftContainer: { flex: 1 },
  bottmSuccess: {
    width: '100%',
    marginVertical: doubleBaseMargin,
  },
  homeBtn: {
    marginBottom: doubleBaseMargin,
    alignSelf: 'flex-start',
  },
  success: {
    marginTop: doubleBaseMargin,
  },
  marginSmall: {
    marginTop: smallMargin * 0.6,
  },
  topMargin: {
    marginTop: 10,
  },
  storeSection: {},
  storeInner: {
    backgroundColor: white,
    paddingHorizontal: 10,
    paddingTop: 11,
    paddingBottom: 9,
  },
  tickRow: {
    flexDirection: 'row',
    flex: 1,
    paddingRight: 5,
  },
  tick: {
    width: 11,
    height: 9,
    resizeMode: 'contain',
    marginRight: 6,
    marginTop: 9,
  },
  tickDown: {
    width: 11,
    height: 9,
    resizeMode: 'contain',
    marginRight: 6,
    marginTop: 4,
  },
  storeText: {
    marginTop: 24,
    marginBottom: 6,
  },
  
  // Popup styles
  modalContain: {
    backgroundColor: blackOpacity,
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentStyle: {
    paddingHorizontal: 12,
  },
})
