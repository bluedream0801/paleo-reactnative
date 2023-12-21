import { appColors, appMetrics } from '../../theme'
import { StyleSheet } from 'react-native'
const {
  smallMargin,
  doubleBaseMargin,
  baseMargin,
  globalPadding,
  IS_IOS,
} = appMetrics
const {
  lowOpacity,
  borderGrey,
  white,
  quantityGreen,
  whiteOpacity,
  greenOpacity,
  lightPink,
} = appColors

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: { flex: 1 },

  listStyle: {
    flex: 1,
  },
  cell: {
    height: 150,
    flex: 1,

    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',

    flexDirection: 'row',
    backgroundColor: white,
    borderBottomWidth: 1,
    borderColor: borderGrey,
  },
  ImgContainer: {

    overflow: 'hidden',
    height: 150,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    width:180
  },
  rightContainer: {
    flex: 1,

    height: '100%',
    paddingTop: baseMargin,
    overflow: 'visible',
  },
  inner: {
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',

    flex: 1,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  someMargin: {
    marginTop: 0,
  },
  bottomRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  taxRow: {
    flexDirection: 'row',
  },
  twoMargin: {
    marginTop: 2,
  },
  foureMargin: {
    marginTop: 2,
  },
  addImg: {
    width: 33,
    height: 28,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  priceContainer: {
    width: 33,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: quantityGreen,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  cellImg: {
    height: 149,
    resizeMode: 'contain',
    width: '101%',
    borderWidth: 0,
  },
  boldText: {
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 10,
  },
  seeAllTouch: {
    alignSelf: 'center',
    marginTop: globalPadding,
  },

  categeoryCell: {
    height: 206,
    width: 165,
    marginLeft: 10,
  },
  imgCategory: {
    width: 165,
    height: 206,
  },
  overlay: {
    height: 103,
    width: 165,
    resizeMode: 'contain',
  },
  categoryTitle: {
    position: 'absolute',
    top: globalPadding,
    left: doubleBaseMargin,
  },
  popularText: {
    marginTop: globalPadding,
    marginLeft: baseMargin,
    marginBottom: globalPadding,
  },
  bestseller: {
    right: 0,
    top: baseMargin,
    height: 15,

    justifyContent: 'center',
    alignItems: 'flex-end',

    backgroundColor: greenOpacity,
    borderWidth: 1,
    borderColor: whiteOpacity,
    alignSelf: 'flex-end',
    paddingHorizontal: 9,

    overflow: 'visible',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  notAvailable: {
    width: 120,
    height: 34,
    backgroundColor: lowOpacity,
    position: 'absolute',
    bottom: baseMargin,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  notAvailableImg: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: smallMargin,
    paddingTop: IS_IOS ? 4 : 2,
  },
  Unavailable: {
    width: '100%',
    height: 54,
    backgroundColor: lowOpacity,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekContainer: {
    backgroundColor: lightPink,
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 10,
  },
  weekDescription: {
    marginTop: 10,
    marginBottom: 17,
  },
})
