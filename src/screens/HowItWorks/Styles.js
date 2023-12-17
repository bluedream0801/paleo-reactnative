import { StyleSheet } from "react-native";
import { appColors, appMetrics } from "../../theme";

export default styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    backgroundColor: appColors.white
  },
  section: {
    margin: appMetrics.baseMargin,
  },
  textBlock: {
    marginTop: appMetrics.baseMargin
  },
  tipBlock: {
    backgroundColor: appColors.blueLightOpacity,
    padding: appMetrics.baseMargin
  },
  imageSectionHeader: {
    minHeight: 130,
    marginHorizontal: -appMetrics.marginHorizontal,
    display: 'flex',
    alignItems: 'flex-start'
  },
  spacerView: {
    height: 102,
    backgroundColor: appColors.transparent
  },
  imageHeader: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 130,
    resizeMode: 'cover',
  },
  textHeader: {
    width: 'auto',
    minHeight: 28,
    paddingHorizontal: appMetrics.baseMargin,
    paddingVertical: 3,
    borderTopRightRadius: 5,
    backgroundColor: appColors.white
  }
});