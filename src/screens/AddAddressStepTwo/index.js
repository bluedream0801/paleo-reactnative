import React, { useState, useEffect, useContext } from "react";
import { View, Image, TouchableOpacity, ScrollView, Alert, Pressable } from "react-native";
import AppContext from "../../provider";
import styles from "./Styles";

import { AccountHeader, Text, Button, Input } from "../../components/";
import { appColors, appImages, appMetrics, appConstants } from "../../theme";
const {
  orderDarkGray,
  green,
  accountSettingGray,
  darkGray,
  lessDarkGray,
  darkGrey,
  sharpGreen,
  buttonOpacity,
  black,
} = appColors;
const { close, large_location_pin, small_chat_ic } = appImages;
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Services from "../../services";
const { API } = Services;
import helpers from "../../helpers";
import { ChatUs } from "../../components/ChatUs";
const {
  getCartType,
  groupBy2
} = helpers;

const { LATITUDE_DELTA, LONGITUDE_DELTA } = appConstants;

const AddAddressStepOne = (props) => {
  const { navigation, route } = props;
  const { isEdit, addressObj } = route.params;
  const { setIsApiLoaderShowing,
    loginData,
    setLoginData,
    cartData,
    mealsCartData,
    setMealsCartData,
    setCartData,  } = useContext(AppContext);
  const { accountInfo, token, user_id } = loginData;

  const { id } = accountInfo.contact_id;

  const {
    soi,
    address,
    mapPosition,
    area,
    state,
    mobile_number,
    city,
    postal_code,
    google_sublocality_level_2,
    directions,
    building_or_moo_ban_name,
    unit_house_number,
  } = addressObj;
  console.log("addressObj-", addressObj);
  const { lat, lng } = mapPosition;

  const [streetNumber, setStreetNumber] = useState(soi);
  const [building, setBuilding] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [postCode, setPostCode] = useState("");
  const [postCodeError, setPostCodeError] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [specialInstruction, setSpecialInstruction] = useState("");
  const [mapObj, setMapObj] = useState({ latitude: lat, longitude: lng });
  const onAddAddress = () => {
    if (isEdit) {
      confirmFinalAddressForEditing();
    } else confirmFinalAddress();
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const validateInputs = () => {
    if (
      postCode &&
      postCode.trim().length > 0 &&
      mobileNumber &&
      mobileNumber.trim().length > 0 &&
      houseNumber &&
      houseNumber.trim().length > 0
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    setStreetNumber(soi);
    setMobileNumber(mobile_number);
    setSpecialInstruction(directions);
    setBuilding(building_or_moo_ban_name);
    setHouseNumber(unit_house_number);
    setPostCode(postal_code);
    setMapObj({ latitude: lat, longitude: lng });
  }, [addressObj]);

  const onPressGoolgeAddress = () => {
    if (isEdit) {
      navigation.navigate("AddAddressStepOne", {
        isEdit: isEdit,
        addressObj: {
          ...addressObj,

          mobile_number,
          directions,
          building_or_moo_ban_name,
          unit_house_number,
        },
      });
    } else {
      navigation.goBack();
    }
  };
  const renderGoogleAddress = () => {
    return (
      <View>
        <View style={styles.pinLocationRow}>
          <Text color={orderDarkGray} smallRegular>
            Address (from Google)
          </Text>

          <TouchableOpacity onPress={() => onPressGoolgeAddress()}>
            <Text color={green} smallRegular>
              Edit pin location
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.whiteContainer} color={darkGray}>
          <Text regular>
            {area}
            {"\n"}
            {address}
          </Text>
        </View>
      </View>
    );
  };

  const confirmFinalAddressForEditing = async () => {

    var mobile_number = mobileNumber;
    mobile_number = mobile_number.replace(/\s+/g, "");

    let hasError = false;

    if (mobile_number.replace(/[^0-9\s]/, "").length != 10) {
      setMobileNumberError(
        "We found an issue with your mobile number. It should start with a zero and have 10 digits."
      );
      hasError = true;
    }

    console.log('Post code', postCode);
    if (!postCode) {
      setPostCodeError("Please enter your post code.");
      hasError = true;
    }

    if (hasError) {
      return;
    } else {
      // No errors

      if (state != "" && area != "" && city != "") {
        var stateObj = state;
        // Manipulation for the Province Name
        if (stateObj == "Krung Thep Maha Nakhon") {
          stateObj = "Bangkok";
        }

        var areaObj = area;
        // Manipulation for the District Name
        if (areaObj === undefined) {
          areaObj = "";
        }
        var area_with_no_khet = areaObj.replace("Khet ", "");

        var cityObj = city;
        var google_sublocality_level_2_Obj = google_sublocality_level_2;
        // Manipulation for the Subdistrict Name
        if (
          cityObj === undefined &&
          google_sublocality_level_2_Obj === undefined
        ) {
          // Do nothing in this scenario
        } else {
          var subdistrict_name = cityObj;
          // Depends on where we get this from
          if (cityObj === undefined) {
            subdistrict_name = google_sublocality_level_2_Obj;
          }
          var subdistrict_name_with_no_khwaeng = subdistrict_name.replace(
            "Khwaeng ",
            ""
          );
        }

        // Retrieving the ids from the database for later population
        var vals = {
          province: stateObj,
          district: area_with_no_khet,
          subdistrict: subdistrict_name_with_no_khwaeng,
        };

        var province_id = null;
        var district_id = null;
        var subdistrict_id = null;

        await API.execute(
          "address",
          "search_address",
          [vals],
          {},
          setIsApiLoaderShowing,
          { token: token, user_id: user_id }
        ).then((data) => {
          console.log("Mixed search result", data);
          province_id = data.province_id;
          district_id = data.district_id;
          subdistrict_id = data.subdistrict_id;
        });
      }

      var final_address_name = "";
      if (building != "") {
        final_address_name =
          building + ", " + streetNumber + ", " + houseNumber;
      } else {
        final_address_name = streetNumber + ", " + houseNumber;
      }

      var vals = {
        // address: this.state.address_autocomplete, // THIS IS USED AS NAME IN THE LISTINGS
        address: final_address_name, // THIS IS USED AS NAME IN THE LISTINGS

        address2: addressObj.address,
        postal_code: postCode,
        soi: streetNumber,
        coords: mapObj.latitude + "," + mapObj.longitude, // From retrieved data

        // province_id: province_id, // Retrieved from Netforce
        // district_id: district_id, // Retrieved from Netforce
        // subdistrict_id: subdistrict_id, // Retrieved from Netforce

        bldg_name: building,
        mobile: mobile_number,
        instructions_messenger: specialInstruction,
        unit_no: houseNumber,

        state: "confirmed",
      };

      if (state != "" && area != "" && city != "") {
        vals.province_id = province_id; // Retrieved from Netforce
        vals.district_id = district_id; // Retrieved from Netforce
        vals.subdistrict_id = subdistrict_id; // Retrieved from Netforce
      }

      // If the user is logged in we do this straight away // OTHERWISE WE NEED TO SAVE THE ADDRESS TO HIS ACCOUNT WHEN HE LOGS IN OR CREATES A NEW ACCOUNT

      vals.contact_id = id;
      const edit_address_id = addressObj.id;
      var current_address_id = 0;
      console.log("edited param", vals);
      await API.execute(
        "address",
        "write",
        [[edit_address_id], vals],
        {},
        setIsApiLoaderShowing,
        {
          token: token,
          user_id: user_id,
        }
      )
        .then((res) => {
          console.log("Edited Address ID", res);
        })
        .catch((err) => {
          alert(err);
        });

      await API.execute(
        "address",
        "set_zone",
        [[edit_address_id]],
        {},
        setIsApiLoaderShowing,
        { token: token, user_id: user_id }
      )
        .then((res) => {
          Alert.alert("Success", "Address has been added", [
            {
              text: "OK",
              onPress: () => {},
            },
          ]);

          navigation.goBack();
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const confirmFinalAddress = async () => {

    var flow = route.params.flow;

    // Add loading animation ?
    let hasError = false;

    var mobile_number = mobileNumber;
    mobile_number = mobile_number.replace(/\s+/g, "");

    if (mobile_number.replace(/[^0-9\s]/, "").length != 10) {
      setMobileNumberError(
        "We found an issue with your mobile number. It should start with a zero and have 10 digits."
      );
      hasError = true;
    }

    if (!postCode) {
      setPostCodeError("Please enter your post code.");
      hasError = true;
    }

    if (hasError) {
      return;
    } else {
      // No errors

      let stateString = state;
      // Manipulation for the Province Name
      if (stateString == "Krung Thep Maha Nakhon") {
        stateString = "Bangkok";
      }

      var areaString = area;
      // Manipulation for the District Name
      if (areaString === undefined) {
        areaString = "";
      }
      var area_with_no_khet = areaString.replace("Khet ", "");

      var cityString = city;
      var google_sublocality_level_String = google_sublocality_level_2;
      // Manipulation for the Subdistrict Name
      if (
        cityString === undefined &&
        google_sublocality_level_String === undefined
      ) {
        // Do nothing in this scenario
      } else {
        var subdistrict_name = cityString;
        // Depends on where we get this from
        if (cityString === undefined) {
          subdistrict_name = google_sublocality_level_String;
        }
        var subdistrict_name_with_no_khwaeng = subdistrict_name.replace(
          "Khwaeng ",
          ""
        );
      }

      // Retrieving the ids from the database for later population
      var vals = {
        province: stateString,
        district: area_with_no_khet,
        subdistrict: subdistrict_name_with_no_khwaeng,
      };

      var province_id = null;
      var district_id = null;
      var subdistrict_id = null;

      await API.execute(
        "address",
        "search_address",
        [vals],
        {},
        setIsApiLoaderShowing,
        { token: token, user_id: user_id }
      ).then((data) => {
        console.log("Mixed search result", data);
        province_id = data.province_id;
        district_id = data.district_id;
        subdistrict_id = data.subdistrict_id;
      });

      var final_address_name = "";
      if (building != "") {
        final_address_name =
          building + ", " + streetNumber + ", " + houseNumber;
      } else {
        final_address_name = streetNumber + ", " + houseNumber;
      }

      var vals = {
        // address: this.state.address_autocomplete, // THIS IS USED AS NAME IN THE LISTINGS
        address: final_address_name, // THIS IS USED AS NAME IN THE LISTINGS

        address2: address,
        postal_code: postCode,
        soi: streetNumber,
        coords: lat + "," + lng, // From retrieved data

        province_id: province_id, // Retrieved from Netforce
        district_id: district_id, // Retrieved from Netforce
        subdistrict_id: subdistrict_id, // Retrieved from Netforce

        bldg_name: building,
        mobile: mobile_number,
        instructions_messenger: specialInstruction,
        unit_no: houseNumber,

        state: "confirmed",
      };

      // If the user is logged in we do this straight away // OTHERWISE WE NEED TO SAVE THE ADDRESS TO HIS ACCOUNT WHEN HE LOGS IN OR CREATES A NEW ACCOUNT

      vals.contact_id = id;

      console.log("vals--", vals);

      var current_address_id = 0;

      if (isEdit) {
      } else {
        await API.execute(
          "address",
          "create",
          [vals],
          {},
          setIsApiLoaderShowing,
          {
            token: token,
            user_id: user_id,
          }
        )
          .then((res) => {
            console.log("Newly Added Address ID", res);
            current_address_id = res;
          })
          .catch((err) => {
            alert(err);
          });
      }

      await API.execute(
        "address",
        "set_zone",
        [[current_address_id]],
        {},
        setIsApiLoaderShowing,
        { token: token, user_id: user_id }
      )
        .then((res) => {
          console.log("Newly Added Zone for address", res);
          var address_zone_id = res[current_address_id];

          Alert.alert("Success","Address has been added");
          getUserData();

          console.log('Current Flow',flow);

          if (flow == 'cart') {
            // Type of cart is always combined, but just to be sure
            var cartType = getCartType(cartData, mealsCartData);
            if (cartType=='combined') {
              // We need to check if we have a single day (set it on both carts)
              var isSingleDay = isSingleDayDelivery();

              if (isSingleDay == true) {

                var date = mealsCartData.lines[0].delivery_date;

                var load_cart = 'no';
                var update_grocery = true;
                var update_mealcart = true;

                // Don't update the address on the cart if it is outside of bangkok because we have meals on the day
                if(address_zone_id == "" || address_zone_id == null || address_zone_id == "null" || address_zone_id == 32 || address_zone_id == 34) {
                  update_grocery = false;
                  update_mealcart = false;
                }

              } else {
                // Or if it is a combined with multiple days, we need to transmit for which day we are setting up the new address // route.params.deliveryDate
                var date = route.params.deliveryDate;

                var load_cart = 'no';
                var update_grocery = false;
                if (cartData.delivery_date== date || cartData.delivery_date == null) {
                  load_cart = 'yes';
                  update_grocery = true;
                }

                // Check if we have a mealplan date on the selected date
                var update_mealcart = false;
                if (mealsCartData.ship_addresses_days[date]) {
                  if (update_grocery == true) {
                    load_cart = 'no';
                  }
                  if (cartData.delivery_date == null) {
                    update_grocery = false;
                  }
                  var update_mealcart = true;
                }

                // Don't update the address on the cart if it is outside of bangkok because we have meals on the day
                if(address_zone_id == "" || address_zone_id == null || address_zone_id == "null" || address_zone_id == 32 || address_zone_id == 34) {
                  if ((mealsCartData.ship_addresses_days[date]) && cartData.delivery_date== date){
                    update_grocery = false;
                    update_mealcart = false;
                  } else if (mealsCartData.ship_addresses_days[date]){
                    update_mealcart = false;
                  }
                }
              }

              if ((update_grocery == true && update_mealcart == false) || (update_grocery == true && update_mealcart == true)){
                var vals={
                  ship_address_id: current_address_id,
                  delivery_slot_id: null, // Slots should be reset based on address for grocery cart (unless it is a combined delivery)
                  delivery_date: null, // Slots should be reset based on address for grocery cart (unless it is a combined delivery)
                }
              }

              console.log('Update Grocery',update_grocery);
              console.log('Update Mealplan',update_mealcart);
              console.log('Checking mealsCartData.ship_addresses_days[date]',mealsCartData.ship_addresses_days[date]);
              console.log('New Values', date, vals);

              if (update_grocery == true) {
                API.grocery_cart_write(
                  vals,
                  setMealsCartData,
                  setCartData,
                  cartType,
                  load_cart,
                  { token, user_id },
                  'grocery_change_slot_and_address_after_adding_address'
                );
              }

              if (update_mealcart == true) {

                var vals={
                  ship_address_id: current_address_id,
                }

              }


              if (update_mealcart == true) {
                API.meal_cart_update_delivery(
                  date,
                  vals,
                  setMealsCartData,
                  setCartData,
                  { token, user_id },
                  cartType,
                  'yes',
                  'meal_cart_update_delivery_after_adding_address'
                );
              }

              // If the address is correct then we add it to each cart day that might not have an address set up? ... or allow the user to do that manually (user can add other days afterwards)

            }

          }
          if (flow == 'checkout') {

            var cartType = getCartType(cartData, mealsCartData);

            console.log('cartType',cartType);

            if (cartType=='meal') {

              var date = mealsCartData.lines[0].delivery_date;

              var vals={
                ship_address_id: current_address_id,
              }

              var update_mealcart = true;
              if(address_zone_id == "" || address_zone_id == null || address_zone_id == "null" || address_zone_id == 32 || address_zone_id == 34) {
                update_mealcart = false;
              }

              if (update_mealcart == true) {
                API.meal_cart_update_delivery(
                  date,
                  vals,
                  setMealsCartData,
                  setCartData,
                  { token, user_id },
                  cartType,
                  'yes',
                  'meal_cart_update_delivery_after_adding_address'
                );
              }

            } else if (cartType=='grocery') {

              var date = cartData.delivery_date;

              var vals={
                ship_address_id: current_address_id,
                delivery_slot_id: null, // Slots should be reset based on address for grocery cart
                delivery_date:null,
              }

              var update_grocery = true;

              if (update_grocery == true) {
                API.grocery_cart_write(
                  vals,
                  setMealsCartData,
                  setCartData,
                  cartType,
                  load_cart,
                  { token, user_id },
                  'grocery_change_slot_and_address_after_adding_address'
                );
              }

            }

          }
          if (flow == 'container') {
            // Test, but don't think we need to do anything

          }
          // Default normal add address flow
          if (flow == null) {
            // Don't need to do anything

          }
          // Go back through the 3 steps
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();

        })
        .catch((err) => {
          alert(err);
        });

    }
  };

  // IsSingleDay
  const isSingleDayDelivery = () => {

    var isSingleDay = false;
    // On Homepage
    // The meal cart date should also be changed if there is a combined cart with only one days worth of meals and the meals day is the same as the grocery one
    const cartType = getCartType(cartData, mealsCartData);
    if (cartType === "combined") {
      if (cartData.delivery_date && mealsCartData.lines[0].delivery_date) {
        if (cartData.delivery_date == mealsCartData.lines[0].delivery_date) {
          const data = groupBy2(mealsCartData.lines, "delivery_date");
          if (Object.keys(data).length == 1) {
            isSingleDay = true;
          }
        }
      }
    }

    // console.log('isSingleDay',isSingleDay);
    return isSingleDay;

  }

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

  const renderConfirmDetails = () => {
    return (
      <View>
        <Text color={orderDarkGray} smallRegular style={styles.padding}>
          Confirm details
        </Text>
        <View style={styles.whiteContainer}>
          <Text color={darkGray}>
            Please confirm your written address details below. (Google doesn’t
            always get it right!) You only will do this once per address.
          </Text>
          <Input
            label={"Soi & street number*"}
            onChangeText={(text) => setStreetNumber(text)}
            value={streetNumber}
            placeholder={"E.g. 123 Sukhumvit Soi 55, Wattana"}
            customStyles={{ container: styles.inputViewStyle }}
          />
          <Input
            label={"Building OR housing project name"}
            placeholder={"E.g. Noble Remix "}
            customStyles={{ container: styles.inputViewStyle }}
            onChangeText={(text) => setBuilding(text)}
            value={building}
          />
          <View style={styles.inputRow}>
            <Input
              label={"Postcode*"}
              placeholder={""}
              onChangeText={(text) => {
                setPostCode(text);
                setPostCodeError("");
              }}
              value={postCode}
              customStyles={{ container: styles.inputBase }}
              keyboardType={"phone-pad"}
            />
            <Input
              label={"Unit / house number*"}
              placeholder={" E.g. Unit 42"}
              customStyles={{ container: styles.inputBase }}
              onChangeText={(text) => setHouseNumber(text)}
              value={houseNumber}
            />
          </View>
          {postCodeError.length > 0 && (
            <Text color={darkGrey}>{postCodeError}</Text>
          )}
          <Input
            label={"Mobile number*"}
            onChangeText={(text) => {
              setMobileNumber(text);
              setMobileNumberError("");
            }}
            value={mobileNumber}
            customStyles={{ container: styles.inputViewStyle }}
            keyboardType={"phone-pad"}
          />
          {mobileNumberError.length > 0 && (
            <Text color={darkGrey}>{mobileNumberError}</Text>
          )}

          <Input
            label={"Any other special directions to find your place?"}
            placeholder={"E.g. please leave at lobby"}
            onChangeText={(text) => setSpecialInstruction(text)}
            value={specialInstruction}
          />
        </View>
      </View>
    );
  };
  const renderButton = () => {
    return (
      <View style={styles.btnContainer}>
        <Button
          btnTitle={isEdit ? "Update address" : "Save address"}
          onPress={() => onAddAddress()}
          style={[
            styles.addBtn,
            { backgroundColor: validation ? black : buttonOpacity },
          ]}
        />
        <ChatUs></ChatUs>
      </View>
    );
  };
  const validation = validateInputs();

  return (
    <View style={styles.container}>
      <AccountHeader
        title={isEdit ? "Edit address" : "Add new address"}
        backPress={() => onBackPress()}
        crossBtn={close}
        backArrow
      />
      <View style={styles.body}>
        {!isEdit && (
          <Text regular color={accountSettingGray} style={styles.topText}>
            Step 2 of 2
          </Text>
        )}
        <ScrollView>
          <View style={styles.mapContainer}>
            <MapView
              region={{
                latitude: mapObj.latitude,
                longitude: mapObj.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              pitchEnabled={false}
              rotateEnabled={false}
              zoomEnabled={false}
              scrollEnabled={false}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
            />
            <Image source={large_location_pin} style={styles.mapPin} />
          </View>

          {renderGoogleAddress()}
          {renderConfirmDetails()}
          {renderButton()}
        </ScrollView>
      </View>
    </View>
  );
};

export default AddAddressStepOne;
