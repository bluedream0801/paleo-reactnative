import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./Styles";
import Address from "./Address";
import { Text } from "../../components/";
import { appColors, appImages } from "../../theme";
import AppContext from "../../provider";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
const { orderDarkGray, blackOpacity, black } = appColors;

const SelectAddress = (props) => {
  const {
    navigation,
    setShowAddressModal,
    showAddressModal,
    setSelectedAddress,
    fromCart,
    addressArray,
    cartType,
    selectedSection,
    flow,
    deliveryDate,
    cartData
  } = props;
  const { loginData } = useContext(AppContext);
  const { accountInfo } = loginData;

  const [addressesArray, setAddressesArray] = useState(addressArray);

  useEffect(() => {
    console.log('addressArray',addressArray)
    setAddressesArray(addressArray);
  }, [addressArray]);

  const onEditAddress = () => {
    navigation.navigate("AddAddressStepTwo", { isEdit: true });
  };

  useFocusEffect(useCallback(() => {}, []));

  const renderAddressList = () => {
    return (
      <View style={styles.orderList}>
        <View style={styles.topHeader}>
          <Text smallRegular color={orderDarkGray}>
            Saved addresses
          </Text>
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={addressesArray}
          style={styles.orderListContainer}
          renderItem={({ item, index }) => {
            
            console.log('selectedSection',selectedSection, item);
            
            var disable_address = false;
            var notify_on_non_bkk_restrictions = false;
            
            if (cartType=='container') {
              /*
              if (item.zone_id == null || item.zone_id == "null" || item.zone_id == 32 || item.zone_id == 34) {
                disable_address_container = true;
              }
              */
            } else {
              if ((cartType == 'meal') || (selectedSection=='meal')){
                if (item.zone_id == null || item.zone_id == "null" || item.zone_id == 32 || item.zone_id == 34) {
                  disable_address = true;
                }
              }
              if ((cartType != 'meal') && (selectedSection!='meal')) {
                if (item.zone_id == null || item.zone_id == "null" || item.zone_id == 32 || item.zone_id == 34) {
                  const cartLinesArray = cartData.lines;
                  for (let index = 0; index < cartLinesArray.length; index++) {
                    if (cartLinesArray[index].product_id.zones_excl.length >0) {
                      var notify_on_non_bkk_restrictions = true;
                      console.log('cartLinesArray[index].product_id.zones_excl',cartLinesArray[index].product_id.zones_excl);
                    }
                  }
                }
              }
            }
            
            return (
              <TouchableOpacity
                onPress={() => {
                  if (disable_address == false) {
                    setSelectedAddress(item);
                    setShowAddressModal();
                  }
                }}
              >
                <Address
                  onEditAddress={() => onEditAddress()}
                  key={index}
                  defaultAddress={false}
                  titleText={item.titleText}
                  isLastObj={false}
                  index={index}
                  fromCart={fromCart}
                  addressObj={item}
                  disable_address={disable_address}
                  notify_on_non_bkk_restrictions={notify_on_non_bkk_restrictions}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };
  
  console.log('Current Flow',flow, deliveryDate);

  return (
    <Modal
      testID={"modal"}
      isVisible={showAddressModal}
      backdropColor={blackOpacity}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={() => {
        setShowAddressModal(false);
      }}
      useNativeDriverForBackdrop
      swipeDirection={["down"]}
    >
      <TouchableWithoutFeedback onPress={() => setShowAddressModal(false)}>
        <View style={[styles.container]}>
          <View style={[styles.body, { height: "90%" }]}>
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => setShowAddressModal(false)}
            >
              <Image
                source={appImages.close}
                style={styles.crossImg}
                resizeMode={"contain"}
              />
            </TouchableOpacity>

            <Text condensedBold largeRegularPlus style={styles.margin}>
              Select address
            </Text>
            <View style={styles.container}>
              {renderAddressList()}
              <TouchableOpacity
                style={[styles.addBtn]}
                onPress={() => {
                  setShowAddressModal(false);
                  navigation.navigate("AddNewAddress", { isEdit: false, flow: flow, deliveryDate: deliveryDate });
                }}
              >
                <Text regularPlus color={black}>
                  Add new address
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectAddress;
