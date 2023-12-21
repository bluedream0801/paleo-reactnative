import { Dimensions, Platform } from 'react-native'
const { width, height } = Dimensions.get('window')
const IS_IOS = Platform.OS === 'ios'
const globalPadding = 15

const metrics = {
  IS_IOS,
  navBarHeight: IS_IOS ? 64 : 54,
  headerHeight: IS_IOS ? 55 : 66,
  statusBarHeight: IS_IOS ? 20 : 0,
  subHeadingHeight: 35,
  globalPadding,
  inputPadding: globalPadding * 2,
  screenPadding: 26,
  marginHorizontal: 10,
  marginVertical: 10,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  buttonHeight: 50,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  footerHeight: 70,
  borderRadius: 5,
  borderWidth: 1.5,
  fontSizes: {
    micro: 8,
    mini: 10,
    tiny: 12,
    small: 18,
    regular: 22,
    medium: 24,
    large: 34,
  },
}

export default metrics
