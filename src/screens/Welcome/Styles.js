import { Dimensions, Platform, StyleSheet } from 'react-native'
import { appColors, appFonts, fontStyles } from '../../theme'

const { size } = fontStyles

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const footerHeight = Platform.select({
  ios: 80,
  android: 70
});
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  body: {
    flex: 1
  },
  wrapper: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: footerHeight + 60,
  },
  welcomeTitle: {
    fontFamily: appFonts.GTWalsheim_Condensed_Bold,
    fontSize: size.largeHeading,
    color: appColors.white
  },
  introTitle: {
    fontFamily: appFonts.GTWalsheim_Condensed_Bold,
    fontSize: size.largeRegularPlus,
    color: appColors.white
  },
  introText: {
    fontFamily: appFonts.GTWalsheim_Regular,
    fontSize: size.regular,
    color: appColors.white,
    marginVertical: 15,
  },
  textBold: {
    fontFamily: appFonts.GTWalsheim_Bold,
  },
  sliderImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  welcomeTextBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: footerHeight,
    height: windowHeight * 2 / 3,
  },
  logoImage: {
    resizeMode: 'contain',
    width: 147,
    height: 133,
    position: 'absolute',
    right: windowWidth* 0.08,
    top: windowHeight * 0.16
  },
  overlayImage1: {
    alignSelf: 'flex-end',
    marginRight: 8,
    resizeMode: 'contain',
    width: '43%',
    height: 336,
  },
  overlayImage2: {
    marginLeft: 8,
    resizeMode: 'contain',
    width: '43%',
    height: 336,
  },
  overlayImage3: {
    alignSelf: 'flex-end',
    marginRight: 8,
    resizeMode: 'contain',
    width: '43%',
    height: 336,
  },
  footer: {
    width: '100%',
    backgroundColor: appColors.white,
    height: footerHeight,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 8
  },
  footerButton: {
    height: 52,
    borderRadius: 4,
    width: '50%',
    paddingHorizontal: 8
  },
  signinButton: {
    color: appColors.black,
    backgroundColor: appColors.white,
    marginRight: 8,
    marginLeft: 16,
    marginTop: 0
  },
  createAccButton: {
    color: appColors.white,
    backgroundColor: appColors.black,
    marginLeft: 8,
    marginRight: 16,
    marginTop: 0
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: footerHeight + 30,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  paginationDots: {
    height: 12,
    width: 12,
    borderRadius: 12 / 2,
    backgroundColor: appColors.white,
    marginLeft: 10,
  }
})