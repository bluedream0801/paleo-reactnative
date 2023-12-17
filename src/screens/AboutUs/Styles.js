import { appColors } from "../../theme";
import { StyleSheet, Dimensions } from "react-native";
const {
  white,
  accountSettingGray,
  lessDarkGray,
  foodRed,
  lightGrey,
  blackOpacity,
} = appColors;

const windowWidth = Dimensions.get('window').width;

export default styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContent: {
    backgroundColor: appColors.white
  },
  missionSection: {
    position: "relative",
  },
  mission: {
    width: "100%",
    height: 500,
  },
  textView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 15,
  },
  description: {
    color: white,
  },
  title: {
    color: white,
    marginBottom: 10,
  },
  subTitle: {
    color: white,
    marginBottom: 10,
  },
  secondSection: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  secondSectionText: {
    color: accountSettingGray,
    marginBottom: 10,
  },
  promiseSectionTitle: {
    textAlign: "center",
    color: lessDarkGray,
    marginBottom: 30,
  },
  promiseSectionTitleFood: {
    textTransform: "uppercase",
    color: foodRed,
  },
  promiseScrollTab: {
    height: 525,
    width: "100%",
  },
  promiseSlide: {
    position: "relative",
  },
  promiseSlideImage: {
    height: "100%",
    width: windowWidth - 20,
  },
  promiseTitle: {
    color: white,
    marginBottom: 10,
  },
  promiseDescription: {
    color: white,
    marginBottom: 10,
  },
  noThanksSection: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  noThanksTop: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  noThanksTitle: {
    color: lessDarkGray,
    marginBottom: 6,
  },
  noThanksSubTitle: {
    color: accountSettingGray,
  },
  noThanks: {
    width: 136,
    height: 136,
    alignSelf: "center",
  },
  noThanksTable: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  noThanksFooter: {
    borderRadius: 10,
    backgroundColor: lightGrey,
    width: "100%",
    padding: 15,
    marginTop: 40,
    flexDirection: "row",
  },
  noThanksFooterItem: {
    width: "100%",
    flex: 1,
  },
  noThanksFooterText: {
    color: lessDarkGray,
    marginTop: 11,
    textAlign: "center",
  },
  noThanksFooterImage: {
    height: 67,
    alignSelf: "center",
  },
});
