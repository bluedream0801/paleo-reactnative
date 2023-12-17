import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import styles from "./BeveragesStyles";
import { appColors, appImages, appConstants } from "../../theme";
import { Text } from "../../components/";
import FastImage from "react-native-fast-image";
const {
  textDarkGray,
  black,
  accountSettingGray,
  white,
  darkGrey,
  transparent,
  addressGrey,
} = appColors;
const { SNAKES } = appConstants;
import Modal from "react-native-modal";
import TimeSlot from "../PickupTimeSlot";
import { createDaysArray } from "../PickupTimeSlot";
import moment from "moment";
import AppContext from "../../provider";
import provider from "../../firebase/ProductsProvider";
const { getProductsDataMeals } = provider;
import helpers from "../../helpers";
const {
  get_thumbnail,
  getDefaultDateForFreshMeals,
  groupBy2,
  getCartType,
  meal_cart_total_qty
} = helpers;
import FreshMealsDetails from "../FreshMealsDetails";
const { add_fav_btn_ic, red_calander_ic } = appImages;
import Services from "../../services";
const { API } = Services;
import { CUTOFF_TIME } from "../../common/constants";
import ProductQuantityEdit from "../Products/ProductQuantityEdit";
import * as momenttz from 'moment-timezone';

const Beverages = (props) => {
  const {
    navigation,
    tabLabel,
    productsIdsArray,
    setIsApiLoaderShowing,
    dateFrom,
    dateTo,
    timeSlotForDelivery,
    setSelectedFreshMealsTime
  } = props;
  const {
    setIsAnyPopupOpened,
    isApiLoaderShowing,
    mealsCartData,
    setMealsCartData,
    loginData,
    setIsAnyApiLoading,
    isAnyApiLoading,
    cartData,
    setCartData,
  } = useContext(AppContext);

  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
    var { contact_id } = accountInfo;
    var { default_address_id, addresses } = contact_id;
  } else {
    var user_id = null;
    var token = null;
  }
  
  console.log("mealsCartData---on bav", mealsCartData);
  
  const [showModalTime, setShowModalTime] = useState(false);
  const [itemsArray, setItemsArray] = useState([]);
  const [showFreshDetailsModal, setShowFreshDetailsModal] = useState(false);
  const [selectedFreshMealsObj, setSelectedFreshMealsObj] = useState(null);

  const defaultDate = getDefaultDateForFreshMeals();
  const { formattedTomorrow } = defaultDate;

  useEffect(() => {
    if (productsIdsArray.length > 0) {
      getProducts();
    } else {
      setItemsArray([]);
    }
  }, [dateFrom, dateTo]);

  const getProducts = async () => {
    setItemsArray([]);
    if (productsIdsArray.length > 0) {
      const array = await getProductsDataMeals(productsIdsArray, setIsApiLoaderShowing);

      const updatedArray = [];
      for (let index = 0; index < array.length; index++) {
        updatedArray.push({
          ...array[index],
          quantity: 0,
        });
      }
      setItemsArray(updatedArray);
    } else {
      setItemsArray([]);
    }
  };

  const getOrderHistory = async () => {
    let defaultObj = null;

    // Not used anymore and not sure why it's needed
    /*
    if (orderHistoryData.length > 0) {
      const otherAddresses = addresses.filter((x) => {
        if (x.id == res[0].ship_address_id.id) {
          defaultObj = x;
        }
        return x.id !== res[0].ship_address_id.id;
      });

      if (defaultObj) {
        return defaultObj;
      } else {
        return null;
      }
    } else {
    */
      return null;
    // }
  };

  const getDefaultAddress = () => {
    if (addresses.length > 1) {
      let defaultObj = null;
      if (default_address_id && default_address_id.id) {
        const otherAddresses = addresses.filter((x) => {
          if (x.id == default_address_id.id) {
            defaultObj = x;
          }
          return x.id !== default_address_id.id;
        });

        return defaultObj;
      } else {
        return getOrderHistory();
      }
    } else {
      if (addresses.length == 1) {
        return addresses[0];
      }
    }
  };

  const selectQuantity = (obj, j) => {
    const array = Object.assign([], itemsArray);

    for (let index = 0; index < array.length; index++) {
      if (index == j) {
        array[j].quantity = obj.quantity;
      }
    }

    const previousQuantity = getItemQuantity(array[j]);
    addToCart(array[j], obj.quantity, previousQuantity);
  };

  const renderTextContent = (obj, index) => {
    const {
      ecom_short_title,
      sale_price,
      ecom_short_subtitle,
      docId,
    } = obj;
    const quantity = getItemQuantity(obj);

    return (
      <View style={styles.rightContainer}>
        <View style={styles.inner}>
          <View>
            <View style={styles.headingRow}></View>
            <Text bold smallRegular color={accountSettingGray}>
              {ecom_short_title}
            </Text>
            <Text extSmall color={accountSettingGray} lineHeight={20}>
              {ecom_short_subtitle}
            </Text>
          </View>

          <View>
            <View style={styles.bottomRow}>
              <View style={styles.priceRow}>
                {sale_price && (
                  <Text condensedBold color={black} style={styles.margin}>
                    {"฿" + sale_price}
                  </Text>
                )}
                {sale_price && (
                  <Text maxMini bold color={textDarkGray} style={styles.exvat}>
                    {" EX VAT"}
                  </Text>
                )}
              </View>
              <Pressable style={{ position: 'absolute', right: 0, bottom: 0, height: 34, width: '100%'}}>
                <ProductQuantityEdit
                  quantity={quantity}
                  isOutOfStock={false}
                  disabled={isAnyApiLoading}
                  onSelectQuantity={(newQuantity, callback) => {
                    selectQuantity({ quantity: newQuantity }, index);
                    callback(true);
                  }}
                  product_id={docId}
                  buttonRightMargin={0}
                  max_qty={999}
                  sale_qty_multiple={1}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderListItem = (obj, index) => {
    const { image } = obj;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedFreshMealsObj(obj);
          setShowFreshDetailsModal(true);
        }}
      >
        <View
          key={index}
          style={[
            styles.cell,
            {
              height: tabLabel == "Beverages" ? 140 : 110,
              marginBottom: 0,
            },
          ]}
        >
          <View
            style={[
              styles.ImgContainer,
              {
                flex: tabLabel == "Beverages" ? 0.5 : 0.66,
              },
            ]}
          >
            {image && (
              <FastImage
                source={{ uri: get_thumbnail(image, 256) }}
                style={[
                  styles.cellImg,
                  {
                    marginLeft: tabLabel == "Beverages" ? 0 : 0,

                    height: tabLabel == "Beverages" ? 105 : 110,

                    width: tabLabel == "Beverages" ? "100%" : "100%",
                  },
                ]}
              ></FastImage>
            )}
          </View>
          {renderTextContent(obj, index)}
        </View>
      </TouchableOpacity>
    );
  };

  // Slots Related
  const addToCart = (obj, quantity, previousQuantity) => {

    if (checkIsPastCutOffTime() == true) {
      var selected_date = formattedTomorrow;
      var selected_interval = 3;
    } else {
      // Not sure why we need the if here ... debug later
      var selected_date = global.freshMealsTimeSlotNew.completeDate;
      var selected_interval = global.freshMealsTimeSlotNew.slotId;;
    }

    // Zone Checkup
    var selected_address = "";
    var user_zone_id = "";

    // Scenarios
    // If user has addresses under his account then we use the normal flow
    if (loginData) {
      if(contact_id.addresses.length>0) {
        // Normal flow
        const defaultAddress = getDefaultAddress();
        if (defaultAddress) {
          const { zone_id, id } = defaultAddress;
          selected_address = id;
          user_zone_id = zone_id;
        }

      } else if (contact_id.zone_id!==null){
        // Zone_id flow
        selected_address = null;
        user_zone_id = contact_id.zone_id;
      }
    } else {
      selected_address = null;
      // We assume they are in Bangkok
      user_zone_id = 31;
    }

    console.log('Checking 2', selected_address, user_zone_id);


    // Trigger Popus
    if ( selected_address == "" || user_zone_id == "" || user_zone_id == null || user_zone_id == "null" || user_zone_id == 32 || user_zone_id == 34) {
      alert("Your default address is out of our Delivery Area. Please add another address.");
    } else {
      // If the product is not available for a specific week, then do not add it
      var date_from = dateFrom;
      var date_to = dateTo;

      const id = parseInt(obj.docId);

      if (moment(selected_date).isBetween(date_from, date_to, null, "[]") == true) {
        var product_quantity = quantity;
        API.meal_cart_set_qty_simple(
          selected_date,
          id,
          product_quantity,
          selected_address,
          selected_interval,
          setMealsCartData,
          setCartData,
          'meal',
          setIsAnyApiLoading,
          { token, user_id },
          'mealcart_add_to_cart_app',
          (err) => {}
        ).then(() => {

          // console.log('Do we have the error here');
          // APP automations
          // If we have a grocery cart (we always do, even if with no lines)
          if (cartData) {
            // Sometimes there might not be a Grocery Cart ?! // Double check this scenario.
            
            // Review this as it gives an error in the console
            var number_of_meal_delivery_days = 0;
            var selected_date_is_in_cart = false;

            if (mealsCartData) {

              number_of_meal_delivery_days = Object.keys(mealsCartData.ship_addresses_days).length;

              var order_by_date={};
              mealsCartData.lines.forEach(l => {
                var order=order_by_date[l.delivery_date];
                if (!order) {
                  order={lines:[]};
                  order_by_date[l.delivery_date]=order;
                }
                order.lines.push(l);
              })
              var delivery_dates=Object.keys(order_by_date);
              delivery_dates.sort();

              console.log('number_of_meal_delivery_days',number_of_meal_delivery_days,delivery_dates.includes(selected_date))

              selected_date_is_in_cart = delivery_dates.includes(selected_date);

            }

            // var grocery_ship_address_id = cartData.ship_address_id? cartData.ship_address_id.id : null;
            // var grocery_delivery_date = cartData.delivery_date || null;
            // var grocery_delivery_slot_id = cartData.delivery_slot_id? cartData.delivery_slot_id.id : null;


            // console.log('number_of_meal_delivery_days',number_of_meal_delivery_days,selected_date_is_in_cart,selected_date,selected_interval, grocery_delivery_date, grocery_delivery_slot_id)

            // If our meal cart has 1 day worth of meals or is just created, then we also update the grocery cart if the delivery details on the grocery cart are not the same as on the mealplan cart
            if (
                ((number_of_meal_delivery_days == 0) && (selected_date_is_in_cart == false)) ||
                ((number_of_meal_delivery_days == 1) && (selected_date_is_in_cart == true)) ||
                (meal_cart_total_qty(mealsCartData)==0)
              ) {

              console.log('Automation scenario 1');

              var grocery_ship_address_id = cartData.ship_address_id? cartData.ship_address_id.id : null;
              var grocery_delivery_date = cartData.delivery_date || null;
              var grocery_delivery_slot_id = cartData.delivery_slot_id? cartData.delivery_slot_id.id : null;

              if ((grocery_delivery_date == null) || (grocery_delivery_slot_id ==null) || (grocery_ship_address_id ==null) || (grocery_delivery_date!==selected_date) || (grocery_delivery_slot_id!==selected_interval)  || (grocery_ship_address_id !==selected_address) ){
                //  || (grocery_ship_address_id == null) || (grocery_ship_address_id!==selected_address) - Readd this condition after we redo the address logic
                var vals = {
                  delivery_date: selected_date,
                  delivery_slot_id: selected_interval,
                  ship_address_id: selected_address,
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
              }

            }

            // If our meal cart has multiple days or we just added a second day worth of meals, then we reset the grocery cart to null if they aren't already reset - BUT DO NOT RESET THE ADDRESS
            // if ((number_of_meal_delivery_days > 1) || ((delivery_dates.includes(selected_date) == false) && (meal_cart_total_qty(mealsCartData)>1))) {
            // Scenario for only one reset when we just add the second days worth of meals to avoid reseting if the user has specifically set up a grocery cart address - Confirm with Jon
            if ((number_of_meal_delivery_days == 1) && (selected_date_is_in_cart == false)) {

              console.log('Automation scenario 2');

              var grocery_ship_address_id = cartData.ship_address_id? cartData.ship_address_id.id : null;
              var grocery_delivery_date = cartData.delivery_date || null;
              var grocery_delivery_slot_id = cartData.delivery_slot_id? cartData.delivery_slot_id.id : null;

              if ((grocery_delivery_date != null) && (grocery_delivery_slot_id !=null)) {
                var vals = {
                  delivery_date: null,
                  delivery_slot_id: null,
                }
                var cartType = getCartType(cartData, mealsCartData);
                API.grocery_cart_write(
                  vals,
                  setMealsCartData,
                  setCartData,
                  cartType,
                  'yes',
                  { token, user_id },
                  'grocery_slot_change_app'
                );

              }
            }
          }
        });

      } else {
        alert("This meal can only be ordered in from " + moment(date_from).format("dddd Do") + " up to " + moment(date_to).format("dddd Do"));
      }
    }
  };

  const getItemQuantity = (item) => {
    if (mealsCartData) {
      const items = mealsCartData.lines;
      const date = getItemsDate();
      
      if (items && items.length) {
        
        const cartFilteredArray = items.filter((x, i) => {
          if (x.product_id.id == item.docId && date == x.delivery_date) {
            return x;
          }
        });

        if (cartFilteredArray.length > 0) {
          let quantity = 0;
          for (let index = 0; index < cartFilteredArray.length; index++) {
            quantity = quantity + cartFilteredArray[index].qty;
          }
          return quantity;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };
  
  const getItemsDate = () => {
    let date = "";
    var isPastCutOffTime = checkIsPastCutOffTime();
    if (isPastCutOffTime == true) {
      date = formattedTomorrow;
    } else {
      date = global.freshMealsTimeSlotNew.completeDate;
    }
    return date;
  };

  const checkIsPastCutOffTime = () => {
    let isPastCutOffTime = false;
    if (global.freshMealsTimeSlotNew) {
      const selectedDate = moment(global.freshMealsTimeSlotNew.completeDate);
      const today = momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD');
      const tomorrow = momenttz.tz('Asia/Bangkok').add(1, "days").format('YYYY-MM-DD');
	  // If it's the same or before as today  or if it is tommorow/but it's past cut off time (so it's today after 8pm)
      if ((selectedDate.isSameOrBefore(today, "day")) || (selectedDate.isSame(tomorrow, "day") && momenttz.tz('Asia/Bangkok').hour() >= CUTOFF_TIME)) {
        isPastCutOffTime = true;
      }
    } else {
      isPastCutOffTime = true;
    }
    return isPastCutOffTime;
  };

  const onSelectTime = (obj) => {
    global.freshMealsTimeSlotNew = obj;
    setSelectedFreshMealsTime(global.freshMealsTimeSlotNew);
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.whiteContainer}>
          <TouchableOpacity
            onPress={() => {
              setShowModalTime(true);
              //  setIsAnyPopupOpened(true)
            }}
            style={styles.topRed}
          >
            <Text color={darkGrey}>Delivery: {timeSlotForDelivery}</Text>

            <TouchableOpacity
              style={styles.changeRow}
              onPress={() => {
                setShowModalTime(true);
                //  setIsAnyPopupOpened(true)
              }}
            >
              <Text bold color={darkGrey}>
                Change
              </Text>
              <Image source={red_calander_ic} style={styles.calenderImg} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        {itemsArray.length == 0 && !isApiLoaderShowing && (
          <View style={styles.notFoundContainer}>
            <Text largeRegularPlus color={addressGrey} textAlign={"center"}>
              Products not found please{"\n"} try with different date
            </Text>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={itemsArray}
          style={styles.listStyle}
          renderItem={({ item, index }) => renderListItem(item, index)}
        />
      </View>

      <TimeSlot
        heading={"Choose delivery slot"}
        showModal={showModalTime}
        setSelectTimeSlot={(obj) => onSelectTime(obj)}
        timeSlots={createDaysArray()}
        setShowPrivacyModal={() => {
          setShowModalTime(false);
          //  setIsAnyPopupOpened(false)
          // setTimeout(() => {
          //    setIsAnyPopupOpened(false)
          // }, 0)
        }}
        selectedSection={'fresh_meals'}
      />

      <Modal
        style={{ margin: 0 }}
        testID={"modal"}
        swipeDirection={null}
        isVisible={showFreshDetailsModal}
        animationIn="bounceIn"
        animationOut="zoomOut"
        backdropColor={transparent}
        animationInTiming={1000}
        animationOutTiming={100}
        backdropTransitionInTiming={1500}
        backdropTransitionOutTiming={1500}
        useNativeDriverForBackdrop
      >
        <FreshMealsDetails
          addToCart={addToCart}
          navigation={navigation}
          selectedFreshMealsObj={selectedFreshMealsObj}
          setShowFreshDetailsModal={setShowFreshDetailsModal}
        />
      </Modal>
    </View>
  );
};

export default Beverages;
