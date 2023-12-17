import { StyleSheet } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const { baseMargin, borderRadius, globalPadding, doubleBaseMargin } = appMetrics
const { white, lightGrey, borderGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGrey,
  },
  body: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: baseMargin,
  },
  innerContainer: {
    width: '95%',
  },
  innerBottomContainer: {
    width: '95%',

    marginTop: doubleBaseMargin * 1.3,
  },
  optionsRow: {
    height: 110,
    backgroundColor: white,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius,
    marginTop: baseMargin,
  },

  bottomOptionsRow: {
    backgroundColor: white,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0,
  },

  bottomOptionsContainer: {
    backgroundColor: white,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius,
    marginTop: baseMargin,
    paddingTop: globalPadding,
    paddingBottom: baseMargin * 1.5,
  },
  ImgContainer: {
    alignItems: 'center',
    flex: 1,
    height: 64,
    borderWidth: 0,
    justifyContent: 'space-between',
  },
  vline: {
    width: 1,
    height: 80,
    marginVertical: 15,
    backgroundColor: borderGrey
  },
  bottomImgContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderImgContainer: {
    alignItems: 'center',
    flex: 1,
    height: 71,
    borderWidth: 0,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 29
  },
  chatImg: { width: 46, height: 42, resizeMode: 'contain', paddingBottom: 12 },
  emailImg: {
    width: 36,
    height: 25,
    resizeMode: 'contain',
    marginBottom: 16
  },
  callImg: { width: 39, height: 39, resizeMode: 'contain', paddingBottom: 12 },
  prepaidImg: { width: 92, height: 61, resizeMode: 'contain' },
  cartImg: { width: 59, height: 61, resizeMode: 'contain' },
  carImg: { width: 89, height: 58, resizeMode: 'contain' },
  mealsImg: { width: 67, height: 67, resizeMode: 'contain' },
  centerImg: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: baseMargin,
    borderWidth: 0,
  },
  centerTuckImg: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,

    borderWidth: 0,
  },
  vertical: {
    width: 1,
    height: '100%',
    backgroundColor: borderGrey,
    alignSelf: 'center',
  },
  horizontal: {
    width: '95%',
    height: 1,
    backgroundColor: borderGrey,
  },
  smallMargin: {
    marginTop: 5,
  },
})
