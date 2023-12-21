import { appFonts, appColors, appMetrics, fontStyles } from '../../theme'
import { StyleSheet } from 'react-native'
const {} = fontStyles
const { baseMargin, globalPadding, marginHorizontal } = appMetrics
const {
  lowOpacity,
  borderGrey,
  white,
  headerBgColor,
  lightGrey,
  whiteLowOpacity,
} = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  notFound: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: lightGrey,
  },
  marginText: {
    marginTop: baseMargin,
  },
  tabs: {
    flexDirection: 'row',

    height: 34,
  },
  tab: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: headerBgColor,
  },
  Inner: {
    flex: 1,
  },
  listBody: {
    paddingHorizontal: marginHorizontal,
  },
  cell: {
    height: 65,
    backgroundColor: white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: borderGrey,
    overflow: 'hidden',
  },
  favorites: {
    width: 75,
    height: 65,
    resizeMode: 'contain',
  },
  listStyle: {
    marginHorizontal: baseMargin,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 15,
  },
  listInnerStyle: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  addBtn: {
    alignSelf: 'flex-end',
    marginBottom: globalPadding,
    marginRight: globalPadding,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
    flex: 1,
  },
  flexText: {
    flex: 1,
  },
  imgContainer: {
    height: 65,
    width: 75,
  },
  addImg: {
    width: 33,
    height: 28,
    resizeMode: 'contain',
  },
  textContainer: {
    height: 48,
    marginLeft: baseMargin,
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 70,
  },
  favContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: whiteLowOpacity,
    zIndex: 7,
    borderTopLeftRadius: 5,
    overflow: 'hidden',
    borderBottomRightRadius: 5,
  },
  favImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: baseMargin,
    marginTop: 24,
    marginBottom: 5,
  },
  footerText: {
    color: "#979797",
    marginTop: 6,
  },
  Unavailable: {
    width: 75,
    height: 27,
    borderBottomStartRadius: 5,
    backgroundColor: lowOpacity,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  tabBarTextStyle: {
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: appFonts.GTWalsheim_Regular,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    height: 35,
    borderBottomWidth: 0,
    marginTop: -14,
  },
  ScrollableTabBar: {
    borderWidth: 0,
    height: 38,
  },
  tabBarUnderlineStyle: {
    backgroundColor: headerBgColor,
    height: 3,
    flex: 1,
  },
})
