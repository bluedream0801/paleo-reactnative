import { DrawerLayoutAndroidBase, StyleSheet } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'

const {
  marginHorizontal,
  screenWidth,
  doubleBaseMargin,
  baseMargin,
  globalPadding,
  smallMargin,
} = appMetrics
const { quantityGreen, slotGrey, white, borderGrey } = appColors
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

    alignSelf: 'center',
    marginTop: globalPadding,
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
    marginTop: marginHorizontal,
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

  ///

  cell: {
    borderBottomWidth: 1,

    width: '100%',
    justifyContent: 'center',

    backgroundColor: slotGrey,
    paddingBottom: doubleBaseMargin,
    paddingTop: baseMargin * 1.3,
    paddingHorizontal: baseMargin,
    borderColor: borderGrey,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    backgroundColor: white,
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: baseMargin,
    borderColor: borderGrey,
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: quantityGreen,
  },
  dayText: {
    marginLeft: baseMargin * 0.5,
    marginTop: smallMargin * 0.6,
  },
  dateText: {
    marginLeft: baseMargin * 0.5,
    marginTop: baseMargin * 0.6,
  },
  slotContainer: {
    height: 40,
    width: '100%',
    backgroundColor: white,
    borderColor: borderGrey,
  },
  tick: {
    width: 14,
    height: 18,
    resizeMode: 'contain',
  },
  margin: {
    marginTop: doubleBaseMargin * 0.7,
  },
  listContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    width: '70%',
    alignItems: 'center',
    borderColor: borderGrey,
    width: 190,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
})
