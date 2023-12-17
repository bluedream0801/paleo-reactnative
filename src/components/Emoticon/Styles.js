import { StyleSheet } from 'react-native'

import { appColors } from '../../theme'

export default styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  emoticonContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.emoticonBg,
    borderRadius: 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // paddingLeft: 10,
    // paddingRight: 10,
    margin: 'auto',
    height: 24,
  },
  selectedContainer: {
    flexDirection: 'row',
    backgroundColor: appColors.emoticonBg,
    borderRadius: 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // paddingLeft: 10,
    // paddingRight: 10,
    margin: 'auto',
    height: 24,
  },
  emoticonImage: {
    marginTop: 'auto',
    marginBottom: 'auto',
    // marginLeft: 10,
    width: 36,
    height: 23,
    // backgroundColor: '#E00',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  emoticonImageSmall: {
    paddingLeft:4,
    paddingRight:4,
    marginTop: 'auto',
    marginBottom: 'auto',
    // marginLeft: 10,
    width: 16,
    height: 23,
    // backgroundColor: '#E00',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emoticonText: {
    // marginTop: 5,
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 15,
    color: appColors.quantityGreen
  }
})
