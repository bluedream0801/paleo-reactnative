import { StyleSheet, Platform } from 'react-native'
import { appFonts, appColors, appMetrics } from '../../theme'
const { doubleBaseMargin, baseMargin } = appMetrics
const { white, lightGrey, blackOpacity, green, borderGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGrey,
  },
  body: {
    width: '100%',
    alignSelf: 'center',

    alignItems: 'center',

    backgroundColor: white,
    paddingVertical: doubleBaseMargin,
  },
  innerContainer: {
    width: '95%',
    alignSelf: 'center',

    alignItems: 'center',

    backgroundColor: white,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  subContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: baseMargin,
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
    width: '100%',
    backgroundColor: appColors.lightGrey,
    height: Platform.OS == 'ios' ? 80 : 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputCustomStyles: {
    marginTop: 20,
  },
  smallInputCustomStyles: {
    marginTop: 20,
    width: 124,
  },
  inputViewStyle: {
    //backgroundColor: transparent,
  },
  smallRightInputCustomStyles: {
    marginTop: 20,
    width: 108,
    marginLeft: baseMargin * 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  arrowIcon: {
    transform: [{ rotate: '90deg' }],
    width: 14,
    height: 11,
  },
  iconContainerStyle: {
    position: 'absolute',
    right: -10,
  },
  addBtn: {
    width: '95%',
    marginBottom: 40,
  },
  heading: { marginLeft: baseMargin, marginBottom: baseMargin },
  visaIcon: {
    width: 36,
    height: 14,
    resizeMode: 'contain',
    position: 'absolute',
    top: -7,
    right: -8,
  },
  avodingView: {
    flex: 1,
  },
  successContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: white,
    zIndex: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotRestImg: {
    width: 101,
    height: 114,
    resizeMode: 'contain',

    marginLeft: 28,
  },
  successTitle: {
    marginTop: baseMargin,
  },
  successInner: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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
  datewPicker: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPickerStyle: {
    backgroundColor: borderGrey,
  },
  selectedMonthTextStyle: {
    color: green,
  },
  maskedInput: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,

    zIndex: -1,
    backgroundColor: lightGrey,

    height: 40,
    width: 124,
    paddingLeft: 12,
    borderRadius: 4,

    borderWidth: 0.8,
    borderColor: appColors.borderGrey,
    marginTop: 5,
    width: 124,
  },
  label: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    color: appColors.inputLabel,
  },
  MaskedContainer: {
    marginTop: 20,
  },
  smallCard: { width: 24, height: 16, resizeMode: 'contain', marginRight: 5, },
})
