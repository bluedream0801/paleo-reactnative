import { StyleSheet } from 'react-native'
import { appColors, appMetrics, appFonts } from '../../theme'
const {
  marginHorizontal,
  borderRadius,
  doubleBaseMargin,
  marginVertical,
  smallMargin,
  screenWidth,
} = appMetrics
const { white, switchBorder, borderGrey, blackOpacity } = appColors
export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderList: {
    marginHorizontal: marginHorizontal,
    borderRadius: borderRadius,
    flex: 1,
    overflow: 'hidden',
    marginTop: doubleBaseMargin,
    position: 'absolute',
    top: 40,
    width: '100%',
    backgroundColor: white,
  },
  orderListContainer: {
    flex: 1,
  },
  defaultAddress: {
    height: 125,
  },
  defaultHeading: {
    marginBottom: marginHorizontal,
  },
  heading: {
    marginTop: marginVertical * 2,
  },
  addBtn: {
    marginBottom: 30,
  },
  body: {
    flex: 1,
    backgroundColor: white,

    paddingHorizontal: marginHorizontal,
  },
  addBtnUpper: {
    marginTop: marginHorizontal * 3,
  },
  inputViewStyle: {
    backgroundColor: white,
    borderColor: switchBorder,
  },
  inputStyle: {},
  leftIconStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: marginHorizontal,
  },
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: marginHorizontal,
  },
  location: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: marginHorizontal * 0.8,
  },
  locationRow: {
    flexDirection: 'row',
    marginTop: marginVertical,
    alignItems: 'center'
  },
  cell: {
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: borderGrey,

    alignItems: 'center',
    paddingHorizontal: smallMargin,
    backgroundColor: white,
    zIndex: 6,

    width: screenWidth - 20,
    overflow: 'visible',
  },
  locationImg: {
    width: 14,
    height: 20,
    resizeMode: 'contain',
    marginRight: marginHorizontal,
    marginBottom: 13,
  },
  infoImg: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginLeft: smallMargin,
  },
  googleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 5,
    height: 32,
    width: '100%',
    borderColor: borderGrey,

    position: 'absolute',
    bottom: 20,
    zIndex: 30,
    width: screenWidth - 20,
    backgroundColor: white,
  },
  normalText: {
    fontWeight: 'normal',

    width: '100%',
  },
  modalContain: {
    backgroundColor: blackOpacity,
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  subCell: { flex: 1, width: '100%' },
  searchBarTextInput: {
    fontSize: 16,
    fontFamily: appFonts.GTWalsheim_Regular,
    flex: 1,
    paddingHorizontal: 10,
  },
  seachBarContainer: {
    alignContent: 'center',
    width: screenWidth - 20,
  },
  searchInputContainer: {
    borderWidth: 0.8,
    borderColor: appColors.switchBorder,
    borderRadius: 5,
    paddingLeft: 8,
    flexDirection: 'row',
    height: 40,    
    width: '100%',
    alignItems: 'center',
  },
  searchMain: {
    flexDirection: 'row',
    borderWidth: 0.8,

    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: appColors.borderGrey,
    paddingLeft: 8,
  },
  searchIc: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  separator: {
    height: 0,
    backgroundColor: 'blue',
    marginVertical: 0,
    margin: 0,
    padding: 0,
  },
})
