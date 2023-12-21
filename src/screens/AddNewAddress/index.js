import React, { useState, useContext, useEffect } from 'react'
import { View, Image, TouchableOpacity, Keyboard } from 'react-native'
import styles from './Styles'
import { AccountHeader, Text, PopupModal } from '../../components/'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import * as Location from 'expo-location'
import AppContext from '../../provider'
import helpers from '../../helpers'
const {
  getCity,
  getPostalCode,
  getArea,
  getState,
  getStreetNumber,
  getRoute,
  getSubLocalityLevel2,
} = helpers
import { appColors, appImages, appMetrics } from '../../theme'
const {} = appMetrics
const { green, orGrey, darkGray, lessDarkGray, placeholderColor } = appColors
const {
  search_ic,
  location_ic,
  close,
  location_pin_ic,
  question_ic,
} = appImages

const PopupContent =
  'If you don’t see your address in the list, please search for a nearby landmark first (e.g. a school, temple, etc.). Then you can drag the map pin manually to your approximate address. You will confirm your exact written address at the second step.\n \nYou could also use your phone’s GPS to suggest your address by clicking the button below:'

const AddNewAddress = (props) => {
  const { navigation, route } = props
  const geoInputChild = React.useRef(null)
  const { setIsAnyPopupOpened, loginData, setIsApiLoaderShowing } = useContext(
    AppContext,
  )

  const { isEdit } = route.params

  const [showModal, setShowModal] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [addressIndex, setAddressIndex] = useState(0)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [inputLength, setInputLength] = useState(0)
  const onBackPress = () => {
    navigation.goBack()
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height)
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0)
      },
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  const onClickAddress = (rowData) => {
    var flow  = null;
    if (route.params) {
      if (route.params.flow) {
        flow = route.params.flow;
        console.log('Current Flow',flow);
      }
    }
    var deliveryDate = null;
    if (route.params) {
      if (route.params.deliveryDate) {
        deliveryDate = route.params.deliveryDate;
        console.log('Current Delivery Date',deliveryDate);
      }
    }
    
    if (isEdit) {
      navigation.navigate('AddAddressStepOne', {
        isEdit,
        addressObj: rowData,
        flow: flow,
        deliveryDate: deliveryDate,
      })
    } else
      navigation.navigate('AddAddressStepOne', {
        isEdit,
        addressObj: rowData,
        flow: flow,
        deliveryDate: deliveryDate,
      })
  }

  const onFocus = () => {
    setIsFocused(true)
    ///setIsKeyBoardOpen(true)
  }

  const onBlur = () => {
    setIsFocused(false)
    //setIsKeyBoardOpen(false)
  }

  const getMyCurrentLocation = async () => {
    setIsApiLoaderShowing(true)
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return
      }
      let location = await Location.getCurrentPositionAsync({})
      console.log('location', location)
      const { latitude, longitude } = location.coords
      const result = await fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          latitude +
          ',' +
          longitude +
          '&key=' +
          'AIzaSyDUrjmRu9_HP8NBR_X0cwsF5q7EDBIVBSg',
      )
        .then((response) => response.json())
        .then((responseJson) => {
          const addString = JSON.stringify(responseJson)

          const parseString = JSON.parse(addString)

          const address = parseString.results[0].formatted_address,
            addressArray = parseString.results[0].address_components,
            city = getCity(addressArray),
            postal_code = getPostalCode(addressArray),
            area = getArea(addressArray),
            state = getState(addressArray),
            google_street_number = getStreetNumber(addressArray),
            google_route = getRoute(addressArray),
            google_sublocality_level_2 = getSubLocalityLevel2(addressArray),
            soi = google_street_number + ' ' + google_route
          setIsApiLoaderShowing(false)
          onClickAddress({
            show: 'confirmed_map',
            address: address ? address : '',
            area: area ? area : '',
            city: city ? city : '',
            postal_code: postal_code ? postal_code : '',
            state: state ? state : '',
            google_street_number: google_street_number
              ? google_street_number
              : '',
            google_route: google_route ? google_route : '',
            google_sublocality_level_2: google_sublocality_level_2
              ? google_sublocality_level_2
              : '',
            soi: soi ? soi : '',
            mapPosition: {
              lat: latitude,
              lng: longitude,
            },
          })
        })
    } catch (error) {
      setIsApiLoaderShowing(false)
      console.log(error)
    }
  }

  const renderSearchbar = () => {
    const compStyles = [styles.searchInputContainer]
    if (isFocused) {
      compStyles.push({ borderColor: appColors.darkGrey })
    } else {
      compStyles.push({ borderColor: appColors.borderGrey })
    }

    return (
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          keyboardShouldPersistTaps="always"
          istViewDisplayed={false}
          placeholderTextColor="red"
          textInputProps={{
            placeholderTextColor: placeholderColor,
            onBlur: () => onBlur(),
            onFocus: () => onFocus(),
            onChangeText: (text) => {
              setInputLength(text.length)
            },
          }}
          suppressDefaultStyles={true}
          renderLeftButton={() => (
            <Image source={search_ic} style={styles.searchIc} />
          )}
          enablePoweredByContainer={false}
          ref={geoInputChild}
          fetchDetails={true}
          currentLocation={false}
          currentLocationLabel="Current location"
          placeholder="Enter address"
          apiOptions={{ language: 'th', region: 'th' }}
          styles={{
            container: styles.seachBarContainer,
            textInput: styles.searchBarTextInput,
            textInputContainer: compStyles,
            listView: styles.listView,
            separator: styles.separator,
          }}
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location
            const title = data.structured_formatting.main_text
            const address = data.structured_formatting.secondary_text

            const addressObj = details.formatted_address,
              address_autocomplete = geoInputChild.current.getAddressText(),
              addressArray = details.address_components,
              city = getCity(addressArray),
              postal_code = getPostalCode(addressArray),
              area = getArea(addressArray),
              state = getState(addressArray),
              google_street_number = getStreetNumber(addressArray),
              google_route = getRoute(addressArray),
              latValue = lat,
              lngValue = lng,
              google_sublocality_level_2 = getSubLocalityLevel2(addressArray),
              soi = google_street_number + ' ' + google_route

            onClickAddress({
              address: addressObj ? addressObj : '',
              address_autocomplete: address_autocomplete
                ? address_autocomplete
                : '',
              area: area ? area : '',
              city: city ? city : '',
              postal_code: postal_code ? postal_code : '',
              state: state ? state : '',
              google_street_number: google_street_number
                ? google_street_number
                : '',
              google_route: google_route ? google_route : '',
              google_sublocality_level_2: google_sublocality_level_2
                ? google_sublocality_level_2
                : '',
              soi: soi ? soi : '',
              mapPosition: {
                lat: latValue,
                lng: lngValue,
              },
            })
          }}
          query={{
            key: 'AIzaSyDUrjmRu9_HP8NBR_X0cwsF5q7EDBIVBSg',
            language: 'en',
            country: 'th',
            components: 'country:th',
          }}
          renderRow={(rowData, index) => {
            const title = rowData.structured_formatting.main_text
            const address = rowData.structured_formatting.secondary_text

            setAddressIndex(index)
            return (
              <View style={{ overflow: 'visible' }}>
                <View style={styles.cell}>
                  <Image style={styles.locationImg} source={location_pin_ic} />
                  <View style={styles.subCell}>
                    <Text reglar bold color={darkGray}>
                      {title}
                    </Text>
                    <Text
                      reglar
                      color={darkGray}
                      style={styles.normalText}
                      noOfLines={1}
                    >
                      {address}
                    </Text>
                  </View>
                </View>
              </View>
            )
          }}
        />
        <Text color={orGrey} style={styles.heading}>
          OR
        </Text>
        <TouchableOpacity
          style={styles.locationRow}
          onPress={() => getMyCurrentLocation()}
        >
          <Image source={location_ic} style={styles.location} />
          <Text regularPlus color={green}>
            Use my current location
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AccountHeader
        title={isEdit ? 'Edit address: New pin location' : 'Add new address'}
        backPress={() => onBackPress()}
        crossBtn={close}
      />

      {/* {renderOrdersList()} */}
      <View style={styles.body}>{renderSearchbar()}</View>

      {keyboardHeight > 10 && inputLength > 0 && (
        <TouchableOpacity
          onPress={() => {
            setShowModal(!showModal)
            setIsAnyPopupOpened(true)
          }}
          style={[
            styles.googleRow,
            {
              bottom: keyboardHeight + 15,
            },
          ]}
        >
          <Text extSmall color={lessDarkGray}>
            Google doesn't have my address
          </Text>
          <Image style={styles.infoImg} source={question_ic} />
        </TouchableOpacity>
      )}
      {showModal && (
        <View style={styles.modalContain}>
          <PopupModal
            heading={"Google doesn't have my address"}
            content={PopupContent}
            showPrivacyModal={showModal}
            getMyCurrentLocation={() => getMyCurrentLocation()}
            contentHeight={340}
            showBottomText={true}
            setShowPrivacyModal={() => {
              setShowModal(!showModal)
              setIsAnyPopupOpened(false)
            }}
          />
        </View>
      )}
    </View>
  )
}

export default AddNewAddress
