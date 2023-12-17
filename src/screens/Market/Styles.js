import { StyleSheet, Platform } from 'react-native'

import { appFonts, appColors, appMetrics, fontStyles } from '../../theme'

const { size } = fontStyles
const {
  marginHorizontal,
  smallMargin,
  baseMargin,
  globalPadding,
  screenWidth,
} = appMetrics
const { borderGrey, underline, white, blackOpacity } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: { flex: 1, paddingHorizontal: baseMargin },
  cell: {
    height: 127,
    flex: 1,

    overflow: 'hidden',
    marginBottom: baseMargin,
    borderWidth: 0,
  },
  cellImg: {
    height: 102,
    resizeMode: 'contain',
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: smallMargin,
  },
  overlay: {
    width: screenWidth - 10,
    height: 128,
    paddingLeft: globalPadding,
    paddingTop: baseMargin * 0.7,
  },
  listStyle: {
    flex: 1,
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
  labelContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  underline: {
    borderBottomWidth: 2,

    marginLeft: 3,

    borderBottomColor: underline,
    height: 16,
  },

  underlineAddress: {
    borderBottomWidth: 1,

    marginHorizontal: 3,

    borderBottomColor: white,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: marginHorizontal,
    marginVertical: 20,
    alignItems: 'center',
  },
  listOptions: {
    backgroundColor: white,
    marginHorizontal: 0,
    marginBottom: 46,
    borderRadius: 5,
    overflow: 'hidden',
  },
  listOption: {
    height: 60,
    borderBottomWidth: 1,
    borderColor: borderGrey,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: marginHorizontal,
  },
  arrow: {
    width: 10,
    height: 14,
    marginRight: 6,
    resizeMode: 'contain'
  }
})
