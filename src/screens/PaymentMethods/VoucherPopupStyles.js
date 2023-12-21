import { StyleSheet } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'
const { invalidBackGround } = appColors
const { marginHorizontal, screenWidth } = appMetrics
export default styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'flex-end',
  },
  body: {
    backgroundColor: appColors.white,

    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
    height: 276,
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginTop: 20,
  },

  crossBtn: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 17,
  },
  crossImg: {
    width: 20,
    height: 20,
  },
  scrollView: {
    width: '100%',
    paddingHorizontal: '2.5%',
    alignSelf: 'center',
    paddingTop: 10,
  },
  content: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    fontWeight: '400',
    color: appColors.darkGray,
    lineHeight: 18,
  },
  topText: {
    fontFamily: appFonts.GTWalsheim_Condensed_Bold,
    fontSize: 20,
    color: appColors.black,
    maxWidth: screenWidth - 60,
    textAlign: 'center',
  },

  subHeadingText: {
    fontFamily: appFonts.GTWalsheim_Bold,
    fontSize: 15,
    color: appColors.darkGray,
  },

  //
  vouchBtn: {
    marginTop: 0,
  },
  invalid: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: invalidBackGround,
    marginBottom: 15,
  },
})
