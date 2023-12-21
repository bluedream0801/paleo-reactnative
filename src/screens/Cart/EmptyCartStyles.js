import { appFonts, appColors, appMetrics, fontStyles } from '../../theme'
import { StyleSheet, Platform } from 'react-native'
const { size } = fontStyles
const {
  marginHorizontal,
  smallMargin,
  doubleBaseMargin,
  baseMargin,
  globalPadding,
  screenWidth,
} = appMetrics
const {
  lowOpacity,
  borderGrey,
  white,
  headerBgColor,
  lightGrey,
 
} = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:lightGrey
  },
  body: {
    flex: 1,
    overflow: 'visible',
    justifyContent:'center',
    alignItems:'center'
  },
  cartImg:{
      width:145,
      height:108,
      resizeMode:'contain',
      marginBottom:24
  }
})
