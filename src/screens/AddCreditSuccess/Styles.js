import { appFonts, appColors, appMetrics, fontStyles } from '../../theme'
import { StyleSheet, Platform } from 'react-native'
const { size } = fontStyles
const {
  marginHorizontal,
  smallMargin,
  doubleBaseMargin,
  baseMargin,
  globalPadding,
  screenWidth,
} = appMetrics
const {
  lowOpacity,
  borderGrey,
  white,
  headerBgColor,
  lightGrey,
  whiteLowOpacity,
  cartGrey,
  quantityGreen,
  progress,
  progressOrange,
  blackOpacity,
  darkGrey,
  lowRedOpacity,
  redProgress,
  lightRedProgress,
  accountSettingGray,
  addressGrey,
  notifyGreen,
  paymentLightBlue,
  blueOpacity,
} = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },

  listStyle: {
    marginHorizontal: baseMargin,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 15,
  },
  bottomlistStyle: {
    marginHorizontal: baseMargin,
    borderRadius: 5,
    overflow: 'hidden',
  },
  cell: {
    height: 65,
    backgroundColor: white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: borderGrey,
    overflow: 'hidden',
    paddingRight: baseMargin,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
  },
  imgContainer: {
    height: 65,
    width: 75,
  },
  favouries: {
    width: 75,
    height: 65,
    resizeMode: 'contain',
  },
  textContainer: {
    height: 45,
    marginLeft: baseMargin,
    justifyContent: 'space-between',

    marginTop: 2,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: cartGrey,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: globalPadding,
  },

  addImg: {
    width: 33,
    height: 28,
    resizeMode: 'contain',
  },
  endRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cartContainer: {
    width: 185,
    alignSelf: 'flex-end',

    paddingRight: baseMargin,
    backgroundColor: white,
    marginTop: 12,
  },
  cartMainContainer: {
    backgroundColor: white,
    paddingBottom: 15,

    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
  },
  cartTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  furstCartTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionImg: {
    width: 14,
    height: 14,
  },
  vatQuestionImg: {
    width: 14,
    height: 14,
    marginTop: -1,
    marginLeft: 1,
  },

  delivertQuestionImg: {
    width: 14,
    height: 14,

    marginLeft: 2,
  },
  notQuestionImg: {
    width: 14,
    height: 14,
    marginTop: -2,
    marginLeft: 2,
  },
  questionRow: {
    flexDirection: 'row',
  },
  chatSection: {
    height: 32,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: borderGrey,
    flexDirection: 'row',
    marginTop: doubleBaseMargin,
    marginHorizontal: 10,

    marginBottom: 20,
  },
  errorChatSection: {
    height: 32,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: borderGrey,
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 10,

    marginBottom: 20,
    width: '100%',
  },
  smallChat: {
    width: 25,
    height: 20,
    resizeMode: 'contain',
  },
  helpText: {
    marginHorizontal: marginHorizontal,
  },
  checkoutBtn: {
    backgroundColor: quantityGreen,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  topText: {
    alignSelf: 'center',
  },
  progress: {
    width: '95%',
    height: 3,
    backgroundColor: progress,
    alignSelf: 'center',
    marginTop: 10,
  },
  progressOrange: {
    backgroundColor: progressOrange,
    height: 3,
    width: '80%',
  },
  changeAdress: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    height: 19,
    marginBottom: 7,
  },

  removeItem: {
    marginLeft: 10,
    marginTop: 10,
  },
  margin: {
    marginRight: 2,
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
  removeButton: {
    width: 75,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkGrey,

    flexDirection: 'row',
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  minOrderSection: {
    height: 54,
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: lowRedOpacity,
    alignItems: 'center',
  },

  redProgress: {
    width: '100%',
    height: 3,
    backgroundColor: lightRedProgress,
    alignSelf: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 0,
  },

  lightProgress: {
    backgroundColor: redProgress,
    height: 3,
    width: '80%',
  },
  amountText: {
    marginRight: 8,
  },
  titleStyle: {
    color: darkGrey,
    fontSize: 16,
  },
  title: {
    color: accountSettingGray,
  },

  contentStyle: {
    paddingHorizontal: 12,
  },
  timeContainer: {
    backgroundColor: white,
    borderRadius: 5,
    flexDirection: 'row',
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: globalPadding,
  },
  addressContainer: {
    backgroundColor: white,

    flexDirection: 'row',
    height: 50,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    borderBottomWidth: 1,
    borderColor: borderGrey,
  },

  multiAddressContainer: {
    backgroundColor: white,

    flexDirection: 'row',

    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 14,
    borderBottomWidth: 1,
    borderColor: borderGrey,
    overflow: 'hidden',
  },
  paymentRow: {
    backgroundColor: white,

    flexDirection: 'row',
    height: 50,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: globalPadding,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderColor: borderGrey,
  },
  ///
  clockImg: {
    width: 17,
    height: 17,
    resizeMode: 'contain',
    marginRight: 10,
  },
  clockTopImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 9,
  },
  locationImg: {
    width: 22,
    height: 18,
    resizeMode: 'contain',
    marginRight: 7,
    marginLeft: -1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
   
    flex:1
  },
  multiAddRow: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 10,
    overflow: 'hidden',
    flex: 1,
  },
  arrowImg: {
    width: 12,
    height: 14,
    resizeMode: 'contain',
  },
  padding: {
    paddingHorizontal: 10,
    marginTop: 24,
  },
  multiContainer: {
    paddingHorizontal: 10,
  },
  firstpadding: {
    paddingHorizontal: 10,
  },
  smallHeading: {
    paddingBottom: 6,
  },
  Input: {
    height: 71,
    backgroundColor: white,
    borderWidth: 0,
    marginTop: 0,
    textAlignVertical: 'top',
    paddingTop: 8,
    lineHeight: 17,
    fontSize: 13,

    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  InputView: {
    height: 71,
    backgroundColor: white,
    borderWidth: 0,
    marginTop: 0,
    textAlignVertical: 'top',
    paddingTop: 0,
  },

  cardImg: {
    width: 22,
    height: 15,
    resizeMode: 'contain',
    marginRight: 11,
  },
  addressCell: {
    width: 130,
    height: 126,
    borderWidth: 0,
    paddingTop: 9,
  },
  dayCell: {
    width: 54,
    height: 32,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: borderGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  dateText: {
    marginTop: 6,
  },
  topDistance: {
    marginTop: 5,
  },
  lineDottedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dottedLine: {
    width: 76,
    height: 1,
  },
  absoluteArrowImg: {
    width: 5,
    height: 7,
    resizeMode: 'contain',
  },
  arrowContainer: {
    width: 13,
    height: 13,
    backgroundColor: white,
    position: 'absolute',
    right: 7,
    top: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: { flex: 1 },
  greenNotify: {
    backgroundColor: notifyGreen,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  voucherCode: {
    flexDirection: 'row',
    paddingLeft: baseMargin,
    marginTop: 10,
  },
  voucherMargin: {
    marginTop: 4,
  },
  vocherInner: {
    marginLeft: globalPadding,
  },
  successContainer: {
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
  success: {
    marginTop: doubleBaseMargin,
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
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  widthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  minContainer: {},
  marginSmall: {
    marginTop: smallMargin,
  },
  minLeftContainer: {},
  homeBtn: {
    marginBottom: doubleBaseMargin,
    alignSelf: 'flex-start',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginTop: 0,
    marginBottom: 20,
  },
  successMain: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 6,
    backgroundColor: lightGrey,
  },
  shipping: {
    backgroundColor: paymentLightBlue,
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  topPadding: {
    marginTop: 15,
  },
  shippingAddress: {
    marginTop: 15,
  },
  addCreditRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  creditBtn: {
    height: 26,
    marginTop: 0,

    marginRight: 15,
  },
  textBtnStyle: {
    fontSize: 12,
  },

  crediWllateImg: {
    height: 22,
    width: 26,
    resizeMode: 'contain',

    marginLeft: -3,
    marginRight: 9,
  },

  crediWllateImgThird: {
    height: 24,
    width: 28,
    resizeMode: 'stretch',

    marginLeft: -3,
    marginTop: -3,
    marginRight: 8,
  },
  blueLayout: {
    backgroundColor: blueOpacity,
    height: 127,
    borderRadius: 5,
    justifyContent: 'space-between',
    paddingLeft: globalPadding,
    marginTop: 17,
    paddingVertical: globalPadding,
  },
  messageChat: {
    alignSelf: 'center',
  },
  messageChatMargin: {
    marginTop: 20,
  },
  errorInnerText: {
    marginTop: 3,
  },
  fixedTopNargin: {
    marginTop: -3,
  },
  flexText:{
    flex:1
  }
})
