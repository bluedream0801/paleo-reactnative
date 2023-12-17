import { StyleSheet } from 'react-native'
import { appColors } from '../../theme'
const { overLay, transparent } = appColors

export default StyleSheet.create({
  modal: {
    backgroundColor: transparent,
    position: 'absolute',
    right: 0,
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
})
