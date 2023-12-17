import { StyleSheet } from 'react-native'
import { appColors, appMetrics } from '../../theme'
const {
  marginHorizontal,
  borderRadius,
  doubleBaseMargin,
  headerHeight,
} = appMetrics
const { white, lightGrey } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  orderList: {
    borderRadius: borderRadius,
    flex: 1,
    overflow: 'hidden',
    marginTop: doubleBaseMargin,
  },
  orderListContainer: {
    flex: 1,
  },
  body: {
    backgroundColor: white,

    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  defaultAddress: {
    height: 125,
  },
  defaultHeading: {
    marginBottom: marginHorizontal,
  },
  heading: {
    marginBottom: marginHorizontal,
    marginTop: doubleBaseMargin,
  },
  addBtn: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAddress: {
    flex: 1,
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: marginHorizontal,
    marginBottom: 30,
    position: 'absolute',
    left: 0,
    right: 0,
    top: headerHeight,
    bottom: 0,
  },
  addBtnUpper: {},
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
  margin: {
    marginTop: doubleBaseMargin * 0.9,
  },
  topHeader: {
    height: 39,
    backgroundColor: lightGrey,
    paddingHorizontal: marginHorizontal,
    paddingTop: 15,
  },
})
