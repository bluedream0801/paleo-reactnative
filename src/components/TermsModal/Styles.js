import { StyleSheet } from 'react-native'
import { appFonts, appColors } from '../../theme'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    backgroundColor: appColors.white,
    flex: 1,
    marginTop: '25%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 22,
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
    paddingHorizontal: '2.5%',
    alignSelf: 'center',
    paddingTop: 10,
  },
  content: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    fontWeight: '400',
    color: appColors.darkGray,
    lineHeight: 18,
  },
  topText: {
    fontFamily: appFonts.GTWalsheim_Bold,
    fontSize: 20,
    color: appColors.black,
  },
  firstText: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Bold,
    color: appColors.darkGray,
    lineHeight: 18,
  },
})
