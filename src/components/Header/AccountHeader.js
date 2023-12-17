import React, { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { appColors, appMetrics } from "../../theme";
import styles from "./AccountHeaderStyles";
import appImages from "../../theme/appImages";
import AppContext from "../../provider";
const { black_back_ic, cro } = appImages;
const AccountHeader = (props) => {
  const insets = useSafeAreaInsets();
  const { isNotificationShowing } = useContext(AppContext);
  const { backArrow, crossBtn, ...rest } = props;
  const compStyles = [{ ...styles.container }, { marginTop: insets.top, height: appMetrics.headerHeight }];
  const textStyles = [{ ...styles.title }];

  textStyles.push({ color: appColors.black });
  if (isNotificationShowing) {
    compStyles.push({ marginTop: 0, height: appMetrics.headerHeight });
  }

  return (
    <View style={[...compStyles]} {...rest}>
      <TouchableOpacity
        style={styles.leftBtn}
        activeOpacity={0.7}
        onPress={props.backPress}
      >
        {backArrow && (
          <Image
            source={black_back_ic}
            style={styles.backImg}
            resizeMode={"contain"}
          />
        )}
      </TouchableOpacity>

      <Text style={[textStyles]}>{props.title}</Text>
      <TouchableOpacity
        style={styles.rightBtn}
        activeOpacity={0.7}
        onPress={props.backPress}
      >
        {crossBtn && (
          <Image
            source={crossBtn}
            style={styles.crossImg}
            resizeMode={"contain"}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AccountHeader;
