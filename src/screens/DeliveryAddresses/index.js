import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import styles from "./Styles";
import Address from "./Address";
import { AccountHeader, Text, Button } from "../../components/";
import { appColors } from "../../theme";
import { useFocusEffect } from "@react-navigation/native";
import AppContext from "../../provider";
import Services from "../../services";
const { API } = Services;
const { orderDarkGray, addressGrey } = appColors;
import helpers from "../../helpers";
const {
  getCartType,
} = helpers;

const DeliveryAddresses = (props) => {
  const { navigation } = props;

  const {
    setIsAddressNotificationShowing,
    setIsAddToOrderPopup,
    setIsNotificationShowing,
    loginData,
    setIsApiLoaderShowing,
    setLoginData,
    cartData, 
    mealsCartData,
    setMealsCartData,
    setCartData,
  } = useContext(AppContext);

  const { accountInfo, token, user_id } = loginData;
  const { addresses, default_address_id } = accountInfo.contact_id;
  const [addressesArray, setAddressesArray] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  console.log("loginData-- ", loginData);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onSaveAddress = (obj) => {
    navigation.navigate("AddNewAddress", { isEdit: false });
  };

  useEffect(() => {
    if (addresses.length > 1) {
      let defaultObj = null;
      if (default_address_id && default_address_id.id) {
        const otherAddresses = addresses.filter((x) => {
          if (x.id == default_address_id.id) {
            defaultObj = x;
          }
          return x.id !== default_address_id.id;
        });

        setDefaultAddress(defaultObj);
        setAddressesArray(otherAddresses);
      } else {
        getOrderHistory();
      }
    } else {
      if (addresses.length == 1) {
        setDefaultAddress(addresses[0]);
        setAddressesArray([]);
      }
    }
  }, [addresses]);

  const onSetDefault = (obj) => {
    const address_id = obj.id;
    API.execute(
      "ecom2.interface",
      "set_default_address",
      [address_id],
      {},
      setIsApiLoaderShowing,
      { user_id: user_id, token: token }
    ).then((res) => {
      
      var vals={
        ship_address_id: address_id,
        delivery_slot_id: null, // Slots should be reset based on address for grocery cart (unless it is a combined delivery)
        delivery_date: null,
      }
      
      var cartType = getCartType(cartData, mealsCartData);
      
      API.grocery_cart_write(
        vals,
        setMealsCartData,
        setCartData,
        cartType,
        'yes',
        { token, user_id },
        'grocery_slot_and_address_change_app'
      );
      
      console.log("red--", res);
      getUserData();
    });
  };

  const onEditAddress = (obj) => {
    const {
      address,
      bldg_name,
      coords,
      instructions_messenger,
      mobile,
      postal_code,
      soi,
      unit_no,
      zone_id,
    } = obj;

    var coords_split = coords ? coords.split(",") : ["13.7563", "100.5018"];

    const ediObj = {
      show: "confirmed_map", // map or confirmed_map
      address: address,
      // address_autocomplete: '',
      city: "",
      postal_code: postal_code,
      area: "",
      state: "",

      soi: soi,
      building_or_moo_ban_name: bldg_name,
      unit_house_number: unit_no,
      mobile_number: mobile,
      directions: instructions_messenger,

      google_street_number: "",
      google_route: "",
      google_sublocality_level_2: "",
      id: obj.id,
      mapPosition: {
        lat: parseFloat(coords_split[0]),
        lng: parseFloat(coords_split[1]),
      },
    };
    navigation.navigate("AddAddressStepTwo", {
      isEdit: true,
      addressObj: ediObj,
    });
  };
  const delete_address = (address_id) => {
    if (addresses.length <= 1) {
      alert(
        "Sorry, you need minimum one delivery address in your account. Please add a new address first before deleting this one."
      );
      return;
    }

    Alert.alert(
      "Delete address?",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            delete_address_call(address_id);
          },
        },
      ]
    );
  };

  const delete_address_call = async (address_id) => {
    await API.execute(
      "address",
      "archive",
      [[address_id]],
      {},
      setIsApiLoaderShowing
    )
      .then((data) => {
        getUserData();
      })
      .catch((err) => {
        // NF.upload_action("delete_address",err);
        alert("Error: " + err);
      });
  };

  const getOrderHistory = async () => {
    setIsApiLoaderShowing(true);
    try {
      var res = await API.execute(
        "sale.order",
        "search_read_path",
        [
          [["contact_id", "=", accountInfo.contact_id.id]],
          [
            "date",
            "number",
            "amount_total",
            "ecom_state",
            "plr_order_type",
            "due_date",
            "delivery_orders.state",
            "delivery_orders.delivered_time",
            "delivery_orders.time_delivered",
            "ship_address_id.address",
          ],
        ],
        {
          order: "date desc",
        },
        () => {}
      );

      if (res.length > 0) {
        let defaultObj = null;
        const otherAddresses = addresses.filter((x) => {
          if (x.id == res[0].ship_address_id.id) {
            defaultObj = x;
          }
          return x.id !== res[0].ship_address_id.id;
        });

        if (defaultObj) {
          setDefaultAddress(defaultObj);
          setAddressesArray(otherAddresses);
        } else {
          setDefaultAddress(null);
          setAddressesArray(addresses);
        }
      } else {
        setDefaultAddress(null);
        setAddressesArray(addresses);
      }
      setIsApiLoaderShowing(false);
    } catch (err) {
      setIsApiLoaderShowing(false);
      console.log("err", err);
    }
  };
  const getUserData = () => {
    API.user_load({ user_id: user_id }, setIsApiLoaderShowing)
      .then((response) => {
        const addressesData = response[0].contact_id.addresses
          ? response[0].contact_id.addresses
          : [];
        const defaultAddress = response[0].contact_id.default_address_id;

        let previousData = Object.assign({}, loginData);
        previousData.accountInfo.contact_id.addresses = Object.assign(
          [],
          addressesData
        );

        previousData.accountInfo.contact_id.default_address_id = Object.assign(
          {},
          defaultAddress
        );

        setLoginData(Object.assign({}, previousData));
      })
      .catch((err) => {
        alert(err);
      });
  };
  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [])
  );
  const renderDefaultAddress = () => {
    return (
      <View style={styles.defaultAddress}>
        <Text smallRegular color={orderDarkGray} style={styles.defaultHeading}>
          Default address
        </Text>

        <Address
          defaultAddress={true}
          isLastObj={true}
          addressObj={defaultAddress}
          onEditAddress={onEditAddress}
        />
      </View>
    );
  };

  const noDeliveryAddress = () => {
    return (
      <TouchableWithoutFeedback>
        <View style={styles.noAddress}>
          <Text
            smallTitle
            textAlign={"center"}
            condensedBold
            color={addressGrey}
            lineHeight={31}
          >
            You have no delivery{"\n"}
            addresses yet.
          </Text>
          <Button
            btnTitle={"Add new address"}
            onPress={() => onSaveAddress()}
            style={[styles.addBtnUpper]}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderOrdersList = () => {
    return (
      <View style={styles.orderList}>
        <ScrollView>
          {defaultAddress && (
            <Text
              smallRegular
              color={orderDarkGray}
              style={styles.defaultHeading}
            >
              Default address
            </Text>
          )}
          {defaultAddress && (
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              data={[0]}
              scrollEnabled={false}
              style={{ flex: 1 }}
              renderItem={({ item, index }) => {
                return (
                  <Address
                    defaultAddress={true}
                    isLastObj={true}
                    addressObj={defaultAddress}
                    onEditAddress={onEditAddress}
                  />
                );
              }}
            />
          )}

          {addressesArray.length > 0 && (
            <Text
              smallRegular
              color={orderDarkGray}
              style={[
                styles.heading,
                {
                  marginTop: 24,
                },
              ]}
            >
              {defaultAddress ? "Other saved addresses" : "Saved addresses"}
            </Text>
          )}
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={addressesArray}
            scrollEnabled={false}
            style={styles.orderListContainer}
            renderItem={({ item, index }) => {
              return (
                <Address
                  onEditAddress={onEditAddress}
                  onSetDefault={onSetDefault}
                  key={index}
                  defaultAddress={false}
                  addressObj={item}
                  isLastObj={addressesArray.length == index + 1}
                  onDeleteAddress={delete_address}
                />
              );
            }}
          />
        </ScrollView>
        <Button
          btnTitle={"Add new address"}
          onPress={() => onSaveAddress()}
          style={[styles.addBtn]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AccountHeader
        title={"Delivery addresses"}
        backArrow
        backPress={() => onBackPress()}
      />

      {addresses.length > 0 && renderOrdersList()}
      {addresses.length == 0 && noDeliveryAddress()}
    </View>
  );
};

export default DeliveryAddresses;

{
  /* <TouchableOpacity
style={{ flex: 1 }}
onPress={() => {
  setIsAddToOrderPopup(false)
  setIsAddressNotificationShowing(true)
  setIsNotificationShowing(true)
}} */
}
