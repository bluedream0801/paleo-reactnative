import { StyleSheet } from "react-native";

import { appFonts, appColors, appMetrics } from "../../theme";
const { smallMargin } = appMetrics;
export default styles = StyleSheet.create({
  container: {
    width: "100%",
    color: appColors.grey,
  },
  label: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    color: appColors.inputLabel,
  },
  inputView: {
    borderRadius: 4,
    width: "100%",
    borderWidth: 0.8,
    borderColor: appColors.borderGrey,
    marginTop: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: appColors.lightGrey,
  },
  input: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    paddingLeft: 10,
    color: "black",
    width: "90%",
  },
  passwordView: {
    // width: '10%',
    alignItems: "center",
    marginRight: 15,
  },
  passwordImg: {
    height: 26,
    width: 26,
  },
  labelRow: {
    flexDirection: "row",
  },
  labelIconStyle: {
    width: 14,
    height: 14,
    resizeMode: "contain",
    marginLeft: smallMargin,
    marginTop: smallMargin * 0.5,
  },
});
