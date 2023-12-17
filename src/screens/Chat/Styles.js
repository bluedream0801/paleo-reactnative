import { StyleSheet, Platform } from 'react-native'

import { appColors, appMetrics, appFonts, fontStyles } from '../../theme'
const {
  marginHorizontal,
  borderRadius,
  baseMargin,
  smallMargin,
  doubleBaseMargin,
  globalPadding,
} = appMetrics
const {
  white,
  borderGrey,
  circleBorder,
  darkGrey,
  accountSettingGray,
  slotGrey,
  sharpGreen,
  chatInputBorder,
  transparent,
} = appColors

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: white,
  },
  textInputStyle: {
    fontFamily: appFonts.GTWalsheim_Regular,
    fontSize: 17,
    color: accountSettingGray,
    height: 50,
  },
  messageTextContainer: {
    backgroundColor: slotGrey,
    paddingHorizontal: globalPadding,
    paddingVertical: baseMargin,
    borderRadius: 15,
    marginRight: 60,
    borderTopLeftRadius: 0,
    marginTop: 5,
  },
  mainTextContainer: {
    marginLeft: 10,
  },
  doubleCheck: {
    width: 40,
    height: 40,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: globalPadding,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  greenDot: {
    backgroundColor: sharpGreen,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 3,
    marginLeft: 3,
  },

  //
  messageRightContainer: {
    marginBottom: 20,
    flex: 1,
    flexDirection: 'row-reverse',
  },

  messageRightTextContainer: {
    backgroundColor: slotGrey,
    paddingHorizontal: globalPadding,
    paddingVertical: baseMargin,
    borderRadius: 15,
    flex: 1,
    borderTopEndRadius: 0,
    marginTop: 5,
    alignItems: 'flex-end',
    backgroundColor: darkGrey,
  },
  chatImg: {
    width: 191,
    height: 127,
  },
  mainRightTextContainer: {
    alignItems: 'flex-end',
  },
  time: {
    marginTop: smallMargin,
  },
  chatContainer: {
    paddingHorizontal: baseMargin,
  },
  tootlBar: {
    borderTopWidth: 2,
    borderTopColor: chatInputBorder,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',

    height: 50,
    paddingBottom: smallMargin * 0.8,
  },
  sendIc: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: baseMargin,
    marginBottom: smallMargin * 0.7,
  },
  primaryStyle: {
    alignItems: 'center',
    paddingRight: globalPadding,
  },
  customStyles: {
    height: 40,

    backgroundColor: transparent,
    width: '80%',

    marginTop: 7,
  },
  customViewStyles: {
    height: 40,

    backgroundColor: transparent,
    width: '100%',
    paddingBottom: 5,
    borderWidth: 0,
  },
  input: {
    height: 40,

    backgroundColor: transparent,
    marginTop: -10,
    width: '100%',
    borderWidth: 0,
    fontSize: fontStyles.size.regularPlus,
  },
  fileIc: {
    width: 24,
    height: 22,
    resizeMode: 'contain',
    marginRight: 5,
    marginBottom: smallMargin * 0.7,
  },
  closeZoomImg: {
    width: 20,
    height: 20,
    tintColor: white,
    resizeMode: 'contain',
  },
  closeZoomImgTouch: {
    flex: 1,

    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    right: 0,
  },
})
