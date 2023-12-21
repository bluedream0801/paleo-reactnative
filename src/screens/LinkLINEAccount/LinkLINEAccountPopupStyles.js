import { StyleSheet } from 'react-native'

import { appFonts, appColors, appMetrics } from '../../theme'
const { borderGrey } = appColors
const { marginHorizontal, screenWidth } = appMetrics
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  body: {
    backgroundColor: appColors.white,
    paddingHorizontal: 20,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
  },
  innserScoll: {
    flex: 1
  },
  logo: {
    width: 152,
    height: 155,
    marginTop: 42,
    marginBottom: 22,
  },
  title: {
    textAlign: 'center',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  description: {
    marginTop: 23,
    textAlign: 'left',
  },
  textCenter: {
    textAlign: 'center'
  },
  cancelButton: {
    marginTop: 50,
  },
  followButton: {
    marginTop: 16
  },
  footerText: {
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  footerTextQA: {
    textAlign: 'center',
    paddingTop: 12,
    paddingBottom: 40
  },
  clickHearText: {
    lineHeight: 20,
  },
  clickHearBtn: {
    color: appColors.black,
    backgroundColor: appColors.white,
    height: 18,
  },
  clickHearBtnTxt: {
    color: appColors.black,
    fontSize: 12,
    lineHeight: 14,
  },
  lineQAIcon: {
    height: 50
  },
  lineQAInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  descriptionQA: {
    textAlign: 'left'
  },
  textVMargin: {
    marginBottom: 9
  },
  crossBtn: {
    position: 'absolute',
    top: 42,
    right: 20,
  },
  crossImg: {
    width: 20,
    height: 20,
  },
})
