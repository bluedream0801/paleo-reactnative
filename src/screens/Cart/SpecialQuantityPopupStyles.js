import { StyleSheet } from 'react-native'

import { appColors } from '../../theme'

const { darkGrey, quantityGreen } = appColors

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  body: {
    backgroundColor: appColors.white,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
    height: 270,
  },
  crossBtn: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    top: 35,
  },
  crossImg: {
    width: 20,
    height: 20,
  },
  margin: {
    marginTop: 33,
  },
  description: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 17,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 52,
    marginTop: 14,
  },
  remove: {
    backgroundColor: darkGrey,
    flex: 1,
    marginHorizontal: 8,
  },
  addAnother: {
    backgroundColor: quantityGreen,
    flex: 1,
    marginHorizontal: 8,
  }
})
