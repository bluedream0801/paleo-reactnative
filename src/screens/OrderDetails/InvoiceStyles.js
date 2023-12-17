import { StyleSheet } from 'react-native'
import { appColors, appMetrics, fontStyles } from '../../theme'
const {} = appMetrics
const { size } = fontStyles
const { white, lightGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  body: {
    backgroundColor: lightGrey,

    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
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
  subContainer: {
    marginTop: 50,
    flex: 1,
    backgroundColor: lightGrey,
    width: '100%',
  },
  btn: { marginTop: 20, width: 130, alignSelf: 'center', marginBottom: 22 },
  text: { fontSize: size.regularPlus },
})
