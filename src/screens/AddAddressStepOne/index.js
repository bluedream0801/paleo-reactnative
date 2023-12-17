import React, { useState, useContext } from "react";
import { View, Image, TouchableOpacity, ImageBackground } from "react-native";
import styles from "./Styles";

import { AccountHeader, Text, Button } from "../../components/";
import * as Location from "expo-location";
import { appColors, appImages, appConstants } from "../../theme";
import AppContext from "../../provider";
const { accountSettingGray } = appColors;
const { close, large_location_pin, white_circle, location_black_ic } =
  appImages;
import helpers from "../../helpers";
const {
  getCity,
  getPostalCode,
  getArea,
  getState,
  getStreetNumber,
  getRoute,
  getSubLocalityLevel2,
} = helpers;
import Services from "../../services";
const { API } = Services;

const { LATITUDE_DELTA, LONGITUDE_DELTA } = appConstants;
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const AddAddressStepOne = (props) => {
  const { navigation, route } = props;
  const mapChild = React.useRef(null);
  const { isEdit, addressObj } = route.params;
  const { setIsApiLoaderShowing,
    loginData,
    setLoginData,
  } = useContext(AppContext);
  const [addressFromMap, setAddressFromMap] = useState(addressObj);
  const [mapIndex, setMapIndex] = useState(0);
  
  const { accountInfo, token, user_id } = loginData;
  
  const onselectAddress = () => {
    if (route.params.fromPostCode) {
      
      postcode = addressFromMap.postal_code;
      
      console.log('postcode',postcode);
      
      API.execute("postal.code", "search_read", [[["code","=",postcode]],["zone_id"]], {}, setIsApiLoaderShowing).then((data) => {
        console.log('data',data);
        if (data.length == 0) {
          alert('Invalid Postcode');
          getUserData();
          // setPostcodeError("Invalid Postcode");
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
      
    } else {
      
      console.log('Current Flow and Delivery Date', route.params.flow, route.params.deliveryDate);
      
      navigation.navigate("AddAddressStepTwo", {
        flow: route.params.flow,
        deliveryDate: route.params.deliveryDate,
        isEdit,
        addressObj: Object.assign(
          {},
          {
            ...addressFromMap,

            mobile_number: addressObj.mobile_number
              ? addressObj.mobile_number
              : "",
            directions: addressObj.directions ? addressObj.directions : "",
            building_or_moo_ban_name: addressObj.building_or_moo_ban_name
              ? addressObj.building_or_moo_ban_name
              : "",
            unit_house_number: addressObj.unit_house_number
              ? addressObj.unit_house_number
              : "",
            id: addressObj.id,
          }
        ),
      });
    }
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

  const onBackPress = () => {
    navigation.goBack();
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
          if (mapChild && mapChild.current) {
            mapChild.current.animateToRegion(
              {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
              1
            );
          }
          setAddressFromMap({
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
          });
        });
    } catch (error) {
      setIsApiLoaderShowing(false);
      console.log(error);
    }
  };

  const attemptReverseGeocodeAsync = async (obj) => {
    const { latitude, latitudeDelta, longitude, longitudeDelta } = obj;
    setIsApiLoaderShowing(true);
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

        console.log("parseString[0]; -", parseString.results);

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

        setAddressFromMap({
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
        });
        setIsApiLoaderShowing(false);
      });

    //   try {
    //     let result = await Location.reverseGeocodeAsync(obj)
    //     console.log('result--', result)
    // const {city, country,district,isoCountryCode,name,postalCode,region,street,subregion,timezone}= result
    //     setAddressFromMap(
    //       {
    //         address: addressObj ? addressObj : '',
    //         address_autocomplete: address_autocomplete
    //           ? address_autocomplete
    //           : '',
    //         area: area ? area : '',
    //         city: city ? city : '',
    //         postal_code: postal_code ? postal_code : '',
    //         state: state ? state : '',
    //         google_street_number: google_street_number
    //           ? google_street_number
    //           : '',
    //         google_route: google_route ? google_route : '',
    //         google_sublocality_level_2: google_sublocality_level_2
    //           ? google_sublocality_level_2
    //           : '',
    //         soi: soi ? soi : '',
    //         mapPosition: {
    //           lat: latitude,
    //           lng: longitude,
    //         },
    //       }

    //     )

    //   } catch (e) {
    //     console.log('ge error', e)
    //   } finally {
    //   }
  };
  const { area, address, mapPosition } = addressFromMap;
  const { lat, lng } = mapPosition;

  const onMapRegionChange = (obj) => {
    if (
      obj.latitude.toFixed(6) === lat.toFixed(6) &&
      obj.longitude.toFixed(6) === lng.toFixed(6)
    ) {
      return;
    }

    if (mapIndex > 0) {
      attemptReverseGeocodeAsync(obj);
    }
    setMapIndex(mapIndex + 1);
  };

  return (
    <View style={styles.container}>
      <AccountHeader
        title={isEdit ? "Edit address: New pin location" : "Select location"}
        backPress={() => onBackPress()}
        crossBtn={close}
        backArrow
      />
      <View style={styles.body}>
        {!route.params.fromPostCode && (
          <Text reglar color={accountSettingGray} style={styles.topText}>
            Step 1 of 2
          </Text>
        )}

        <View style={styles.mapContainer}>
          <MapView
            ref={mapChild}
            onRegionChangeComplete={onMapRegionChange}
            style={styles.map}
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            // region={{
            //   latitude: lat,
            //   longitude: lng,
            //   latitudeDelta: LATITUDE_DELTA,
            //   longitudeDelta: LONGITUDE_DELTA,
            // }}
            provider={PROVIDER_GOOGLE}
          />
          <Image source={large_location_pin} style={styles.mapPin} />
        </View>

        <TouchableOpacity
          style={styles.locationPin}
          onPress={() => {
            getMyCurrentLocation();
          }}
        >
          <ImageBackground source={white_circle} style={styles.whiteCirlce}>
            <Image
              style={styles.blackLocation}
              source={location_black_ic}
            ></Image>
          </ImageBackground>
        </TouchableOpacity>

        <Button
          btnTitle={"Select address"}
          onPress={() => onselectAddress()}
          style={[styles.addBtn]}
        />
      </View>
    </View>
  );
};

export default AddAddressStepOne;
