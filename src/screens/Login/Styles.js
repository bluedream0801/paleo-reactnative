import { StyleSheet, Platform } from 'react-native'

import { appFonts, appColors } from '../../theme'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.green,
  },
  body: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
  },
  header: {
    backgroundColor: 'red',
  },
  forgotText: {
    marginTop: 20,
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    color: appColors.green,
  },
  lineSignupContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%'
  },
  lineSignupButton: {
    marginVertical: 12
  },
  separator: {
    marginTop: 20,
    marginBottom: 32
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
})
