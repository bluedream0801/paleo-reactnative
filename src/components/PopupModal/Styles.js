import { StyleSheet } from 'react-native'
import { appFonts, appColors, appMetrics } from '../../theme'
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
  subView: {
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 0,
    justifyContent: 'flex-start',
    width: screenWidth - 40,
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
  locationRow: {
    flexDirection: 'row',
    marginTop: marginHorizontal * 3.5,
    alignSelf: 'center',
  },
  location: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: marginHorizontal * 0.8,
  },
  bottomText: {
    fontFamily: appFonts.GTWalsheim_Regular,
    fontSize: 17,
    color: appColors.green,
  },
})
