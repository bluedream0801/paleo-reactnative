import React, { useState, useContext, useEffect } from "react";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
  Image,
} from "react-native";
import * as Location from "expo-location";
import * as CommonActions from "@react-navigation/routers/src/CommonActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppContext from "../../provider";
import { appColors, appImages } from "../../theme";
import { Button, Header, Input, Text } from "../../components/";
import styles from "./Styles";
import Services from "../../services";
const { API } = Services;
import helpers from "../../helpers";
const { eye, location_ic, postcode_bg } = appImages;
const {
  validateEmail,
  getCity,
  getPostalCode,
  getArea,
  getState,
  getStreetNumber,
  getRoute,
  getSubLocalityLevel2,
  getCartType,
} = helpers;
const { darkGrey, green, black, orGrey } = appColors;

const PostCode = (props) => {
  const { navigation } = props;

  const {
    setIsApiLoaderShowing,
    setLoginData,
    loginData,

    cartData,
    mealsCartData,

    setMealsCartData,
    setCartData,

  } = useContext(AppContext);

  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");

  const { accountInfo, token, user_id } = loginData || {};

  useEffect(() => {}, []);

  const onStartShopping = () => {

    console.log('postcode',postcode);

    API.execute("postal.code", "search_read", [[["code","=",postcode]],["zone_id"]], {}, setIsApiLoaderShowing, { token, user_id }).then((data) => {
      console.log('data',data);
      if (data.length == 0) {
        // alert('Invalid Postcode');
        setPostcodeError("Invalid Postcode");
      } else {
        var vals = {};
        console.log('data[0].zone_id',data[0].zone_id);
        // Zone id null means Bankok.
        if (data[0].zone_id == null) {
          // alert('Bangkok Postcode');
          vals['zone_id'] = 31;
          API.execute("contact", "write", [[accountInfo.contact_id.id],vals], {}, setIsApiLoaderShowing, { token, user_id }).then( async (data) => {
            // alert('Redirect User to Homepage');
            await getUserData();
            navigation.navigate("login");
          }).catch((err) => {
            alert(err);
          });
        // Non BKK
        } else {
          // alert('Non BKK Postcode');
          vals['zone_id'] = 32;
          API.execute("contact", "write", [[accountInfo.contact_id.id],vals], {}, setIsApiLoaderShowing, { token, user_id }).then( async (data) => {

            // Reset values for Guest users that might come in with BKK values on their cart.
            var cartType = getCartType(cartData, mealsCartData);
            console.log('cartType',cartType);
            if (cartType!== null) {
              // If the user has a mealcart, we need to remove all his items (reset the cart)
              if (cartType == 'meal' || cartType == 'combined') {

                await API.execute("ecom2.cart", "empty_cart", [[global.mealsCartId]], {}, () => {}, { user_id: user_id, token: token });

                global.mealsCartId = null;
                setMealsCartData(null);
                global.freshMealsTimeSlotNew = null;

              }

              // If the user has a grocery cart, we need to reset his timeslot
              var vals={
                ship_address_id: null,
                delivery_slot_id: null, // Slots should be reset based on address for grocery cart
                delivery_date:null,
              }

              var load_cart = 'yes';
              await API.grocery_cart_write(
                vals,
                setMealsCartData,
                setCartData,
                cartType,
                load_cart,
                { token, user_id },
                'grocery_slot_and_address_change_app'
              );
            }

            // alert('Redirect User to Homepage');
            await getUserData();
            navigation.navigate("login");
          }).catch((err) => {
            alert(err);
          });
        }
      }
    }).catch((err) => {
      alert(err);
    });

  };

  const getUserData = () => {
    API.user_load({ user_id: user_id }, () => {})
      .then((response) => {
        let previousData = Object.assign({}, loginData)
        setLoginData({ ...previousData, accountInfo: response[0] })
      })
      .catch((err) => {
        alert(err)
      })
  }

  const onNavigateHome = () => {
    navigation.navigate("login");
  };

  const getMyCurrentLocation = async () => {
    setIsApiLoaderShowing(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log("location", location);
      const { latitude, longitude } = location.coords;
      const result = await fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          latitude +
          "," +
          longitude +
          "&key=" +
          "AIzaSyDUrjmRu9_HP8NBR_X0cwsF5q7EDBIVBSg"
      )
        .then((response) => response.json())
        .then((responseJson) => {
          const addString = JSON.stringify(responseJson);

          const parseString = JSON.parse(addString);

          const address = parseString.results[0].formatted_address,
            addressArray = parseString.results[0].address_components,
            city = getCity(addressArray),
            postal_code = getPostalCode(addressArray),
            area = getArea(addressArray),
            state = getState(addressArray),
            google_street_number = getStreetNumber(addressArray),
            google_route = getRoute(addressArray),
            google_sublocality_level_2 = getSubLocalityLevel2(addressArray),
            soi = google_street_number + " " + google_route;
          setIsApiLoaderShowing(false);

          const obj = {
            show: "confirmed_map",
            address: address ? address : "",
            area: area ? area : "",
            city: city ? city : "",
            postal_code: postal_code ? postal_code : "",
            state: state ? state : "",
            google_street_number: google_street_number
              ? google_street_number
              : "",
            google_route: google_route ? google_route : "",
            google_sublocality_level_2: google_sublocality_level_2
              ? google_sublocality_level_2
              : "",
            soi: soi ? soi : "",
            mapPosition: {
              lat: latitude,
              lng: longitude,
            },
          };
          const isEdit = false;
          navigation.navigate("AddAddressStepOne", {
            isEdit,
            addressObj: obj,
            fromPostCode: true,
          });
        });
    } catch (error) {
      setIsApiLoaderShowing(false);
      console.log(error);
    }
  };

  const clearInputs = () => {
    setPostcode("");
  };

  const clearErrors = () => {
    setPostcodeError("");
  };

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => Keyboard.dismiss()}
    >
      <ImageBackground source={postcode_bg} style={styles.bgImg}>
        {/* Body  */}
        <View style={styles.body}>
          <Text lineHeight={25} largeRegularPlus color={black} condensedBold>
            Where are we delivering to?
          </Text>
          <Input
            customStyles={{ marginTop: 0 }}
            label={" "}
            placeholder={"Enter your postcode, e.g. 10110"}
            value={postcode}
            inputStyle={styles.codeInput}
            inputViewStyle={styles.inputViewStyle}
            autoCapitalize="none"
            onChangeText={(text) => {
              setPostcode(text);
              clearErrors();
            }}
          />
          {postcodeError.length > 0 && <Text color={darkGrey}>{postcodeError}</Text>}

          <Button
            btnTitle={"Start shopping"}
            onPress={() => {
              onStartShopping();
            }}
          />
          {/*
          <Text color={orGrey} style={styles.heading}>
            OR
          </Text>
          <Button
            btnTitle={"Go Home (During Testing)"}
            onPress={() => {
              onNavigateHome();
            }}
          />
          <Text color={orGrey} style={styles.heading}>
            OR
          </Text>
          */}
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => getMyCurrentLocation()}
          >
            <Image source={location_ic} style={styles.location} />
            <Text regularPlus color={green} lineHeight={22}>
              Use my current location
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer  */}
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default PostCode;
