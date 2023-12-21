import { StyleSheet } from "react-native";
import { appColors } from "../../theme";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: appColors.white
  },
  mainContent: {
    flexGrow: 1,
    alignItems: 'center'
  },
  imageLogo: {
    width: 152,
    height: 154.5,
    marginTop: 107
  },
  textTitle: {
    marginTop: 22,
    color: appColors.black,
  },
  textDescription: {
    marginTop: 23,
    color: appColors.darkGray,
    textAlign: 'center'
  },
  textUnerline: {
    color: appColors.darkGray,
    textDecorationLine: 'underline'
  },
  textNotice: {
    marginTop: 16,
    marginBottom: 61,
    color: appColors.darkGray,
    textAlign: 'center',
  },
  btnContinue: {

  }
})