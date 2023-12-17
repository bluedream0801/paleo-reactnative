import { StyleSheet } from 'react-native'
import { appFonts, appColors, appMetrics } from '../../theme'
const { doubleBaseMargin, baseMargin, screenWidth, globalPadding } = appMetrics
const { white, blackOpacity } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputCustomStyles: {
    marginTop: 20,
  },
  innerContainer: {
    width: '100%',
    alignSelf: 'center',

    alignItems: 'center',

    backgroundColor: white,
    paddingVertical: doubleBaseMargin,
    paddingHorizontal: baseMargin,
  },
  innerOfferContainer: {
    width: '100%',
    alignSelf: 'center',

    alignItems: 'center',

    backgroundColor: white,
    paddingTop: globalPadding,
    paddingBottom: baseMargin * 1.2,
    paddingHorizontal: baseMargin,
  },
  offerContainer: {
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: globalPadding,
  },
  offerImg: {
    height: 130,
    width: screenWidth,
    resizeMode: 'stretch',
  },
  offerText: {
    marginTop: baseMargin,
  },
  footer: {
    width: '100%',
    backgroundColor: appColors.lightGrey,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: doubleBaseMargin,
  },
  contentMargin: {
    marginTop: doubleBaseMargin * 1.5,
  },
  heading: {
    marginLeft: baseMargin,
    marginBottom: baseMargin,
  },
  body: {
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
})
