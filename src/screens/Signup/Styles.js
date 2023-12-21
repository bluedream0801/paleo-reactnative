import { StyleSheet, Platform } from 'react-native'
import { appFonts, appColors } from '../../theme'
const { blackOpacity } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    width: '100%',
    marginTop: 21,
    flex: 1
  },
  bodyContent: {
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'red',
  },
  nameView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 11,
  },
  inputCustom: {
    width: '95%'
  },
  termsText: {
    fontSize: 14,
    fontFamily: appFonts.GTWalsheim_Regular,
    color: appColors.orderDarkGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  inpuOuter: {
    flex: 1
  },
  signUpButtonsContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: 24
  },
  emailSignupContainer: {
    marginTop: 16
  },
  lineSignupButton: {
    marginTop:9,
    marginBottom: 12
  },
  separator: {
    marginTop: 4
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
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  smallTextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: appColors.darkGray,
    borderBottomWidth: 0.8,
    width: 90,
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
})
