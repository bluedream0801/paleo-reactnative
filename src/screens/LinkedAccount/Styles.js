import { StyleSheet } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const { baseMargin, borderRadius, globalPadding } = appMetrics
const { white, lightGrey, borderGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightGrey,
  },
  body: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: baseMargin
  },
  horizontalLine: {
    borderBottomColor: borderGrey,
    borderBottomWidth: 1
  },
  innerContainer: {
    width: '100%'
  },
  optionsRow: {
    height: 110,
    backgroundColor: white,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius,
    marginTop: globalPadding,
  },
  ImgContainer: {
    alignItems: 'center',
    flex: 1,
    height: 80,
    borderWidth: 0,
    justifyContent: 'space-between',
    paddingVertical: 7.5,
  },
  borderdImgContainer: {
    alignItems: 'center',
    flex: 1,
    height: 80,
    borderWidth: 0,
    justifyContent: 'space-between',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: borderGrey,
    paddingVertical: 7.5,
  },
  chatImg: { width: 46, height: 42, resizeMode: 'contain' },
  emailImg: {
    width: 36,
    height: 25,
    resizeMode: 'contain',
    marginTop: baseMargin * 0.7,
  },
  callImg: { width: 39, height: 39, resizeMode: 'contain' },
  nameView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inpuOuter: {
    flex: 1,
    alignItems: 'flex-end',
  },
  inputCustom: {
    width: '95%',
  },
  warningsContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 18
  },
  iconInfo: {
    width: 24,
    height: 24,
    marginRight: 12
  },
  buttonFollowQA: {
    marginTop: 16,
    height: 53,
    width: 226
  },
  imageFollowQA: {
    height: '100%',
    width: 226
  }
})
