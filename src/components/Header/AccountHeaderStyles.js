import { StyleSheet } from 'react-native'
import { appFonts, appColors } from '../../theme'
const { lightGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftBtn: {
    width: '10%',
    alignItems: 'center',
    borderWidth: 0,

    height: 55,
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
  },
  rightBtn: {
    width: '10%',
    alignItems: 'center',
    borderWidth: 0,

    height: 55,
    position: 'absolute',
    right: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: appColors.white,

    textAlign: 'center',

    fontFamily: appFonts.GTWalsheim_Condensed_Bold,
  },
  backImg: {
    width: 25,
    height: 22,
    resizeMode: 'contain',
  },
  crossImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
})
