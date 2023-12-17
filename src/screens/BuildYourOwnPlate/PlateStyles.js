import { StyleSheet } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'

const {
  marginHorizontal,

  baseMargin,
  headerHeight,
  screenWidth,
} = appMetrics
const {
  black,
  white,
  buttonOpacity,
  darkGray,
  addressGrey,
  borderGrey,
  headerBgColor,
  lightGrey,
} = appColors

export default styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: lightGrey,
  },

  header: {
    backgroundColor: white,
    paddingHorizontal: baseMargin,
  },

  mixCell: {
    width: (screenWidth - 34) / 2,
    backgroundColor: white,

    overflow: 'hidden',

    borderRadius: 5,
    alignItems: 'center',
  },
  mixAddedCell: {
    width: (screenWidth - 34) / 2,
    backgroundColor: lightGrey,

    overflow: 'hidden',

    borderRadius: 5,
    alignItems: 'center',
  },

  listContainer: {
    paddingHorizontal: 12,
  },

  mixImg: {
    width: (screenWidth - 34) / 2,
    height: 83,
    resizeMode: 'contain',
  },
  price: {},
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 19,
    marginBottom: 7,
  },
  greyHeading: {
    marginLeft: baseMargin,
  },
  cellText: {
    paddingHorizontal: 5,
  },
  texContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 7,
    paddingTop: 6,
  },
  addedTexContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 7,
    paddingTop: 6,
  },
  delContainer: {
    width: 21,
    height: 21,

    borderBottomLeftRadius: 5,
    backgroundColor: white,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    position: 'absolute',
  },

  delImg: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  listItems: {},
  addedCell: {
    marginLeft: 10,
    marginBottom: 0,
    marginTop: 20,
    height: 121,
  },

  tabContainer: {
    backgroundColor: white,
    height: 30,
  },
  flatlList: {
    marginLeft: 10,
  },
  addedQuantity: {
    height: 24,
    width: '100%',
    backgroundColor: buttonOpacity,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})
