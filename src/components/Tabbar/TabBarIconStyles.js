import { StyleSheet } from 'react-native'
import { fontStyles, appColors, appMetrics } from '../../theme'
const { borderGrey, darkGrey, lightGreen } = appColors
const {} = appMetrics
const { size } = fontStyles

export default styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    // width: 35,
    // height: 35,
  },
  text: {
    color: lightGreen,
    fontSize: size.small,

    marginTop: 2,
  },
  focused: {
    color: darkGrey,
  },
  icon: {
    fontSize: size.medium,
    color: borderGrey,
  },
  heartIcon: {
    fontSize: size.largeMedium,
    color: borderGrey,
  },
  biggerIcon: {
    fontSize: size.medium,
  },
  home: {
    width: 32,
    height: 25,
  },
  iconImg: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  imageSelected: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderWidth: 1,
  },
  imgContainer: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    overflow: 'hidden',
  },
  imgContainerSelected: {
    width: 64,
    height: 64,
    backgroundColor: borderGrey,
    borderRadius: 62,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -18,
  },
  cartItems: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: darkGrey,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 5,
    right: -7,
    top: 0,
    paddingLeft: 2,
  },
})
