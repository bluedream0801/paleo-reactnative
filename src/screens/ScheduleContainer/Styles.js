import { StyleSheet } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const { doubleBaseMargin, baseMargin, marginHorizontal, lightGrey } = appMetrics
const { white, blackOpacity, borderGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGrey,
  },
  inputCustomStyles: {
    marginTop: 20,
  },
  innerContainer: {
    width: '100%',
    alignSelf: 'center',

    alignItems: 'center',

    backgroundColor: white,
    paddingVertical: doubleBaseMargin,
    paddingHorizontal: baseMargin,
  },
  innerOfferContainer: {
    alignSelf: 'center',

    alignItems: 'center',

    paddingTop: 0,
    paddingBottom: baseMargin * 1.5,
    paddingHorizontal: baseMargin,
  },

  contentMargin: {
    height: '100%',
    width: '100%',
  },
  heading: {
    marginHorizontal: baseMargin,
    marginBottom: baseMargin,
    marginTop: doubleBaseMargin,
  },

  pickupText: { marginBottom: baseMargin },
  body: {},

  myAccountCell: {
    height: 50,

    borderColor: borderGrey,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: marginHorizontal,
  },
  arrow: { width: 10, height: 14, resizeMode: 'contain' },
  myDetailsList: {
    backgroundColor: white,

    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  selectDayContainer: {
    backgroundColor: white,

    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: baseMargin,
  },
  whiteContainer: {
    backgroundColor: white,
    padding: baseMargin,
  },
  greyContainer: {
    backgroundColor: lightGrey,
    borderRadius: 4,
    borderColor: borderGrey,
  },
  pickupContainer: {
    paddingHorizontal: marginHorizontal,
  },
  requestBtn: {
    width: '95%',
    alignSelf: 'center',

    marginTop: doubleBaseMargin * 2.5,
  },
  inputViewStyle: {
    height: 110,
    marginTop: 0,
  },
  customStyles: {
    height: 110,
    marginTop: 0,
  },
  inputStyle: {
    textAlignVertical: 'top',
    paddingTop: 10,
    height: 110,
  },
  avodingView: {},
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: baseMargin,
    backgroundColor: white,
  },
  forgotRestImg: {
    width: 79,
    height: 83,
    resizeMode: 'contain',
    marginTop: doubleBaseMargin * 1.5,
    marginLeft: 18,
  },
  successTitle: { marginTop: doubleBaseMargin },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: borderGrey,
    marginVertical: doubleBaseMargin,
  },
  containerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  minContainer: {
    flex: 1,
  },
  minLeftContainer: { flex: 1, alignItems: 'center' },
  bottmSuccess: {
    width: '100%',
    marginVertical: doubleBaseMargin,
  },
  minWidh: {
    width: 78,
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
