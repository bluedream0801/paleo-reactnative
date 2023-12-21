import { StyleSheet } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'

const { marginHorizontal, screenWidth } = appMetrics
const { pink } = appColors
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

    marginBottom: 10,
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

    alignSelf: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
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
  cellContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 30,
  },
  image: {
    height: 221,
    width: 110,
    resizeMode: 'contain',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: pink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellInner: {
    paddingLeft: 15,
  },
  titileText: {
    marginVertical: 10,
  },
})
