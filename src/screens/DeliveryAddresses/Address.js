import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { appColors, appImages } from "../../theme";
import Text from "../../components/Text";
import styles from "./AddressStyles";

const { address_phone_ic } = appImages;
const { addressGrey, green, accountSettingGray } = appColors;
const Address = (props) => {
  const {
    isLastObj,
    defaultAddress,
    onEditAddress,
    addressObj,
    onDeleteAddress,
    onSetDefault,
  } = props;
  const { address, postal_code, id, mobile, zone_id } = addressObj;

  if (zone_id == null || zone_id == "null") {
    return null;
  }

  const editAddress = () => {
    onEditAddress(addressObj);
  };
  const setDefault = () => {
    onSetDefault(addressObj);
  };
  const deleteAddress = () => {
    onDeleteAddress(id);
  };

  const renderLastOrdersSection = () => {
    return (
      <View style={styles.orderSection}>
        <View style={styles.row}>
          <Text
            regularPlus
            color={accountSettingGray}
            style={styles.flexText}
            numberOfLines={2}
          >
            {address}
          </Text>
          {!defaultAddress && (
            <TouchableOpacity onPress={() => deleteAddress()}>
              <Image style={styles.delete} source={appImages.delete_ic} />
            </TouchableOpacity>
          )}
        </View>

        <View>
          <Text color={addressGrey} smallRegular>
            {postal_code}
          </Text>
          <View style={styles.phoneRow}>
            <Image source={address_phone_ic} style={styles.phoneIc} />
            <Text color={accountSettingGray} smallRegular>
              {mobile}
            </Text>
          </View>

          <View style={styles.smallViewRow}>
            <TouchableOpacity onPress={() => editAddress()}>
              <Text smallRegular color={green}>
                Edit address
              </Text>
            </TouchableOpacity>
            {!defaultAddress && (
              <TouchableOpacity
                onPress={() => {
                  setDefault();
                }}
              >
                <Text smallRegular color={green}>
                  Change to default
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomWidth: isLastObj ? 0 : 1,
        },
      ]}
    >
      {renderLastOrdersSection()}
    </View>
  );
};

export default Address;
