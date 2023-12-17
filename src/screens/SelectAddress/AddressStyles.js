import { StyleSheet } from "react-native";
import { appColors, appMetrics } from "../../theme";

const { marginHorizontal, smallMargin } = appMetrics;
const { borderGrey, white, addressGrey } = appColors;

export default styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,

    borderColor: borderGrey,
    backgroundColor: white,
    flex: 1,
  },
  orderSection: {
    justifyContent: "center",
    paddingHorizontal: marginHorizontal * 1.5,
    paddingVertical: 12,
  },

  textRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: smallMargin * 1.3,
  },
  delete: { width: 14, height: 18, resizeMode: "contain" },
  smallTextRow: { flexDirection: "row" },
  smallViewRow: {
    flexDirection: "row",
    marginTop: smallMargin * 2,
    justifyContent: "space-between",
    width: "100%",
  },
  price: { marginLeft: 40, marginTop: 1 },
  total: { marginLeft: 37 },
  flexText: {
    flex: 1,
  },
  disabledText: {
    textDecorationLine: "line-through",
  },
  line: {
    backgroundColor: addressGrey,
    height: 1,
    position: "absolute",
    width: 239,
    top: 23,
    left: 15,
  },
});
