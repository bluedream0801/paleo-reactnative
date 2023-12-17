import { StyleSheet } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'

const { marginHorizontal, screenWidth, baseMargin, headerHeight, smallMargin } = appMetrics
const {
  black,
  white,
  blackOpacity,
  darkGray,
  addressGrey,
  borderGrey,
  headerBgColor,
  greenOpacity,
  greenButtonOpacity,
} = appColors

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    backgroundColor: white,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: headerHeight - 20,

    marginBottom: 4,
    paddingHorizontal: baseMargin,
  },

  leftBtn: {
    alignItems: 'center',

    height: 55,

    justifyContent: 'center',
    marginRight: 8,
  },
  crossImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  dottedContainer: {
    height: 106,
    borderWidth: 1,

    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
    borderColor: borderGrey,
    borderStyle: 'dashed',
    backgroundColor: white,

    marginHorizontal: 10,

    marginBottom: 15,
  },
  tabBarTextStyle: {
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: appFonts.GTWalsheim_Regular,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    height: 35,
    marginTop: -14,
  },
  tabBarUnderlineStyle: {
    backgroundColor: headerBgColor,
    height: 3,
    flex: 1,
  },
  ScrollableTabBar: {
    borderWidth: 0,
    height: 38,
  },
  tabStyle: {
    paddingHorizontal: 0,
    marginHorizontal: -10,

    borderWidth: 0,
  },

  tabsStyles: {
    height: 30,
    borderWidth: 0,
    marginTop: 22,
    backgroundColor: white,
  },
  tabConainersStyles: {
    backgroundColor: white,
  },
  footer: {
    height: 93,
    backgroundColor: white,
    flexDirection: 'row',

    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: borderGrey,
    justifyContent: 'flex-end',
  },

  addBtn: {
    height: 52,
    backgroundColor: greenButtonOpacity,
    marginTop: 0,
    marginRight: 10,
  },
  bottomPrice: {
    marginRight: 15,
    alignItems: 'flex-end',
  },
  infoBlock: {
    marginTop: 7,
    flex: 1,
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoNumber: {
    flex: 2,
    textAlign: 'right',
  },
  infoLabel: {
    flex: 3,
    paddingLeft: 10,
  },
  smallMargin: {
    marginRight: 34,
  },
  topMargin: {
    marginTop: 7,
  },
  modalContain: {
    backgroundColor: blackOpacity,
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentStyle: {
    textAlign: 'center',
  },
  chooseText: {
    marginLeft: baseMargin,
  },
  
  processingContainer: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  processingImg: {
    width: 143,
    height: 143,
    resizeMode: 'contain',
  },
  processHeading: {
    marginTop: smallMargin * 1.4,
  },
  topMarginProcessing: {
    marginTop: 10,
  },
})
