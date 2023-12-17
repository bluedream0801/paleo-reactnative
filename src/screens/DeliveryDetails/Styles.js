import { StyleSheet } from "react-native";
import { appColors } from "../../theme";

export default styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    backgroundColor: appColors.white
  },
  deliveryMapImg: {
    height: 250,
    width: '100%',
    resizeMode: 'cover'
  },
  regionTextSection: {
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  deliveryPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deliveryPriceLeftColumn: {
    flex: 6
  },
  deliveryPriceRightColumn: {
    flex: 4
  },
  hSeparator: {
    borderRightColor: '#CBCBCB',
    borderRightWidth: 1
  },
  textBlock: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  badge: {
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 4
  }
});