import { StyleSheet } from "react-native";

import { appFonts, appColors, appMetrics } from "../../theme";

const { smallMargin, baseMargin, marginHorizontal } = appMetrics;
const { white, borderGrey } = appColors;

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: { flex: 1 },
  headerCell: {
    marginBottom: 10,
  },
  headerImg: {
    height: 356,
    resizeMode: "contain",
    width: "100%",
    marginBottom: smallMargin,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  headerOverlay: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  headerText: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  allLabel: {
    marginTop: 29,
    marginBottom: 6,
    marginLeft: 10,
  },
  cell: {
    height: 202,
    flex: 1,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: baseMargin,
    borderWidth: 0,
  },
  cellImg: {
    height: 99,
    resizeMode: "contain",
    width: "100%",
    marginBottom: smallMargin,
  },
  cellText: {
    fontFamily: appFonts.GT_Walsheim_Pro_Medium_Regular,
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  cellTitle: {
    marginBottom: 5,
  },
  listStyle: {
    flex: 1,
    paddingHorizontal: baseMargin,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,

    flex: 1,
  },
  imgContainer: {
    height: 65,
    width: 75,
  },
  favorites: {
    width: 75,
    height: 65,
    resizeMode: "contain",
  },
  productCell: {
    height: 65,
    backgroundColor: white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: borderGrey,
    overflow: "hidden",
    marginHorizontal: marginHorizontal,
  },
  listBody: {
    marginBottom: 10,
  },
  textContainer: {
    height: 48,
    marginLeft: baseMargin,
    justifyContent: "space-between",
    flex: 1,
    marginRight: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  productName: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  price: {
    marginLeft: 10,
  },
  commentFooter: {
    paddingTop: 7,
    paddingBottom: 20,
    paddingRight: 15,
    marginHorizontal: marginHorizontal,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentDetails: {
    marginLeft: 26,
    marginTop: 7,
  },
  commentImg: {
    width: 17,
    height: 14,
    marginRight: 7,
  },
  arrowImg: {
    width: 9,
    height: 6,
    marginLeft: 10,
  },
});
