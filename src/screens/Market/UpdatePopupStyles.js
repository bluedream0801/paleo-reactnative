import { StyleSheet } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'
const { borderGrey } = appColors
const { marginHorizontal, screenWidth } = appMetrics
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  body: {
    backgroundColor: appColors.white,
    padding: 20,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
  },
  logo: {
    width: 120,
    height: 152,
    marginBottom: 27,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    marginTop: 23,
    textAlign: 'center',
  },
  updateButton: {
    marginTop: 106,
  },
  footerText: {
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  clickHearText: {
    lineHeight: 20,
  },
  clickHearBtn: {
    color: appColors.black,
    backgroundColor: appColors.white,    
    height: 18,
  },
  clickHearBtnTxt: {
    color: appColors.black,
    fontSize: 12,
    lineHeight: 14,
  },
})
