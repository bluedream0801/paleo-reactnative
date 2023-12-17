import { appFonts, appColors, appMetrics, fontStyles } from "../../theme";
import { StyleSheet, Platform } from "react-native";
const { size } = fontStyles;
const {
  marginHorizontal,
  smallMargin,
  doubleBaseMargin,
  baseMargin,
  globalPadding,
  screenWidth,
  IS_IOS,
} = appMetrics;
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
  disabledItem,
  buttonOpacity,
  combineGreen,
  combineGrey,
} = appColors;
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    overflow: "visible",
  },

  bodyMultiple: {
    flex: 1
  },

  listStyle: {
    marginHorizontal: baseMargin,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 15,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  bottomlistStyle: {
    marginHorizontal: baseMargin,
    borderRadius: 5,
    overflow: "hidden",
  },
  cell: {
    height: 65,
    backgroundColor: white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: borderGrey,
    overflow: "hidden",
    paddingRight: baseMargin,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    flex: 1,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  trashIcon: {
    width: 12,
    height: 13,
    resizeMode: 'contain'
  },
  imgContainer: {
    height: 65,
    width: 75,
  },
  favouries: {
    width: 75,
    height: 65,
    resizeMode: "contain",
  },
  textContainer: {
    height: 45,
    marginLeft: baseMargin,
    justifyContent: "space-between",

    marginTop: 2,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: cartGrey,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: globalPadding,
  },

  addImg: {
    width: 33,
    height: 28,
    resizeMode: "contain",
  },
  endRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 80,
  },

  cartContainerMultiple: {
    width: 156,
    alignSelf: "flex-end",

    marginTop: 21,
    paddingRight: baseMargin,
  },
  cartTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
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

    marginLeft: -2,
  },
  notQuestionImg: {
    width: 14,
    height: 14,
    marginTop: -2,
    marginLeft: 2,
  },
  questionRow: {
    flexDirection: "row",
  },
  chatSection: {
    height: 32,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: borderGrey,
    flexDirection: "row",
    marginTop: doubleBaseMargin,
    marginHorizontal: 10,

    marginBottom: 15,
  },
  smallChat: {
    width: 25,
    height: 20,
    resizeMode: "contain",
  },
  helpText: {
    marginHorizontal: marginHorizontal,
  },
  checkoutBtn: {
    backgroundColor: quantityGreen,
    width: "95%",
    alignSelf: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  topText: {
    alignSelf: "center",
  },
  progress: {
    width: "95%",
    height: 3,
    backgroundColor: progress,
    alignSelf: "center",
    marginTop: 10,
  },
  progressOrange: {
    backgroundColor: progressOrange,
    height: 3,
    width: "80%",
  },
  changeAdress: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 19,
    marginBottom: 7,
    marginTop: 26,
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
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  removeButton: {
    width: 75,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: darkGrey,

    flexDirection: "row",
  },
  rowBack: {
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  minOrderSection: {
    height: 54,
    width: "95%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: lowRedOpacity,
    alignItems: "center",
  },

  redProgress: {
    width: "100%",
    height: 3,
    backgroundColor: lightRedProgress,
    alignSelf: "center",
    marginTop: 10,
    position: "absolute",
    bottom: 0,
  },

  lightProgress: {
    backgroundColor: redProgress,
    height: 3,
    width: "80%",
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
  itemName: {
    width: screenWidth - 190,
  },
  emptyContainer: {
    marginHorizontal: baseMargin,
    justifyContent: "flex-start",
    marginTop: 10,
    flex: 1,
    flexDirection: 'row',
  },
  emptyText: {
    color: "#979797",
    marginLeft: 5,
  },
  disabledOverLay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: disabledItem,
    opacity: 0.3
  },
  // Multiple Deliveries Styles
  headerRowMultiple: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingBottom: 10
  },
  headerRowSingle: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingBottom: 5,
    paddingTop: 5
  },
  headerRowOuter: {
    marginBottom: 10,
  },
  selectTime: {
    flex: 1,

    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  selectTimeOuter: {
    flex: 1,

    justifyContent: "flex-end",
    alignItems: "center",
  },
  selectAddress: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerSection: {
    flex: 1,
    width: "100%",
    alignItems: "center"
  },
  line: {
    height: 20,
    width: 1,
    backgroundColor: borderGrey,
    marginLeft: 8,
    marginRight: 8,
  },
  arrow: {
    width: 12.5,
    height: 11.76,
    resizeMode: "contain",
    marginLeft: 6,
  },
  favouriesMultiple: {
    width: 75,
    height: 65,
    resizeMode: "contain",
    position: "relative",
  },
  textContainerMultiple: {
    height: 45,
    marginLeft: baseMargin,
    justifyContent: "space-between",
    marginTop: 2,
    flex: 1,
    borderRightWidth: 0,
    marginRight: 10,
    paddingRight: 10,
  },
  timeWidth: {
    minWidth: 112,
    textAlign: "center",
  },
  addressWidth: {
    minWidth: 97,
    textAlign: "center",
    maxWidth: 140,
  },
  cartContainer: {
    width: 156,
    alignSelf: "flex-end",

    paddingRight: baseMargin,
    marginTop: 10,
    flex: 1,
  },

  vatQuestionImg: {
    width: 14,
    height: 14,
    marginTop: -1,
    marginLeft: 2,
  },
  delivertQuestionImg: {
    width: 14,
    height: 14,

    marginLeft: 2,
  },
  chatSection: {
    height: 32,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: borderGrey,
    flexDirection: "row",
    marginTop: doubleBaseMargin,
    marginHorizontal: 10,

    marginBottom: 15,
  },
  smallChat: {
    width: 25,
    height: 20,
    resizeMode: "contain",
  },
  helpText: {
    marginHorizontal: marginHorizontal,
  },
  checkoutBtn: {
    backgroundColor: quantityGreen,
    width: "95%",
    alignSelf: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  topText: {
    alignSelf: "center",
  },
  topTextSaved: {
    alignSelf: "center",
    marginBottom: 10,
  },
  progress: {
    width: "95%",
    height: 3,
    backgroundColor: progress,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  progressOrange: {
    backgroundColor: progressOrange,
    height: 3,
  },
  minOrderSection: {
    height: 54,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: lowRedOpacity,
    alignItems: "center",
    marginBottom: 10,
  },

  noAavailablelistStyle: {
    maxHeight: 292,

    borderRadius: 5,
    overflow: "hidden",
  },
  noAavailableContainlistStyle: {
    maxHeight: 292,
    flex: 1,
    overflow: "hidden",
    borderRadius: 5,
    marginHorizontal: baseMargin,
  },

  notAvailableContainer: {
    marginTop: -32,
  },
  togetherContainer: {
    backgroundColor: combineGreen,
    height: 35,
    paddingLeft: 13,
    paddingRight: 11,
    borderRadius: 16,
    marginTop: 0,
  },
  togetherGreyContainer: {
    backgroundColor: combineGrey,
    height: 35,
    paddingLeft: 13,
    paddingRight: 11,
    borderRadius: 16,
    marginBottom: 0,
    marginTop: 0,
  },
  selectButton: {
    height: 35,
    paddingLeft: 13,
    paddingRight: 11,
    borderRadius: 16,
  },
  deliveredTogether: {
    marginTop: 5
  },
  progressWarning: {
    width: "100%",
    height: 3,
    backgroundColor: progress,
    alignSelf: "center",
    marginTop: 10,
  },
  progressOrangeWarning: {
    backgroundColor: progressOrange,
    height: 3,
    width: "80%",
  },
  minOrderSectionWarning: {
    width: "100%",
    alignSelf: 'center',
    marginTop: 15
  },
  listSectionStyle: {
    marginHorizontal: baseMargin,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 15,
    flex: 1,
  },
  mtoImg: {
    width: 18,
    height: 18,
    position: "absolute",
    left: 4,
    bottom: 4,
    paddingTop: IS_IOS ? 4 : 2,
  },

  // Single Delivery Day styles
  headerRow: {
    flexDirection: "row",
    alignItems: "center",

    height: 30,
  },

  headerMargin: {
    marginBottom: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  freshMeals: {
    width: 25,
    height: 25,
    resizeMode: "contain",
    marginLeft: 5,
  },

  minOrderSectionMeals: {
    height: 54,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: lowRedOpacity,
    alignItems: "center",
    marginTop: 0,
    marginBottom: 10,
  },

  sectionFooterStyle: {

  },

  combinedMinOrderWarningContainer: {
    flexDirection: 'row',
    marginTop: 17,
  },

  minOrderWarningIcon: {
    width: 23.83,
    height: 20,
    marginRight: 12
  },

  minOrderWarningTooltipIcon: {
    width: 14.3,
    height: 12,
    resizeMode: 'contain'
  },

  singleDayWarningsContainer: {
    marginHorizontal: 10
  },
  
  expendedDetails: {
    padding: baseMargin,
    backgroundColor: white,
    borderColor: borderGrey,
  },
  
  marginBottom: {
    marginBottom: 6,
  },
});
