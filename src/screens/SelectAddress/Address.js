import React, { useMemo } from "react";
import { View } from "react-native";
import { appColors, appImages } from "../../theme";
import Text from "../../components/Text";
import styles from "./AddressStyles";

const { addressGrey, accountSettingGray, darkGrey } = appColors;
const Address = (props) => {
  const { defaultAddress, index, addressObj, fromCart, disable_address, notify_on_non_bkk_restrictions} = props;
  const { address, postal_code} = addressObj;
  
  var usedColor = accountSettingGray;
  var message = postal_code;
  
  if (disable_address == true) {
    usedColor = addressGrey;
    message = "Cannot deliver Fresh Meals outside Bangkok";
  }
  
  if (notify_on_non_bkk_restrictions == true) {
    usedColor = darkGrey;
    message = "Some items cannot be delivered to this address";
  }
  
  return (
    <View
      style={[
        styles.container,
        {
          borderTopWidth: index == 0 ? 1 : 0,
        },
      ]}
    >
      <View style={styles.orderSection}>
        <View style={styles.row}>
          <Text
            regularPlus
            color={disable_address ? addressGrey : accountSettingGray}
            style={[styles.flexText, disable_address && styles.disabledText]}
            numberOfLines={2}
          >
            {address}
          </Text>
          {!defaultAddress && (
            <View style={styles.delete} source={appImages.delete_ic} />
          )}
        </View>

        <View>
          <Text
            color={usedColor}
            smallRegular
          >
            {message}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Address;
