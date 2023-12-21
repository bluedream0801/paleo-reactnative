import { StyleSheet, Platform } from 'react-native'
import { fontStyles, appColors, appMetrics } from '../../theme'
const { notificationBack } = appColors
import { ifIphoneX } from 'react-native-iphone-x-helper'
const { headerHeight, IS_IOS } = appMetrics
export default styles = StyleSheet.create({
  container: {
    height: headerHeight,
    backgroundColor: notificationBack,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 10,
  },
  margin: {
    marginBottom: 3,
  },
})
