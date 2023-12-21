import { StyleSheet } from 'react-native'
import { appMetrics, appColors } from '../../theme'
const { smallMargin, doubleBaseMargin, footerHeight } = appMetrics
const { sharpRed, lightRed, white, blackOpacity, borderGrey } = appColors

export const TABBAR_VERTICAL_PADDING = 10;

export default styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    overflow: 'visible',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: TABBAR_VERTICAL_PADDING,
    backgroundColor: white,
    flexDirection: 'row',
    flex: 1,

    overflow: 'visible',
    borderTopWidth: 1,
    borderColor: borderGrey,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    height: footerHeight - TABBAR_VERTICAL_PADDING * 2,
  },
  tabSelected: {
    width: 60,
    height: 60,
    backgroundColor: sharpRed,
    borderRadius: 30,
    position: 'absolute',
    bottom: -20,
  },
  signView: {
    position: 'absolute',
    width: 110,
    height: 80,
    backgroundColor: 'red',
    bottom: 58,
    right: doubleBaseMargin,
  },
  editProfileView: {
    flexDirection: 'row',
    backgroundColor: lightRed,
    width: 120,
    justifyContent: 'space-between',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: smallMargin,
  },
  logoutView: {
    flexDirection: 'row',
    backgroundColor: lightRed,
    width: 120,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: smallMargin,
    borderTopWidth: 1,
  },
  icon: { width: 20, height: 20 },
  overLay: {
    left: 0,
    right: 0,
    bottom: 0,
    top: -2,
    position: 'absolute',
    backgroundColor: blackOpacity,
  },
})
