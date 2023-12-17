import { StyleSheet, Platform } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'

const {
  marginHorizontal,
  globalPadding,
  marginVertical,
  smallMargin,
} = appMetrics
const { white, borderGrey, switchBorder } = appColors
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
    paddingHorizontal: marginHorizontal,
    marginTop: marginHorizontal * 2.4,

    marginBottom: smallMargin * 1.5,
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
  switchStyles: {
    borderColor: switchBorder,
  },
  descText: { marginTop: smallMargin * 1.5 },
  appVersionText: {
    paddingHorizontal: marginHorizontal,
    paddingVertical: marginVertical
  },
  menuLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  warningIcon: {
    width: 24,
    height: 24,
    marginLeft: 4,
    borderRadius: 24
  }
})
