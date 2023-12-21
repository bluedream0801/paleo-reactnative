import { StyleSheet, Platform } from 'react-native'

import { appMetrics } from '../../theme'

const { doubleBaseMargin, globalPadding } = appMetrics
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    flex: 1,
  },
  header: {
    backgroundColor: 'red',
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: doubleBaseMargin,
  },
  forgotRestImg: {
    width: 119,
    height: 124,
    resizeMode: 'contain',
    marginTop: doubleBaseMargin * 1.5,
    marginLeft: 28,
  },
  successTitle: { marginTop: doubleBaseMargin },
  emailText: { marginTop: globalPadding },
})
