import { appFonts, appColors, appMetrics, fontStyles } from "../../theme";
import { StyleSheet, Platform } from "react-native";
const { doubleBaseMargin, baseMargin } = appMetrics;
const { black, borderGrey, white, surveyText, selectedText } = appColors;

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  successContainer: {
    alignItems: "center",
    padding: doubleBaseMargin,
    backgroundColor: white,
    fontFamily: appFonts.GTWalsheim_Regular,
  },
  successBody: {
    flexDirection: "row",
    width: "100%",
    padding: doubleBaseMargin,
  },
  textBody: {
    flex: 1,
    fontSize: 27,
  },
  successTitle: {
    marginTop: baseMargin * 0.6,
    fontSize: 15,
  },
  successIC: {
    width: 71,
    height: 71,
    marginRight: doubleBaseMargin * 1.6,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: borderGrey,
    marginBottom: doubleBaseMargin,
    marginTop: doubleBaseMargin,
  },
  surveyContainer: {
    borderRadius: 20,
    backgroundColor: appColors.lightGrey,
    padding: doubleBaseMargin,
    width: "100%",
  },
  surveyBody: {
    flexDirection: "row",
    width: "100%",
    marginBottom: baseMargin,
  },
  surveyImg: {
    width: 66,
    height: 57,
  },
  surveyTitle: {
    flex: 1,
  },
  surveyQuestion: {
    marginTop: doubleBaseMargin,
  },
  hearFromInput: {
    backgroundColor: white,
    color: surveyText,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  dobContainer: {
    marginTop: 10,
  },
  answerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  answerBtn: {
    borderWidth: 1,
    backgroundColor: white,
    borderColor: surveyText,
    height: 24,
    marginTop: 8,
    borderRadius: 4,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginRight: 12,
  },
  answerBtnText: {
    color: surveyText,
    fontSize: 11,
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
  },
  selectedBtn: {
    borderWidth: 2,
    borderColor: selectedText,
  },
  selectedBtnText: {
    color: selectedText,
  },
  mark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  selectedMark: {
    borderWidth: 2,
    borderColor: selectedText,
  },
  submitBtn: {
    backgroundColor: surveyText,
    color: white,
    width: "100%",
    justifyContent: "center",
  },
  thanksContainer: {
    // height: "100%",
    flex: 1,
    padding: doubleBaseMargin,
  },
  thanksBody: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  logoThanks: {
    width: 134,
    height: 121,
    marginLeft: 25,
  },
  thanksTitle: {
    fontSize: 32,
    marginTop: 26,
    marginBottom: 20,
  },
  thanksNote: {
    textAlign: "center",
  },
  takeHomeBtn: {
    backgroundColor: black,
    color: white,
    width: "100%",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: doubleBaseMargin,
  },
  shareImg: {
    width: 66,
    height: 57,
    marginRight: 10,
  },
  shareBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: baseMargin * 2,
  },
  shareBtnImage: {
    width: 45,
    height: 45,
    marginRight: baseMargin * 3,
  },
  shareBtnTextContainer: {
    color: selectedText,
    borderWidth: 1,
    borderColor: selectedText,
    padding: baseMargin,
    borderRadius: 4,
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  shareBtnText: {
    color: selectedText,
    flex: 1,
  },
  shareBtnGotoIcon: {
    width: 12,
    height: 12,
  },
  noThanksBtn: {
    backgroundColor: black,
    color: white,
    width: "100%",
    justifyContent: "center",
    borderRadius: 0,
  },
  inviteContainer: {
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
  inviteBody: {
    borderRadius: 20,
    backgroundColor: appColors.lightGrey,
    padding: doubleBaseMargin,
    alignItems: "center",
  },
  inviteImg: {
    width: 79,
    height: 60,
    marginTop: doubleBaseMargin,
  },
  inviteCard: {
    backgroundColor: appColors.headerBgColor,
    color: white,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: doubleBaseMargin * 1.8,
    paddingVertical: doubleBaseMargin,
    borderRadius: 5,
    marginTop: -7,
    zIndex: -1,
  },
  inviteTitle: {
    color: white,
  },
  inviteNote: {
    marginTop: baseMargin,
    color: white,
    textAlign: "center",
  },
  sendInviteBtn: {
    backgroundColor: white,
    width: 223,
  },
  sendInviteBtnText: {
    color: appColors.headerBgColor,
    fontWeight: "700",
    fontSize: 16,
  },
  inviteNoThanksBtn: {
    backgroundColor: appColors.inviteBtn,
    width: 153,
  },
  inviteBottomNote: {
    marginVertical: doubleBaseMargin,
    marginHorizontal: doubleBaseMargin * 1.7,
  },
  inviteTerms: {
    lineHeight: 12,
  }
});
