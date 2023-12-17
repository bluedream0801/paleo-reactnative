import { StyleSheet } from 'react-native'
import { appFonts, appColors, appMetrics } from '../../theme'
const {
  marginHorizontal,
  screenWidth,
  doubleBaseMargin,
  baseMargin,
  globalPadding,
  smallMargin,
} = appMetrics
const { boxGrey, slotGrey, white, borderGrey, addressGrey } = appColors

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
    height: 43,
    backgroundColor: white,
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: baseMargin,
    borderColor: borderGrey,
  },
  box: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: boxGrey,
  },
  dayText: {
    marginLeft: baseMargin * 0.5,
    marginTop: smallMargin * 0.6,
  },
  textThrough: {
    textDecorationLine: 'line-through',
  },
  dateText: {
    marginLeft: baseMargin * 0.5,
    marginTop: baseMargin * 0.6,
  },
  slotContainer: {
    marginTop: baseMargin,
  },
  tick: {
    width: 10,
    height: 13,
    resizeMode: 'contain',
  },
  margin: {
    marginTop: doubleBaseMargin * 0.9,
  },

  todayLine: {
    width: 47,
    height: 1,
    top: 15,
    position: 'absolute',
    backgroundColor: addressGrey,
    left: 5,
  },
  splitContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',

    paddingBottom: 30,
    width: '95%',
    flex: 1,

    backgroundColor: white,
    flex: 1,
  },
  splitInner: {
    borderWidth: 1,
    height: 76,
    borderRadius: 5,
    flexDirection: 'row',
    borderColor: borderGrey,
    alignItems: 'center',
    paddingLeft: 13,
    width: '100%',
    marginTop: 5,
    marginBottom: 30,
    backgroundColor: white,
  },
  splitImg: {
    width: 34,
    height: 32,
    resizeMode: 'contain',
    marginRight: 13,
  },
  mealsIc: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 3,
    marginRight: 3,
  },
  mtoIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginTop: baseMargin * 0.6,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallTimeRow: {
    flexDirection: 'row',
  },
})
