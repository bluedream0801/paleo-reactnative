import { StyleSheet } from "react-native";

import { appFonts, appColors, appMetrics, fontStyles } from "../../theme";

const { size } = fontStyles;
const {
  smallMargin,
  baseMargin,
  globalPadding,
  screenWidth,
  IS_IOS,
} = appMetrics;
const {
  white,
  blackOpacity,
  lowOpacity,
  greenOpacity,
  whiteOpacity,
  lightGrey,
  blueOpacity,
  transparent,
  notifyBlue,
  borderGrey,
  headerBgColor,
  darkGrey,
  accountSettingGray,
} = appColors;

const imageWidth = 180;

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: white,
  },
  body: { flex: 1 },
  cell: {
    height: 150,
    flex: 1,

    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
    backgroundColor: white,
    borderBottomWidth: 1,
    borderBottomColor: borderGrey,
  },
  inner: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: 10,
    justifyContent: "space-between",

    flex: 1,
  },

  overlay: {
    width: screenWidth - 10,
    height: 128,
    paddingLeft: globalPadding,
    paddingTop: baseMargin * 0.7,
  },
  listStyle: {
    flex: 1,
    backgroundColor: white,
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
  addToCart: {
    position: 'absolute', 
    right: 0, 
    bottom: 1, 
    height: 54, 
    width: screenWidth - imageWidth, 
    borderColor: transparent,
  },
  ImgContainer: {
    overflow: "hidden",
    height: 150,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: imageWidth,
  },
  imgFadeContainer: {
    flex: 1,
    overflow: "hidden",
    height: 150,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  cellImg: {
    height: 149,
    resizeMode: "contain",
    borderWidth: 0,
    width: "101%",
  },
  rightContainer: {
    flex: 1,

    height: "100%",
    paddingTop: baseMargin,
    overflow: "visible",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  Unavailable: {
    width: "100%",
    height: 54,
    backgroundColor: lowOpacity,
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  notification: {
    width: "100%",
    height: 54,
    backgroundColor: blueOpacity,
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    zIndex: 7,
    right: 0,
    left: 0,
  },

  notAvailable: {
    width: 120,
    height: 34,
    backgroundColor: lowOpacity,
    position: "absolute",
    bottom: baseMargin,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  notAvailableImg: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    marginRight: smallMargin,
    paddingTop: IS_IOS ? 4 : 2,
  },
  notAvailableImgTag: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
  },
  bestseller: {
    right: 0,
    top: baseMargin,
    height: 15,

    justifyContent: "center",
    alignItems: "flex-end",

    backgroundColor: greenOpacity,
    borderWidth: 1,
    borderColor: whiteOpacity,
    alignSelf: "flex-end",
    paddingHorizontal: 9,

    overflow: "visible",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  badgeRadius: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: "hidden",

    marginRight: 3,
  },
  tabBar: {
    flexDirection: "row",
    paddingTop: 20,
    backgroundColor: lightGrey,
    opacity: 1,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tab: {
    backgroundColor: lightGrey,
    opacity: 1,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarTextStyle: {
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: appFonts.GTWalsheim_Regular,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    height: 35,
    marginTop: -14,
  },
  circle: {
    height: 16,
    width: 16,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: notifyBlue,
    alignItems: "center",
    borderRadius: 8,
    marginRight: baseMargin,
  },
  tick: {
    width: 8,
    height: 8,
    resizeMode: "contain",
    tintColor: notifyBlue,
  },
  margin: {},
  headingContainer: {
    height: 40,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingTop: 15,
    borderColor: borderGrey,
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  heart: {
    width: 19,
    height: 19,
    resizeMode: "contain",
    marginTop: -4,
    marginRight: -3,
  },
  tabBarUnderlineStyle: {
    backgroundColor: headerBgColor,
    height: 3,
    flex: 1,
  },
  tabStyle: {
    paddingHorizontal: 0,
    marginHorizontal: -10,

    borderWidth: 0,
  },
  ScrollableTabBar: {
    borderWidth: 0,
    height: 38,
  },
  leftText: {},

  whiteLin: {
    position: "absolute",
    width: "100%",
    height: 1,
    bottom: 0,
    backgroundColor: white,
  },
  twoMargin: {
    marginTop: 2,
  },
  foureMargin: {
    marginTop: 4,
    marginBottom: -2,
  },
  someMargin: {
    marginTop: 3,
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

  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: white,
  },
  taxRow: {
    flexDirection: "row",
  },
  pricesRow: {},
  redLine: {
    backgroundColor: darkGrey,
    width: 25,
    height: 1,
    position: "absolute",
    zIndex: 4,
    top: 6,
  },
  priceSubContainer: {},
  swipeGestureGuideView: {
    position: 'absolute',
    top: 30,
    width: '100%'
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: baseMargin,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: lightGrey,
    paddingLeft: 25,
    paddingRight: 25,
  },
});
