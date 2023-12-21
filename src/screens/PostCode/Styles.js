import { StyleSheet, Platform } from "react-native";

import { appFonts, appColors } from "../../theme";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.transparent,
  },
  body: {
    width: "95%",
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    backgroundColor: appColors.white,
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  header: {
    backgroundColor: "red",
  },
  forgotText: {
    marginTop: 20,
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    color: appColors.green,
  },
  signupText: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    color: appColors.darkGray,
  },
  footer: {
    width: "100%",
    backgroundColor: appColors.lightGrey,
    height: Platform.OS == "ios" ? 80 : 70,
    alignItems: "center",
    justifyContent: "center",
  },
  bgImg: {
    width: "100%",
    height: "100%",
    backgroundColor: appColors.black,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationRow: {
    flexDirection: "row",
    marginTop: 25,
    alignItems: 'center'
  },
  location: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    marginRight: 10,
  },
  codeInput: {
    textAlign: "center",
    backgroundColor: appColors.white,
  },
  inputViewStyle: {
    backgroundColor: appColors.white,
    marginTop: -6,
  },
  heading: {
    marginBottom: 5,
    marginTop: 10,
  },
});
