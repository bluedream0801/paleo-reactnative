import { StyleSheet, Platform } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'

const {
  marginHorizontal,
  globalPadding,
  marginVertical,
  smallMargin,
  baseMargin,
} = appMetrics
const { white, borderGrey, headerBgColor } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
  },
  header: {},

  signupText: {
    fontSize: 15,
    fontFamily: appFonts.GTWalsheim_Regular,
    color: appColors.darkGray,
  },
  footer: {
    width: '100%',
    backgroundColor: appColors.lightGrey,
    height: Platform.OS == 'ios' ? 80 : 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: marginHorizontal,

    backgroundColor: white,
    height: 67,
    alignItems: 'center',
  },
  innerDetail: {
    alignItems: 'flex-end',
  },

  orderSubSections: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: marginHorizontal,
    marginTop: 24,

    alignItems: 'center',
    marginBottom: 6,
  },
  orderSection: { flex: 1 },
  ordeList: {
    backgroundColor: white,
    marginHorizontal: marginHorizontal,
    borderRadius: 5,
    overflow: 'hidden',
  },
  myDetailsList: {
    backgroundColor: white,
    marginHorizontal: marginHorizontal,
    borderRadius: 5,
    overflow: 'hidden',
  },
  myAccountCell: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: borderGrey,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: marginHorizontal,
  },
  arrow: { width: 10, height: 14, resizeMode: 'contain' },

  logOutSection: {
    marginTop: marginVertical * 3,
    marginBottom: marginVertical * 3,
  },

  logoutCell: {
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: marginHorizontal,
  },
  friend: {
    paddingHorizontal: 10,
  },
  friendManImg: {
    width: 90,
    height: 70,
    resizeMode: 'contain',
    marginTop: baseMargin * 2,
    position: 'absolute',
    zIndex: 6,
    top: 0,
    alignSelf: 'center',
  },

  friendContainer: {
    height: 196,
    backgroundColor: headerBgColor,
    borderRadius: 5,
    flex: 1,
    paddingTop: 23,
    alignItems: 'center',
    paddingHorizontal: baseMargin,

    marginTop: -10,
    marginTop: 82,
  },
  sendBtn: {
    height: 35,
    backgroundColor: white,
  },
  textStyles: {
    color: headerBgColor,
  },
  friendDescription: {
    marginTop: baseMargin,
  },
  noOrder: {
    marginVertical: 10,
  },
})
