import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import FastImage from "react-native-fast-image";
import styles from "./SpecialsStyles";
import { appColors, appImages, appMetrics } from "../../theme";
import { Text, Emoticon, Reviews } from "../../components/";
import { SharedElement } from "react-navigation-shared-element";
import Modal from "react-native-modal";
import FreshMealsDetails from "../FreshMealsDetails";
const { screenHeight } = appMetrics;
const {
  textDarkGray,
  black,
  accountSettingGray,
  white,
  darkGrey,
  buttonRed,
  transparent,
  addressGrey,
} = appColors;
import TimeSlot from "../PickupTimeSlot";
import ProductQuantityEdit from "../Products/ProductQuantityEdit";
import { createDaysArray } from "../PickupTimeSlot";
import moment from "moment";
import AppContext from "../../provider";
import helpers from "../../helpers";
import Services from "../../services";
const { API } = Services;
import { CUTOFF_TIME } from "../../common/constants";
import * as momenttz from 'moment-timezone';

const { add_fav_btn_ic, red_calander_ic } = appImages;
const {
  number_format,
  get_thumbnail,
  getDefaultDateForFreshMeals,
  groupBy2,
  getCartType,
  meal_cart_total_qty
} = helpers;
const Specials = (props) => {
  const {
    navigation,
    dateFrom,
    dateTo,
    specialBigItemsArray,
    imageIndex,
    timeSlotForDelivery,
    setSelectedFreshMealsTime
  } = props;
  const {
    setIsAnyPopupOpened,
    isApiLoaderShowing,
    loginData,
    mealsCartData,
    setMealsCartData,
    setIsAnyApiLoading,
    isAnyApiLoading,
    setCartData,
    cartData,
  } = useContext(AppContext);
  const scrollRef = React.useRef();

  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
    var { contact_id } = accountInfo;
    var { default_address_id, addresses } = contact_id;
  } else {
    var user_id = null;
    var token = null;
  }
  
  const [showModalTime, setShowModalTime] = useState(false);
  const [showFreshDetailsModal, setShowFreshDetailsModal] = useState(false);
  const [selectedFreshMealsObj, setSelectedFreshMealsObj] = useState(null);
  const [xTabOne, setXTabOne] = useState(0);
  const [xTabTwo, setXTabTwo] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [itemsArray, setItemsArray] = useState([]);
  
  const defaultDate = getDefaultDateForFreshMeals();
  const { formattedTomorrow } = defaultDate;

  useEffect(() => {
    if (
      scrollRef &&
      scrollRef.current &&
      itemsArray.length > 0 &&
      itemsArray.length > imageIndex
    ) {
      if (scrollOffset == 0) {
        scrollRef.current.scrollToIndex({
          animated: true,
          index: imageIndex,
        });
      }
    }
    return () => {};
  }, [imageIndex]);

  useEffect(() => {
    setItemsArray(specialBigItemsArray);
  }, [dateFrom, dateTo, specialBigItemsArray]);

  const toggleJumbo = (j) => {
    const array = Object.assign([], itemsArray);
    for (let index = 0; index < itemsArray.length; index++) {
      if (index == j) {
        itemsArray[j].jumbo = !itemsArray[j].jumbo;
      }
    }

    setItemsArray(array);
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

  const getItemQuantity = (item) => {
    if (mealsCartData) {
      const items = mealsCartData.lines;
      const date = getItemsDate();
      if (items && items.length) {
        let docId = "";
        if (item.jumbo) {
          docId = item.regularDocId;
        } else {
          docId = item.docId;
        }

        const cartFilteredArray = items.filter((x, i) => {
          if (x.product_id.id == docId && date == x.delivery_date) {
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

  const handleSlide = (type, index, obj) => {
    Animated.spring(obj.translateX, {
      toValue: type,
      duration: 100,
      useNativeDriver: true,
    }).start();

    toggleJumbo(index);
  };

  const addReview = (idx, j) => {
    const array = Object.assign([], itemsArray);
    for (let index = 0; index < itemsArray.length; index++) {
      if (index == j) {
        itemsArray[j].reviews[idx-1] = itemsArray[j].reviews[idx-1] + 1
      }
    }

    setItemsArray(array);
  }

  const renderTextContent = (obj, index) => {
    const {
      ecom_short_title,
      sale_price,
      ecom_short_subtitle,
      regularPrice,
      reviews,
      jumbo,
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
          {(user_id == 12272) &&
            <Reviews reviews={reviews} from="main_menu"/>
          }
          <View>
            {sale_price && (
              <View style={styles.priceRow}>
                <Text condensedBold color={black} style={styles.margin}>
                  {jumbo
                    ? "฿" + number_format(regularPrice, "0,0")
                    : "฿" + number_format(sale_price, "0,0")}
                </Text>

                <Text maxMini bold color={textDarkGray} style={styles.exvat}>
                  {" EX VAT"}
                </Text>
              </View>
            )}
            {/* <Emoticon addReview={(idx) => addReview(idx, index)}/> */}
            <View
              style={styles.bottomRow}
              onStartShouldSetResponder={() => true}
            >
              <Pressable style={{ height: 38, width: 99, alignItems: 'center', flexDirection: 'row'}}>
                <View style={styles.sizeRow}>
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: 45,
                      height: "100%",
                      borderRadius: 3,

                      top: 1,
                      left: 1,

                      backgroundColor: buttonRed,
                      borderRadius: 3,

                      transform: [
                        {
                          translateX: obj.translateX,
                        },
                      ],
                    }}
                  />

                  <TouchableOpacity
                    disabled={obj.jumbo}
                    onLayout={(event) => {
                      setXTabOne(event.nativeEvent.layout.x - 2);
                    }}
                    style={[styles.jumboBnt]}
                    onPress={() => {
                      handleSlide(xTabOne, index, obj);
                    }}
                  >
                    <Text
                      bold={obj.jumbo}
                      tiny
                      color={obj.jumbo ? white : accountSettingGray}
                    >
                      {"Regular"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={!obj.jumbo}
                    onLayout={(event) => {
                      setXTabTwo(event.nativeEvent.layout.x - 2);
                    }}
                    onPress={() => {
                      handleSlide(xTabTwo, index, obj);
                    }}
                    style={[styles.jumboBnt, {}]}
                  >
                    <Text
                      bold={!obj.jumbo}
                      tiny
                      color={obj.jumbo ? accountSettingGray : white}
                    >
                      {"Jumbo"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
              <Pressable style={{ position: 'absolute', right: 0, bottom: 0, height: 38, width: 99}}>
                <ProductQuantityEdit
                  quantity={quantity}
                  isOutOfStock={false}
                  disabled={isAnyApiLoading}
                  onSelectQuantity={(newQuantity, callback) => {
                    selectQuantity({ quantity: newQuantity }, index);
                    callback(true);
                  }}
                  buttonRightMargin={0}
                  product_id={docId}
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

  const checkGroups = (id, groups) => {
    if (groups && groups.length > 0) {
      const filtered = groups.filter((x) => x == id);

      if (filtered.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const check_if_product_is_in_cart = (default_delivery_date, productId) => {
    var selected_date = "";

    selected_date = default_delivery_date;

    var exist_in_cart = false;

    var meal_cart = mealsCartData;
    if (meal_cart) {
      meal_cart.lines.map((d) => {
        if (productId == d.product_id.id && selected_date == d.delivery_date) {
          exist_in_cart = true;
        }
      });
    }

    return exist_in_cart;
  };

  const renderListItem = (obj, index) => {
    const { image, groups } = obj;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedFreshMealsObj(obj);
          setShowFreshDetailsModal(true);
          //navigation.navigate('FreshMealsDetails')
        }}
      >
        <View
          key={index}
          style={[
            styles.cell,
            {
              marginBottom: 0,
              borderTopWidth: index == 0 ? 1 : 0,
            },
          ]}
        >
          <View style={styles.ImgContainer}>
            <SharedElement id={"123"}>
              {image && (
                <FastImage
                  source={{ uri: get_thumbnail(image, 512) }}
                  style={styles.cellImg}
                >
                  {checkGroups("126", groups) && (
                    <View style={styles.redBestSeller}>
                      <Text minSmall condensed color={white}>
                        SPICY
                      </Text>
                    </View>
                  )}

                  {checkGroups("117", groups) && (
                    <View style={styles.bestseller}>
                      <Text minSmall condensed color={white}>
                        KETO
                      </Text>
                    </View>
                  )}
                  {checkGroups("266", groups) && (
                    <View style={styles.bestsellerLocall}>
                      <Text minSmall condensed color={white}>
                        LOCAL
                      </Text>
                    </View>
                  )}
                </FastImage>
              )}
            </SharedElement>
          </View>
          {renderTextContent(obj, index)}
        </View>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data, index) => ({
    length: 50,
    offset: 50 * index,
    index,
  });

  // Slots Related
  const addToCart = (obj, quantity, previousQuantity) => {

    console.log('Checking', checkIsPastCutOffTime());

    if (checkIsPastCutOffTime() == true) {
      var selected_date = formattedTomorrow;
      var selected_interval = 3;
    } else {
      // Not sure why we need the if here ... debug later
      var selected_date = global.freshMealsTimeSlotNew.completeDate;
      var selected_interval = global.freshMealsTimeSlotNew.slotId;;
    }

    console.log('Checking 1', selected_date, selected_interval);

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
      let id = "";
      if (!obj.jumbo) {
        id = parseInt(obj.docId);
      } else {
        id = parseInt(obj.regularDocId);
      }
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
            }}
            style={styles.topRed}
          >
            <Text color={darkGrey}>Delivery: {timeSlotForDelivery}</Text>
            <TouchableOpacity
              style={styles.changeRow}
              onPress={() => {
                setShowModalTime(true);
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
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (itemsArray.length > 0) {
              scrollRef.current.scrollToIndex({
                animated: true,
                index: imageIndex,
              });
            }
          }}
          keyExtractor={(item, index) => index.toString()}
          data={itemsArray}
          style={styles.listStyle}
          renderItem={({ item, index }) => renderListItem(item, index)}
          getItemLayout={getItemLayout}
        />
      </View>

      <TimeSlot
        heading={"Choose delivery slot"}
        showModal={showModalTime}
        setSelectTimeSlot={(obj) => onSelectTime(obj)}
        timeSlots={createDaysArray()}
        setShowPrivacyModal={() => {
          setShowModalTime(false);
        }}
        selectedSection={'fresh_meals'}
      />

      <Modal
        style={{ margin: 0 }}
        testID={"modal"}
        swipeDirection={null}
        isVisible={showFreshDetailsModal}
        backdropColor={transparent}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={400}
        animationOutTiming={300}
        backdropTransitionInTiming={1500}
        backdropTransitionOutTiming={1500}
        useNativeDriverForBackdrop
      >
        <FreshMealsDetails
          specialBigItemsArray={specialBigItemsArray}
          navigation={navigation}
          addToCart={addToCart}
          selectedFreshMealsObj={selectedFreshMealsObj}
          setShowFreshDetailsModal={setShowFreshDetailsModal}
        />
      </Modal>
    </View>
  );
};

export default Specials;
