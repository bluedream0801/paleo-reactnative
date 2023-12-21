import React, { useState, useContext, useEffect, useCallback, useRef } from "react";

import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  NativeModules,
  // Multiple Deliveries
  SectionList,
  Animated,
  Platform,
  UIManager,
  Pressable,
} from "react-native";

import {
  Grayscale
} from 'react-native-color-matrix-image-filters';
import analytics from '@react-native-firebase/analytics';
import TimeSlot from "../PickupTimeSlot";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./Styles";
import QuantityPopup from "../FreshMeals/QuantityPopup";
import { appColors, appImages, appConstants } from "../../theme";
import { SwipeListView } from "react-native-swipe-list-view";
import Services from "../../services";
import EmptyCart from "./EmptyCart";
import LoadingCart from "./LoadingCart";
const { API } = Services;
import DeliveryPopup from "./DeliveryPopup";
import moment from "moment";
import { TIMEZONE, CUTOFF_TIME } from "../../common/constants";
import { MarketHeader, Text, Button, PopupModal } from "../../components/";
import { chatUs } from '../../helpers/contact';
import SpecialQuantityPopup from "./SpecialQuantityPopup";
import * as momenttz from 'moment-timezone';
import LINE from '../../helpers/line';
import { createDaysArray } from "../PickupTimeSlot";

import LoginOrCreateAccountPopup from "./LoginOrCreateAccountPopup";

// Multiple Deliveries
import { Transition, Transitioning } from "react-native-reanimated";
import FastImage from "react-native-fast-image";

const {
  black,
  lessDarkGray,
  green,
  accountSettingGray,
  white,
  cartDrkGrey,
  addressGrey,
  darkGrey,
  sharpGreen,
  orGrey,
  greenButtonOpacity,
  quantityGreen,
  blackOpacity,
  togetherGrey,
  orderDarkGray,
} = appColors;

import { IMAGE_URL } from "../../services/ApiConstants";

import OrderAmountsPopup from "./OrderAmountsPopup";
import AppContext from "../../provider";
import NavigationRefs from "../../routes/NavigationRefs"; // Ask about this
import SelectAddress from "../SelectAddress";
import helpers, { AppsFyler } from "../../helpers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatUs } from "../../components/ChatUs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinkLINEAccountPopup from "../LinkLINEAccount/LinkLINEAccountPopup";
const {
  exist_min_each_day,
  exist_min_each_day_combined,
  exist_min_each_day_no_combined,
  get_thumbnail,
  number_format,
  convertDeliveryDateToDisplayDate,
  getCartType,
  getDefaultDateForFreshMeals,
  getDisabledItems,
  should_meal_be_removed,
  checkForTodayTomorrow,
  groupBy2,
  checkoutDay,
  check_exist_only_water,
  hapticFeedback,
} = helpers;

const NotAvailable = `We cannot send some items outside Bangkok because they are likely to break or spoil in transport.
\nIf you still wish to checkout these items, you will need to change your delivery address to a Bangkok one. Otherwise you will need to remove these items to checkout.`;

const {
  small_chat_ic,
  add_fav_btn_ic,
  question_ic,
  trash,
  // Multiple Deliveries
  thick_arrow,
  mtoWhite,
  // Single Day
  fresh_meals_ic,
} = appImages;

const {
  MIN_DELIVERY_ORDER_AMOUNT,
  SWIPE_ACTION_PREVIEW_DELAY
} = appConstants;

const Cart = (props) => {
  const { navigation } = props;
  const [showModal, setShowModal] = useState(false);
  const [isOpenQuantitySelectPopUp, setIsOpenQuantitySelectPopUp] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isOpenCheckoutPopUp, setIsOpenCheckoutPopUp] = useState(false);
  const [isOpenAmountPopUp, setIsOpenAmountPopUp] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressModalDisabledItems, setShowAddressModalDisabledItems] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const [isOpenDeliveryPopUp, setIsOpenDeliveryPopUp] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [mealsCartItems, setMealsCartItems] = useState([]);
  const [showDeliveryPopupModalContainer, setShowDeliveryPopupModalContainer] = useState(false);
  const [showSpecialQuantityPopup, setShowSpecialQuantityPopup] = useState(false);
  const [showSuggestiveReveal, setShowSuggestiveReveal] = useState(false);
  const [showLoginOrCreateAccountPopup, setShowLoginOrCreateAccountPopup] = useState(false);

  // Multiple Deliveries
  const ref = useRef();
  const [dataArray, setDataArray] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [addressArray, setAddressArray] = useState(false);
  const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0));
  // Needs to be reviewed as possible duplicate
  const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

  const {
    // General
    setIsAnyPopupOpened,
    setIsAnyApiLoading,
    loginData,
    // Cart Related Context
    // Grocery Cart
    cartData,
    updateCartId,
    setCartData,
    // Meal Cart
    mealsCartData,
    setMealsCartData,
    // General Cart
    setIsNotificationShowing,
  } = useContext(AppContext);

  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
    var { contact_id } = accountInfo;
  } else {
    var user_id = null;
    var token = null;
  }

  // console.log("loginData---Cart", loginData);
  console.log("CART SCREEN LOADED");


  // Multiple Deliveries
  const transition = (
    <Transition.Together>
      <Transition.Change durationMs={3000} interpolation="slideOutUp" />
    </Transition.Together>
  );

  // Multiple Deliveries
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const backPress = () => {
    navigation.goBack();
  };

  const disabledMeals = getDisabledItems(mealsCartData, "meals").disabledItems;
  const disabledGroceries = getDisabledItems(cartData, "grocery").disabledItems;

  const [showLINELinkPopup, setShowLINELinkPopup] = useState(false);

  useEffect(() => {
    (async () => {
      if (loginData && contact_id) {
        let { line_user_id, line_friendship, line_follow_popup_showed, create_time } = contact_id;
        line_friendship = line_user_id ? (
          await LINE.hasFollowedLINEQA()
        ) : false;
        if (line_user_id && !line_friendship) {
          const askFollowLINEOfficialAccount = !line_follow_popup_showed && (moment(momenttz.tz('Asia/Bangkok').format()).diff(moment(create_time), 'hours') > 120);
          if (askFollowLINEOfficialAccount !== showLINELinkPopup) {
            var vals = {}
            vals['line_follow_popup_showed'] = true;
            await API.execute('contact', 'write', [[loginData.accountInfo.contact_id.id], vals], {}, () => {}, {token: token, user_id: user_id})
            .catch((err) => {
              alert('Error: ' + err)
            })
            setShowLINELinkPopup(askFollowLINEOfficialAccount);
          }
        }
      }
    })();
  }, [loginData]);

  // This now also loads whatever carts we have when the first is first focused
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        if (loginData) {
          console.log('accountInfo',accountInfo.contact_id.id);
          console.log('Current Carts',global.cartId,global.mealsCartId);
          await API.check_latest_carts(accountInfo.contact_id.id, setCartData, updateCartId, setMealsCartData, 'all', { token, user_id },'grocery_cart_cart_load');
        } else {
          console.log('User not logged in - just checking his cart');
          await API.check_latest_carts_no_login(setCartData, updateCartId, setMealsCartData, 'all', { token, user_id },'grocery_cart_cart_load');
        }
      }
      fetchData();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {

      const cartType = getCartType(cartData, mealsCartData);

      console.log('Use Focus Effect CART 2',cartType);

      if (cartData) {
        // console.log('groceryCartData',cartData.lines);
      }

      if (cartType === "combined"){
        if (cartData && cartData.amount_total != undefined  && cartData.ship_addresses != undefined) {
          returnSectionData();
        }
      }

      if (cartType === "grocery") {
        if (cartData) {
          if (cartData.lines.length) {
            setCartItems(getDisabledItems(cartData, "grocery").items);
          } else {
            setCartItems([]);
          }
        }
      }

       // Adjusted for multi day meal scenario
      if (cartType === "meal") {
        if (CombinedOrMultipleDaysDelivery() == true) {
          returnSectionData();
        } else {
          if (mealsCartData) {
            if (mealsCartData.lines.length) {
              setMealsCartItems(getDisabledItems(mealsCartData, "meals").items);
            } else {
              setMealsCartItems([]);
            }
          }
        }
      }

      if (cartType === null) {
        setCartItems([])
        setMealsCartItems([]);
        setDataArray([]);
      }
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [cartData, mealsCartData])
  );

  useFocusEffect(
    useCallback(() => {
      updateTimeSlotForDelivery();
    }, [mealsCartData, cartData])
  );

  useEffect(() => {
    const isSuggestiveRevealShown = async () => {
      const isShown = await AsyncStorage.getItem('isSuggestiveRevealShown');
      if (!isShown || !Boolean(isShown)) {
        setShowSuggestiveReveal(true);
        await AsyncStorage.setItem('isSuggestiveRevealShown', String(true))
      }
    }
    isSuggestiveRevealShown();
  }, []);

  useFocusEffect(
    useCallback(() => {
      AppsFyler.logEvent('reached_cart', {

      });
    }, [])
  );

  // Functions used to order all the data in an array in case of a multiple delivery
  // Multiple Deliveries
  const returnSectionData = () => {
    const sections = [];
    const freshMealArray = [];
    const groeryMealArray = [];
    const groceryDeliveryTime = "";

    for (let j = 0; j < 2; j++) {
      const disabledGroceries = getDisabledItems(cartData, "grocery").disabledItems;

      const disabledMeals = getDisabledItems(mealsCartData, "meals").disabledItems;

      if (j == 0 && cartData && cartData.lines.length > 0) {
        sections.push({
          showStatusBar: true,
          selectedTime:
            cartData.delivery_date && cartData.delivery_slot_id
              ? convertDeliveryDateToDisplayDate(cartData.delivery_date, cartData.delivery_slot_id.name)
              : "Select time",
          selectedAddress:
            cartData && cartData.ship_address_id
              ? cartData.ship_address_id.address
              : "Address",
          shortDay: "",
          shortDate: "",
          time: cartData.delivery_slot_id ? cartData.delivery_slot_id.name: "",
          objectNo: 0,
          data: getDisabledItems(cartData, "grocery").items,
          type: "grocery",
          shipAddresses: getShipAddresses(cartData),
          deliveryDate: cartData.delivery_date,
          disabled: true,
        });

        /*
        if (disabledGroceries.length > 0) {
          sections.push({
            disabled: false,

            selectedTime:
              cartData.delivery_date && cartData.delivery_slot_id
                ? convertDeliveryDateToDisplayDate(cartData.delivery_date, cartData.delivery_slot_id.name)
                : "Select time",
            selectedAddress:
              cartData && cartData.ship_address_id
                ? cartData.ship_address_id.address
                : "Address",
            shortDay: "",
            shortDate: "",
            time: cartData.delivery_slot_id ? cartData.delivery_slot_id.name: "",
            objectNo: 0,
            data: disabledGroceries,
            type: "grocery",
            shipAddresses: getShipAddresses(cartData),
            deliveryDate: cartData.delivery_date,
          });
        }
        */
      }

      if (j == 1) {
        const data = groupBy2(mealsCartData.lines, "delivery_date");

        const dataLength = Object.keys(data).length;

        if (dataLength == 1) {
          sections.push({
            showStatusBar: true,
            disabled: true,
            selectedTime: convertDeliveryDateToDisplayDate(mealsCartData.lines[0].delivery_date, mealsCartData.lines[0].delivery_slot_id.name),
            deliveryDate: mealsCartData.lines[0].delivery_date,
            shortDay: "",
            shortDate: "",
            time: mealsCartData.lines[0].delivery_slot_id ? mealsCartData.lines[0].delivery_slot_id.name: "",
            objectNo: 1,

            data: getDisabledItems(mealsCartData, "meals").items,
            type: "meal",
            shipAddresses: getMealsShipAddresses(
              mealsCartData,
              mealsCartData.lines[0].delivery_date
            ),

            selectedAddress: mealsCartData.lines[0].ship_address_id
              ? mealsCartData.lines[0].ship_address_id.address
              : "",
          });

          if (disabledMeals.length > 0) {
            sections.push({
              disabled: false,

              data: disabledMeals,
              selectedTime: convertDeliveryDateToDisplayDate(mealsCartData.lines[0].delivery_date, mealsCartData.lines[0].delivery_slot_id.name),
              deliveryDate: mealsCartData.lines[0].delivery_date,
              shortDay: "",
              shortDate: "",
              time: mealsCartData.lines[0].delivery_slot_id ? mealsCartData.lines[0].delivery_slot_id.name: "",
              objectNo: 1,

              type: "meal",
              shipAddresses: getMealsShipAddresses(
                mealsCartData,
                mealsCartData.lines[0].delivery_date
              ),

              selectedAddress: mealsCartData.lines[0].ship_address_id
                ? mealsCartData.lines[0].ship_address_id.address
                : "",
            });
          }
        } else {
          for (var key in data) {
            const dataArr = getDisabledItems({ ...mealsCartData, lines: data[key] }, "meals").items;

            sections.push({
              disabled: true,
              showStatusBar: true,
              selectedTime: convertDeliveryDateToDisplayDate(data[key][0].delivery_date, data[key][0].delivery_slot_id.name),
              deliveryDate: data[key][0].delivery_date,
              shortDay: "",
              shortDate: "",
              time: data[key][0].delivery_slot_id.name ? data[key][0].delivery_slot_id.name: "",
              objectNo: 0,
              data: dataArr,
              type: "meal",
              shipAddresses: getMealsShipAddresses(
                mealsCartData,
                data[key][0].delivery_date
              ),

              selectedAddress: data[key][0].ship_address_id
                ? data[key][0].ship_address_id.address
                : "Address",
            });

            if (disabledMeals.length > 0) {
              sections.push({
                disabled: false,
                showStatusBar: dataArr.length > 0 ? false : true,
                selectedTime: convertDeliveryDateToDisplayDate(data[key][0].delivery_date, data[key][0].delivery_slot_id.name),
                deliveryDate: data[key][0].delivery_date,
                shortDay: "",
                shortDate: "",
                time: data[key][0].delivery_slot_id.name ? data[key][0].delivery_slot_id.name: "",
                objectNo: 0,
                data: getDisabledItems({ ...mealsCartData, lines: data[key] }, "meals").disabledItems,
                type: "meal",
                shipAddresses: getMealsShipAddresses(
                  mealsCartData,
                  data[key][0].delivery_date
                ),

                selectedAddress: data[key][0].ship_address_id
                  ? data[key][0].ship_address_id.address
                  : "Address",
              });
            }
          }
        }
      }
    }
    const orderedSections = orderSectionData(sections);
    // console.log("orderedSections",orderedSections);
    setDataArray(orderedSections);
    return orderedSections;

  };

  // Multiple Deliveries
  const orderSectionData = (sections) => {
    const filteredData = sections.filter((x) => x.type !== "grocery");

    let sortedActivities = filteredData.sort(
      (a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate)
    );
    let filteredDataGrocery = sections.filter((x) => x.type == "grocery");

    if (sections.length !== filteredData.length) {
      let { togetherDateExist } = isTogetherDateExit(
        sections,
        filteredDataGrocery[0]
      );

      if (!togetherDateExist) {
        // if (filteredDataGrocery.length > 0) {
        //   sortedActivities.unshift(filteredDataGrocery[0]);
        // }
        sortedActivities = sections.sort(
          (a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate)
        );
        return sortedActivities;
      } else {
        sortedActivities = sections.sort(
          (a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate)
        );
        return sortedActivities;
      }
    }

    return sortedActivities;
  };

  // END - // Functions used to order all the data in an array in case of a multiple delivery

  // Check if a combined delivery is single day or multiple days
  // Multiple Deliveries
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

  const CombinedOrMultipleDaysDelivery = () => {
    let freshMealsExist = false;
    let groceryExist = false;
    if (cartData && cartData.lines.length > 0) {
      groceryExist = true;
    }
    if (mealsCartData && mealsCartData.lines.length > 0) {
      freshMealsExist = true;
      mealsCartData.lines.sort((a, b) => {
        if (a.delivery_date !== b.delivery_date) {
          groceryExist = true;
          // return;
        }
      });
    }
    // console.log('freshMealsExis and GroceryExist',freshMealsExist,groceryExist)
    return freshMealsExist && groceryExist;
  };

  // UPDATE ADDRESSES / TIME SLOTS / DATE in different scenarios
  const SetGroceryAddress = (addr_id) => {
    var vals = {
      ship_address_id: addr_id,
      delivery_slot_id: null, // Slots should be reset based on address
      delivery_date: null, // Slots should be reset based on address
    };
    var cartType = getCartType(cartData, mealsCartData);
    API.grocery_cart_write(
      vals,
      setMealsCartData,
      setCartData,
      cartType,
      'yes',
      { token, user_id },
      'grocery_slot_and_address_change_cart'
    );
  };

  // Multiple Deliveries
  const setMealsAddress = (addr_id, date) => {
    
    // If we have a combined meal/grocery day, then we need to also change the grocery address and maybe reset the slot ?!
    if (cartData.delivery_date == date) {
        
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

        {delivery_dates.map( mealplan_date => {
          let order=order_by_date[mealplan_date]
          let mealplan_day = mealplan_date;
          console.log('Current Mealplan In Check Date',mealplan_day);
          if (date == mealplan_day) {
            // Save the selected day address id and slot in order to update the grocery cart with it
            mealplan_address_id = null;
            // if (order.lines[0].ship_address_id) {
              // mealplan_address_id = order.lines[0].ship_address_id.id;
            // }
            mealplan_slot_id = order.lines[0].delivery_slot_id.id;
            console.log('We have the same date');
            vals = {
              delivery_date: date,
              delivery_slot_id: mealplan_slot_id,
              ship_address_id: addr_id,
            }
            console.log('New Values for Grocery Cart from MealCart are set up');
          }
        })}
        
        // var cartType = getCartType(cartData, mealsCartData);
        API.grocery_cart_write(
          vals,
          setMealsCartData,
          setCartData,
          "combined",
          'no',
          { token, user_id },
          'grocery_slot_and_address_change_cart'
        );
    }

    var vals = {
      ship_address_id: addr_id,
    };
    API.meal_cart_update_delivery(
      date,
      vals,
      setMealsCartData,
      setCartData,
      { token, user_id },
      "combined",
      'yes',
      'meal_cart_update_delivery_address_cart'
    );
  };

  // Multiple Deliveries
  const SplitDeliveries = () => {

    // Don't know why this was called here, we just need to clear the date and slot on the cart
    // const dateId = getCombinedAddressId();
    // SetGroceryAddress(dateId);

    var vals = {
      delivery_date: null,
      delivery_slot_id: null,
    };

    var cartType = getCartType(cartData, mealsCartData);
    API.grocery_cart_write(
      vals,
      setMealsCartData,
      setCartData,
      cartType,
      'yes',
      { token, user_id },
      'grocery_slot_change_cart'
    );
  };

  // Multple Deliveries
  const setSelectedAddress = (obj) => {
    if (obj.delivery_date) {
      setMealsAddress(obj.id, obj.delivery_date);
    } else {
      SetGroceryAddress(obj.id);
    }
    if (isSingleDayDelivery()== true) {
      setMealsAddress(obj.id, mealsCartData.lines[0].delivery_date);
    }
  };

  // Multiple Deliveries
  const updateTimeSlot = (obj) => {
    const array = Object.assign([], dataArray);
    if (selectedSection || selectedSection == 0) {
      array[selectedSection].selectedTime = obj.shortDay + " " + obj.shortDate + ", " + obj.time;
      array[selectedSection].shortDate = obj.shortDate + obj.time;
    }
    setDataArray(array);
  };

  // Multiple Deliveries
  const getCombinedAddressId = () => {
    let dateId = "";
    for (let index = 0; index < dataArray.length; index++) {
      if ((dataArray[index].type = "meal")) {
        if (dataArray[index].deliveryDate == cartData.delivery_date) {
          dateId = dataArray[index].data[0].ship_address_id.id;
        }
      }
    }
    return dateId;
  };


  const onchange_time_slot = (date, slotId) => {

     // Multiple Delveries
    if (CombinedOrMultipleDaysDelivery() == true) {

      console.log('Change Time Multiple')

      var slot_id = parseInt(slotId);
      var vals = {
        delivery_date: date,
        delivery_slot_id: slot_id,
      };

      let oldDate = "";
      if (isSingleDayDelivery() == true) {
        oldDate = mealsCartData.lines[0].delivery_date;
        console.log('Change Time Multiple oldDate 1',oldDate)
      } else {
        oldDate = dataArray[selectedSection].data[0].delivery_date;
        console.log('Change Time Multiple oldDate 2',oldDate,selectedSection)
      }

      console.log('Change Time Multiple oldDate',oldDate)

      const cartType = "combined";
      if (isSingleDayDelivery() == false) {
        if (dataArray[selectedSection].type == "meal") {
          console.log('dataArray[selectedSection].type == "meal"')
          API.meal_cart_update_delivery(
            oldDate,
            vals,
            setMealsCartData,
            setCartData,
            { token, user_id },
            cartType,
            'no',
            'meal_cart_update_delivery_slot_cart'
          );

          var load_cart = 'yes';
          if (date == cartData.delivery_date) {
            load_cart = 'no';
          }

          // This can use some optimization in order to only do the update on new date if it is present in cart !?
          API.meal_cart_update_delivery(
            date,
            vals,
            setMealsCartData,
            setCartData,
            { token, user_id },
            cartType,
            load_cart,
            'meal_cart_update_delivery_slot_cart'
          );

          if (date == cartData.delivery_date) {
            API.grocery_cart_write(
              vals,
              setMealsCartData,
              setCartData,
              cartType,
              'yes',
              { token, user_id },
              'grocery_slot_change_cart'
            );
          }

        } else {
          console.log('dataArray[selectedSection].type == "grocery"');

          // Also update the mealplan cart with the same details if the date exists in the carts.
          var current_mealcart_delivery_days = Object.keys(mealsCartData.ship_addresses_days);
          var mealplan_address_id = 0;
          var mealplan_slot_id = 0;

          if(current_mealcart_delivery_days.includes(date)) {
            // If we have the date in the cart, we first check to see if the user is trying to set up a out of BKK address. If yes, then we use the mealplan cart details and combine.
            var address_zone_id = "";
            if(contact_id.addresses.length>0) {
              if (cartData.ship_address_id) {
                address_zone_id = cartData.ship_address_id.zone_id;
              }
            } else {
              address_zone_id = contact_id.zone_id;
            }
            
            // FIX - Added a fix for possible issues with the address not beeing updated when the days are combined
            // if(address_zone_id == "" || address_zone_id == null || address_zone_id == "null" || address_zone_id == 32 || address_zone_id == 34) {
              // Grocery cart address is out of BKK so we reset it to whatever we have on the meals for the selected day
              // MealCart doesn't need to be updated at this point
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

              {delivery_dates.map( mealplan_date => {
                let order=order_by_date[mealplan_date]
                let mealplan_day = mealplan_date;
                console.log('Current Mealplan In Check Date',mealplan_day);
                if (date == mealplan_day) {
                  // Save the selected day address id and slot in order to update the grocery cart with it
                  mealplan_address_id = null;
                  if (order.lines[0].ship_address_id) {
                    mealplan_address_id = order.lines[0].ship_address_id.id;
                  }
                  mealplan_slot_id = order.lines[0].delivery_slot_id.id;
                  console.log('We have the same date');
                  vals = {
                    delivery_date: date,
                    delivery_slot_id: mealplan_slot_id,
                    ship_address_id: mealplan_address_id,
                  }
                  console.log('New Values for Grocery Cart from MealCart are set up');
                }
              })}
            // } else {
              // Otherwise we use the normal details from the grocery cart and update the meal cart
              API.meal_cart_update_delivery(
                date,
                vals,
                setMealsCartData,
                setCartData,
                { token, user_id },
                cartType,
                'no',
                'meal_cart_update_delivery_slot_cart'
              );
            // }
          }
          API.grocery_cart_write(
            vals,
            setMealsCartData,
            setCartData,
            cartType,
            'yes',
            { token, user_id },
            'grocery_slot_and_address_change_cart'
          );

        }
      // isSingleDayDelivery - true
      } else {
        console.log('isSingleDayDelivery');
        API.meal_cart_update_delivery(
          oldDate,
          vals,
          setMealsCartData,
          setCartData,
          { token, user_id },
          cartType,
          'no',
          'meal_cart_update_delivery_slot_cart'
        );

        API.grocery_cart_write(
          vals,
          setMealsCartData,
          setCartData,
          cartType,
          'yes',
          { token, user_id },
          'grocery_slot_change_cart'
        );
      }

    // Normal scenario. Looks good
    } else{

      console.log('Normal Scenario');
      var slot_id = parseInt(slotId);
      var vals = {
        delivery_date: date,
        delivery_slot_id: slot_id,
      };

      const oldDate = (cartItems.length > 0 || disabledGroceries.length > 0) ? cartData.delivery_date : mealsCartItems[0].delivery_date;

      const cartType = (cartItems.length > 0 || disabledGroceries.length > 0) ? "grocery" : "meal";
      if (cartType == "meal") {
        API.meal_cart_update_delivery(
          oldDate,
          vals,
          setMealsCartData,
          setCartData,
          { token, user_id },
          cartType,
          'yes',
          'meal_cart_update_delivery_slot_cart'
        );
      } else {
        API.grocery_cart_write(
          vals,
          setMealsCartData,
          setCartData,
          cartType,
          'yes',
          { token, user_id },
          'grocery_slot_change_cart'
        );
      }
    }

  };

  // Old logic ... leave it here for a while in case of bugs
  /*
  const checkIfMTOinCart = () => {
    var hasMTO = false;
    if (cartData) {
      if (cartData.delivery_date && cartData.delivery_slot_id) {
        if (cartData.lines) {
          cartData.lines.map( item => {
            // console.log('item.product_id.categ_id',item.product_id.categ_id)
            if(item.product_id.categ_id == "394" || item.product_id.categ_id == "406"){
              hasMTO = true;
            }
          })

        }
      }
    }
    console.log('checkIfMTOinCart',hasMTO);
    return hasMTO;
  };
  */

  const updateTimeSlotForDelivery = () => {

    // console.log('GETTING TIME SLOT');
    // Reviewed Logic
    // console.log('Check cartData',cartData)
    // console.log('Check mealsCartData',mealsCartData)

    var cartType = getCartType(cartData, mealsCartData);
    console.log('updateTimeSlotForDelivery Checks', cartType, global.freshMealsTimeSlotNew);

    // If we have a grocery cart only (then it manages the grocery cart date)  (or a combined 1 day worth of meals / or 1 days worth of meals)
    // If we have 1 days worth of meals, then it manages the meals date
    if (((cartData) && (cartType=='grocery' || isSingleDayDelivery()== true)) || ((cartData) && (cartType==null))){ //

      console.log('TimeSlotForDelivery Scenario 1.0 - We have a grocery or single day combined cart');
      // If we have a grocery cart with a date/slot on them
      if (cartData.delivery_date && cartData.delivery_slot_id) {

        console.log('TimeSlotForDelivery Scenario 1.1 - We have delivery date and slot');

        let deliveryDate = cartData.delivery_date;
        let deliverySlotId = cartData.delivery_slot_id;

        // If the current Selected Grocery Day is in the past then we reset to the next available day/slot (this causes a re-render)
        var slotDate = moment(cartData.delivery_date).format("YYYY-MM-DD");
        // var checkMTO = checkIfMTOinCart();

        // console.log('XXXXXXXXX', moment(slotDate).isSameOrBefore(momenttz.tz('Asia/Bangkok').add(1, "days").format(), "day") , (momenttz.tz('Asia/Bangkok').hour() >= CUTOFF_TIME), CUTOFF_TIME)
        // console.log('Checks', slotDate, (moment(slotDate).isSameOrBefore(momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD'), "day")) , (moment(slotDate).isSame(momenttz.tz('Asia/Bangkok').add(1, "days").format('YYYY-MM-DD'), "day")), (momenttz.tz('Asia/Bangkok').hour() >= CUTOFF_TIME), (momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD'))  )

        var update_slot = false;

        // Checking if the currently selected slot is amongst the available slots retrieved from netforce.
        console.log('Checking if selected slot is available.');
        var available_days = getSlotsForDelivery();
        var selected_day_availability = available_days.find(
          (slot) => !/disabled/.test(slot.status) && slot.completeDate == slotDate
        );

        if (selected_day_availability !== undefined) {
          console.log('Selected date is available', selected_day_availability);
          var available_slots = selected_day_availability.slots;
          var selected_slot_availability = available_slots.find(
            (slot) => slot.state == 'avail' && parseInt(slot.id) == parseInt(deliverySlotId.id) //
          );
        } else {
          console.log('Selected date is NOT available', slotDate);
          var update_slot = true;
        }

        if (selected_slot_availability !== undefined) {
          console.log('Selected slot is available', selected_slot_availability);
        }  else {
          console.log('Selected slot is NOT available', deliverySlotId);
          var update_slot = true;
        }

        if (update_slot == true) {
          console.log('We need to update the slot');
          var new_selected_day = available_days.find(
            (slot) => !/disabled/.test(slot.status)
          );
          if (new_selected_day) {
            var new_day_slots = new_selected_day.slots;
            var new_selected_slot = new_day_slots.find(
              (slot) => slot.state == 'avail'
            );
            var new_selected_slot = new_selected_slot;
            console.log('New day and slot should be', new_selected_day, new_selected_slot);
          }
        } else {
          console.log('We do NOT need to update any slot')
        }

        // Do the actual update
        if (update_slot == true && new_selected_day && new_selected_slot) {

          console.log('TimeSlotForDelivery Scenario 1.2 - In the past', new_selected_day, new_selected_slot);

          deliveryDate = new_selected_day.completeDate;
          deliverySlotId = new_selected_slot;

          var vals = {
            delivery_date: deliveryDate,
            delivery_slot_id: deliverySlotId.id,
          };
          
          //Check if we have the new deliveryDate in the Mealcart and move the meals to the new slot as well
          if (isSingleDayDelivery()== true) {
            console.log('testing xxxxxxx',mealsCartData.lines[0].delivery_date, deliveryDate)
            if (mealsCartData.lines[0].delivery_date == deliveryDate) {
              API.meal_cart_update_delivery(
                deliveryDate,
                vals,
                setMealsCartData,
                setCartData,
                { token, user_id },
                cartType,
                'no',
                'meal_cart_update_delivery_slot_cart'
              );
            }            
          }

          API.grocery_cart_write(
            vals,
            setMealsCartData,
            setCartData,
            cartType,
            'yes',
            { token, user_id },
            'grocery_slot_change_cart'
          );

          setIsNotificationShowing(true);

          console.log('TimeSlotForDelivery Scenario 1.3 - RERENDER - freshMealsTimeSlot updated with Grocery Cart details');
          let deliveryDateArray = moment(deliveryDate).format("DD,ddd,dddd,MM,MMMM,Do,MMM,YYYY").toString().split(",");
          global.freshMealsTimeSlotNew = {
            completeDate: deliveryDate,
            day: deliveryDateArray[2],
            slotId: deliverySlotId.id,
            shortDate: deliveryDateArray[5],
            shortDay: deliveryDateArray[1],
            time: deliverySlotId.name,
          } ;

        }

      }

    } else if (cartType=='meal') {

      console.log('TimeSlotForDelivery Scenario 2.0 - We have a meal cart');

      let deliveryDate = "";
      let deliverySlotId = "";

      const multiDeliveries = groupBy2( mealsCartData ? mealsCartData.lines : [], "delivery_date");
      const multiDeliveriesLength = Object.keys(multiDeliveries).length;

      if (multiDeliveriesLength == 1) {

        console.log('TimeSlotForDelivery Scenario 2.1 - 1 day worth of meals');

        deliveryDate = mealsCartData.lines[0].delivery_date;
        deliverySlotId = mealsCartData.lines[0].delivery_slot_id;


        console.log('TimeSlotForDelivery Scenario 2.2 - RERENDER - freshMealsTimeSlot updated with Meal Cart details');
        let deliveryDateArray = moment(deliveryDate).format("DD,ddd,dddd,MM,MMMM,Do,MMM,YYYY").toString().split(",");
        global.freshMealsTimeSlotNew = {
          completeDate: deliveryDate,
          day: deliveryDateArray[2],
          slotId: deliverySlotId.id,
          shortDate: deliveryDateArray[5],
          shortDay: deliveryDateArray[1],
          time: deliverySlotId.name,
        };

      } else {

        console.log('TimeSlotForDelivery Scenario 2.4 - Multiple days worth of meals');
        // Multi days, we retrieve the first available slot
        // If we have 2 or more days worth of meals, then we have the user pick the slot again for the groceries, BUT WE DO NOT UPDATE THE FRESH MEALS TIMESLOT
         // This only happens on the first load of the app in order to set up the default freshMealsTimeSlot / Afterwards we read it from state
        if (!global.freshMealsTimeSlotNew) {
          console.log('TimeSlotForDelivery Scenario 2.5 - freshMealsTimeSlot updated with first available slot');
          const slots = getSlotsForDelivery();
          var day = slots.find(
            (slot) => !/disabled/.test(slot.status) && slot.day !== "Today"
          );
        }

      }

    // If no meal cart and grocery cart doesn't have a selected date / slot, then the user has to pick the slot again
    } else {
       console.log('TimeSlotForDelivery Scenario 3.0 - No cart !? ... or Combined cart with multiple days');
       // This only happens on the first load of the app in order to set up the default freshMealsTimeSlot / Afterwards we read it from state
      if (!global.freshMealsTimeSlotNew) {
        console.log('TimeSlotForDelivery Scenario 3.1 - freshMealsTimeSlot updated with first available slot ... or Combined cart with multiple days');
        const slots = getSlotsForDelivery();
        var day = slots.find(
          (slot) => !/disabled/.test(slot.status) && slot.day !== "Today"
        );
      }

    }

    // This only happens on the first load of the app in order to set up the default freshMealsTimeSlot / Afterwards we read it from state
    if (!global.freshMealsTimeSlotNew) {
      if (day) {
        console.log('TimeSlotForDelivery Scenario 4.0 - RERENDER - The actual rerender');
        let deliveryDateArray = moment(day.completeDate).format("DD,ddd,dddd,MM,MMMM,Do,MMM,YYYY").toString().split(",");
        global.freshMealsTimeSlotNew = {
          completeDate: day.completeDate,
          day: day.day,
          slotId: (day.slots[0] || {}).id,
          shortDate: day.shortDate,
          shortDay: day.shortDay,
          time: (day.slots[0] || {}).name,
        };
      }
    }

  };

  const getTimeSlotForDelivery = () => {

    // console.log('Selected Section',selectedSection);

    // const { tomorrow } = getDefaultDateForFreshMeals();
    let dateString = ""; // For Display
    let defaultDateForPicker = ""; // For TimeSlot Picker

    // Multiple Delveries (only Single Days)
    if (CombinedOrMultipleDaysDelivery() == true) {
      if (isSingleDayDelivery() == true) {
        if (mealsCartData && mealsCartData.lines) {
          if (mealsCartData.lines[0] && mealsCartData.lines[0].delivery_date) {
            dateString = convertDeliveryDateToDisplayDate(mealsCartData.lines[0].delivery_date, mealsCartData.lines[0].delivery_slot_id.name);
            defaultDateForPicker = mealsCartData.lines[0].delivery_date;
          } else {
            // Don't think this will ever happen
            dateString = "Select time";
            // console.log('DateString 2', dateString, mealsCartData.lines[0].delivery_date, mealsCartData.lines[0].delivery_slot_id.name)
          }
        }
      } else {
        // Never Execuuted
        if (dataArray.length > 0 && dataArray[selectedSection]) {
          defaultDateForPicker = dataArray[selectedSection].deliveryDate;
          // console.log('defaultDateForPicker Check',defaultDateForPicker);
        }
      }
    // 1 day worth of Meals or 1 day worth of Groceries
    } else {
      if ((cartItems.length > 0 || disabledGroceries.length > 0) && cartData) {
        if (cartData.delivery_date && cartData.delivery_slot_id) {
          dateString = convertDeliveryDateToDisplayDate(cartData.delivery_date, cartData.delivery_slot_id.name);
          defaultDateForPicker = cartData.delivery_date;
        } else {
          dateString = "Select delivery time";
        }
      } else {
        if ((mealsCartItems.length > 0 || disabledMeals.length > 0) && mealsCartData) {
          if (disabledMeals[0] && disabledMeals[0].delivery_date) {
            dateString = convertDeliveryDateToDisplayDate(disabledMeals[0].delivery_date, disabledMeals[0].delivery_slot_id.name);
          } else if (mealsCartItems[0] && mealsCartItems[0].delivery_date) {
            dateString = convertDeliveryDateToDisplayDate(mealsCartItems[0].delivery_date, mealsCartItems[0].delivery_slot_id.name);
            defaultDateForPicker = mealsCartItems[0].delivery_date
          } else {
            // dateString = tomorrow[2] + ", " + "10am-12pm";
            // Don't think this will ever happen
            dateString = "Select time";
          }
        }
      }
    }

    // console.log('defaultDateForPicker',defaultDateForPicker);

    return {
      dateString,
      defaultDateForPicker
    };

  };

   // END UPDATE ADDRESSES / TIME SLOTS in different scenarios

  // GET SLOTS FUNCTIONS
  // Functionss bellow can be merged
  const getSlotsForDelivery = () => {

    var cartType = getCartType(cartData, mealsCartData);
    let res = [];
    const dateFormat = "DD,ddd,dddd,MM,MMMM,ddd,Do";
    var data = [];

    if ((cartType == 'grocery') || (cartType == null) || ((cartType == 'combined') && (isSingleDayDelivery() == true)) ) {
      if (cartData) {
        res = cartData.delivery_slots_from_now;

        for (let i = 0; i < res.length; i++) {
          const slotsData = [];
          let isClosed = true;
          for (let index = 0; index < res[i][1].length; index++) {
            if (res[i][1].length > 0) {
              if (res[i][1][index][2] == "avail") {
                slotsData.push({
                  name: res[i][1][index][1],
                  isSelected: false,
                  state: res[i][1][index][2],
                  id: res[i][1][index][0],
                });
              }
            }
            isClosed = isClosed && res[i][1][index][2] === "closed";
          }

          const timeDay = moment(res[i][0]).format(dateFormat).toString().split(",");

          if (isClosed) {
            data.push({
              isSelected: false,
              slots: slotsData,
              shortDate: timeDay[6],
              shortDay: timeDay[1],
              day: checkForTodayTomorrow(res[i][0], timeDay[2]),
              combineDate: timeDay[4] + " " + timeDay[0],
              completeDate: res[i][0],
              status: "disabled-mto",
            });
          }

          if (slotsData.length > 0 && timeDay[2] !== "Sunday") {
            data.push({
              isSelected: false,
              slots: slotsData,
              shortDate: timeDay[6],
              shortDay: timeDay[1],
              day: checkForTodayTomorrow(res[i][0], timeDay[2]),
              combineDate: timeDay[4] + " " + timeDay[0],
              completeDate: res[i][0],
            });
          }
        }
      }

    } else {
      
      data = createDaysArray();
      /*
      res = mealsCartData.date_delivery_slots;
      const today = momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD');

      for (var key in res) {

        const keyDate = moment(key);
        if (keyDate.isSameOrBefore(today, "day")) continue;

        const slotsData = [];
        // Ask if we need to check for closed slots on meals carts
        // let isClosed = true;

        for (let index = 0; index < res[key].length; index++) {
          if (res[key][index].length > 0) {
            if (res[key][index][2] == "avail") {
              slotsData.push({
                name: res[key][index][1],
                isSelected: false,
                state: res[key][index][2],
                id: res[key][index][0],
              });
            }
          }
        }

        const timeDay = keyDate.format(dateFormat).toString().split(",");

        // if (isClosed) {
          // data.push({
            // isSelected: false,
            // slots: slotsData,
            // shortDate: timeDay[6],
            // shortDay: timeDay[1],
            // day: checkForTodayTomorrow(key, timeDay[2]),
            // combineDate: timeDay[4] + " " + timeDay[0],
            // completeDate: key,
            // status: "disabled-mto",
          // });
        // }

        if (slotsData.length > 0) {
          if (timeDay[2] !== "Sunday") {
            data.push({
              isSelected: false,
              slots: slotsData,
              shortDate: timeDay[6],
              shortDay: timeDay[1],
              day: checkForTodayTomorrow(key, timeDay[2]),
              combineDate: timeDay[4] + " " + timeDay[0],
              completeDate: key,
            });
          }
        }
        
      }
      */

    }

    return data;
  };

  const getTimeSlots = () => {

    // Multiple Delveries
    let res = [];
    var data = [];
    const dateFormat = "DD,ddd,dddd,MM,MMMM,ddd,Do";
    if (
      selectedSection !== null &&
      dataArray[selectedSection] &&
      dataArray[selectedSection].type == "grocery"
    ) {
      if (cartData && cartData.delivery_slots_from_now) {
        res = cartData.delivery_slots_from_now;
      }

      for (let j = 0; j < res.length; j++) {
        const slotsData = [];

        for (let index = 0; index < res[j][1].length; index++) {
          if (res[j][1][index].length > 0) {
            if (res[j][1][index][2] == "avail") {
              slotsData.push({
                name: res[j][1][index][1],
                isSelected: false,
                state: res[j][1][index][2],
                id: res[j][1][index][0],
              });
            }
          }
        }

        if (slotsData.length > 0) {
          const timeDay = moment(res[j][0])
            .format(dateFormat)
            .toString()
            .split(",");
          if (timeDay[2] !== "Sunday") {
            data.push({
              isSelected: false,
              slots: slotsData,
              shortDate: timeDay[6],
              shortDay: timeDay[1],

              day: checkForTodayTomorrow(res[j][0], timeDay[2]),
              combineDate: timeDay[4] + " " + timeDay[0],
              completeDate: res[j][0],
            });
          }
        }
      }
    } else {
      
      data = createDaysArray();
      
      /*
      if (mealsCartData && mealsCartData.date_delivery_slots) {
        res = mealsCartData.date_delivery_slots;
      }

      for (var key in res) {
        const slotsData = [];
        let isClosed = true;
        for (let index = 0; index < res[key].length; index++) {
          if (res[key][index].length > 0) {
            if (res[key][index][2] == "avail") {
              slotsData.push({
                name: res[key][index][1],
                isSelected: false,
                state: res[key][index][2],
                id: res[key][index][0],
              });
            }
          }
          isClosed = isClosed && res[key][index][2] === "closed";
        }

        const timeDay = moment(key).format(dateFormat).toString().split(",");
        if (isClosed) {
          data.push({
            isSelected: false,
            slots: slotsData,
            shortDate: timeDay[6],
            shortDay: timeDay[1],
            day: checkForTodayTomorrow(key, timeDay[2]),
            combineDate: timeDay[4] + " " + timeDay[0],
            completeDate: key,
            status: "disabled-fresh-meal",
          });
        }
        if (slotsData.length > 0 && timeDay[2] !== "Sunday") {
          data.push({
            isSelected: false,
            slots: slotsData,
            shortDate: timeDay[6],
            shortDay: timeDay[1],
            day: checkForTodayTomorrow(key, timeDay[2]),
            combineDate: timeDay[4] + " " + timeDay[0],
            completeDate: key,
          });
        }
      }
      */
    }
    // console.log("multiple delivery: ", data);
    return data;

  };

  // END - GET SLOTS FUNCTIONS

  /* ADD TO CART AND RELATED */

  const addToCart = (obj, quantity, selectedObjectType) => {

    const cartType = getCartType(cartData, mealsCartData);

    const { id } = obj.product_id;
    setTimeout(() => {
      if (selectedObjectType == "meal") {

        var selected_shipping_address = null;
        if (obj.ship_address_id && obj.ship_address_id.id) {
          selected_shipping_address = obj.ship_address_id.id;
        }

        var selected_slot = null;
        if (obj.delivery_slot_id && obj.delivery_slot_id.id) {
          selected_slot = obj.delivery_slot_id.id;
        }

        API.meal_cart_set_qty_simple(
          obj.delivery_date,
          id,
          quantity,
          selected_shipping_address,
          selected_slot,
          setMealsCartData,
          setCartData,
          cartType,
          setIsAnyApiLoading,
          { token, user_id },
          'mealcart_add_to_cart_cart',
          (err) => {}
        );
      } else {
        API.grocery_cart_set_qty_simple(
            id,
            quantity,
            2,
            updateCartId,
            setCartData,
            setMealsCartData,
            cartType,
            setIsAnyApiLoading,
            { token, user_id },
            'grocery_add_to_cart_cart', 
            (err) => {
              console.log("err--", err);
            }
          );
      }
    }, 10);

  };

  const addExtraLot = (selectedItemDetails) => {

    const cartType = getCartType(cartData, mealsCartData);

    if (CombinedOrMultipleDaysDelivery() == true) {
      var items = selectedItemDetails.data;
      var selectedItem = selectedItemDetails.index;
      var selectedObjectType = selectedItemDetails.type;
    } else {
      var items = (cartItems.length > 0 || disabledGroceries.length > 0) ? cartData.lines : mealsCartItems;
      var selectedItem = selectedItemDetails;
      var selectedObjectType = cartType;
    }

    console.log('Trying to add lot item',selectedItem,selectedObjectType)

    if (items[selectedItem]) {
      setTimeout(() => {

        var id = items[selectedItem].product_id.id;
        // Getting cart quantity for Lot items
        var cart_qty=0;
        cartData.lines.map( d => {
          if(id == d.product_id.id){
            cart_qty += d.qty;
          }
        })
        var old_quantity = cart_qty;
        var new_quantity = cart_qty+1;

        API.grocery_cart_set_qty_simple(
          id,
          new_quantity,
          3,
          updateCartId,
          setCartData,
          setMealsCartData,
          cartType,
          setIsAnyApiLoading,
          { token, user_id },
          'grocery_add_to_cart_cart', 
          (err) => {
            console.log("err--", err);
          }
        ).then(() => {
           setSelectedObject(null);
        });
      }, 10);
    }

  };

  const deleteLot = (selectedItemDetails) => {

    const cartType = getCartType(cartData, mealsCartData);

    if (CombinedOrMultipleDaysDelivery() == true) {
      var items = selectedItemDetails.data;
      var selectedItem = selectedItemDetails.index;
      var selectedObjectType = selectedItemDetails.type;
    } else {
      var items = (cartItems.length > 0 || disabledGroceries.length > 0) ? cartData.lines : mealsCartItems;
      var selectedItem = selectedItemDetails;
      var selectedObjectType = cartType;
    }

    console.log('Trying to delete lot item',selectedItem,selectedObjectType)

    if (items[selectedItem]) {
      setTimeout(() => {

        var id = items[selectedItem].id;

        API.cart_delete_line(
          id,
          setCartData,
          setMealsCartData,
          cartType,
          { user_id: user_id, token: token }
        );

      }, 10);
    }

  };

  const selectQuantity = (quantitySelection, selectedItemDetails) => {

    const cartType = getCartType(cartData, mealsCartData);

    // Multiple Delveries
    if (CombinedOrMultipleDaysDelivery() == true) {
      var items = selectedItemDetails.data;
      var selectedItemIndex = selectedItemDetails.index;
      var selectedObjectType = selectedItemDetails.type;
    } else {
      var items = (cartItems.length > 0 || disabledGroceries.length > 0) ? cartData.lines : mealsCartItems;
      var selectedItemIndex = selectedItemDetails;
      var selectedObjectType = cartType;
    }

    console.log('selectedObjectType',selectedItemIndex,selectedObjectType);

    if (items[selectedItemIndex]) {

      if (quantitySelection.quantity == 0) {
        API.cart_delete_line(
          items[selectedItemIndex].id,
          setCartData,
          setMealsCartData,
          cartType,
          { user_id: user_id, token: token }
        );
        return;
      }

      // Only do quantity checks on Grocery items.
      if (selectedObjectType == 'grocery') {
        var max_qty = 999;
        console.log('Check qty logic', items[selectedItemIndex].product_id.ecom_no_order_unavail, items[selectedItemIndex].product_id.sale_max_qty,items[selectedItemIndex].qty_avail )
        // Implement qty_avail logic on web as well in the future.
        if (items[selectedItemIndex].product_id.ecom_no_order_unavail) {
          max_qty = items[selectedItemIndex].qty_avail;
        }
        if (items[selectedItemIndex].product_id.sale_max_qty && items[selectedItemIndex].product_id.sale_max_qty < max_qty) {
          max_qty = items[selectedItemIndex].product_id.sale_max_qty;
        }

        if (quantitySelection.quantity > max_qty) {
          alert("You can add maximum " + max_qty + " products");
          return;
        }

        console.log('Check qty logic 3', max_qty)

        if ((quantitySelection.quantity > max_qty || items[selectedItemIndex].qty_avail<0) && (items[selectedItemIndex].product_id.ecom_no_order_unavail == true)){
          alert("No more products left in stock");
        } else {
          addToCart(items[selectedItemIndex], quantitySelection.quantity, selectedObjectType);
        }
      // Mealplan
      } else {
        addToCart(items[selectedItemIndex], quantitySelection.quantity, selectedObjectType);
      }
    }

  };

  // MERGED
  const getSelectedQuantityObj = () => {

    const cartType = getCartType(cartData, mealsCartData);

    // Multiple Delveries
    if (CombinedOrMultipleDaysDelivery() == true) {
      var items = selectedObject.data;
      var selectedItem = selectedObject.index;
      var selectedObjectType = selectedObject.type;
    } else {
      var items = (cartItems.length > 0 || disabledGroceries.length > 0) ? cartData.lines : mealsCartItems;
      var selectedItem = selectedObject;
      var selectedObjectType = cartType;
    }

    if (items[selectedItem]) {
      var max_qty = 999;
      // Only do quantity checks on Grocery items.
      if (selectedObjectType == 'grocery') {
        // Implement qty_avail logic on web as well in the future.
        // console.log('Yes', items[selectedItem].product_id)
        // console.log('Yes', items[selectedItem].qty_avail)
        if (items[selectedItem].product_id.ecom_no_order_unavail) {
          max_qty = items[selectedItem].qty_avail;
        }
        if (items[selectedItem].product_id.sale_max_qty && items[selectedItem].product_id.sale_max_qty<max_qty) {
          max_qty = items[selectedItem].product_id.sale_max_qty;
        }
      }

      // Checking Values undefined true undefined 24
      console.log('Checking Values For Quantity Selector',max_qty, items[selectedItem].product_id.ecom_no_order_unavail, items[selectedItem].qty_avail, items[selectedItem].product_id.sale_max_qty, items[selectedItem].product_id.stock_qty_avail)
      obj = {
        quantity: items[selectedItem].qty,
        qty_mult: items[selectedItem].product_id.sale_qty_multiple,
        max_qty: max_qty,
      };
    }
    return obj;
  };

  /* ADD TO CART AND RELATED  END*/

  /* RENDER FUNCTIONS AND RENDER RELATED FUNCTIONS */

  /* Totals/ Empty Cart/ Chat sections */
  const getAmounts = () => {
    const cartType = getCartType(cartData, mealsCartData);
    if (cartType === "grocery") {
      return {
        subTotal: cartData.amount_items,
        vat: cartData.amount_tax,
        delivery: cartData.amount_ship,
        total: cartData.amount_total,
      };
    }
    if (cartType === "meal") {
      return {
        subTotal: mealsCartData.amount_items,
        vat: mealsCartData.amount_tax,
        delivery: mealsCartData.amount_ship,
        total: mealsCartData.amount_total,
      };
    }
    if (cartType === "combined") {
      return {
        subTotal: cartData.amount_items + mealsCartData.amount_items,
        vat: cartData.amount_tax + mealsCartData.amount_tax,
        delivery: cartData.amount_ship_combined,
        total: mealsCartData.amount_total_combined,
      };
    }
    return {};
  };

  const { subTotal, vat, delivery, total } = getAmounts();

  const renderCartTotals = () => {

    return (
     <View style={[styles.cartContainerMultiple, { marginTop: isSingleDayDelivery() ? 10 : 10 }]} >
        <View style={styles.cartTextRow}>
          <Text lighHeight={19} color={cartDrkGrey}>
            Subtotal
          </Text>
          <Text color={cartDrkGrey} condensed>
            ฿{number_format(subTotal, "0,0")}
          </Text>
        </View>

        <View style={styles.cartTextRow}>
          <View style={styles.questionRow}>
            <Text lighHeight={19} color={addressGrey}>
              VAT
            </Text>
          </View>
          <Text condensed color={addressGrey}>
            ฿{number_format(vat, "0,0")}
          </Text>
        </View>

        <View style={styles.cartTextRow}>
          <View style={styles.questionRow}>
            <Text lighHeight={19} color={addressGrey}>
              Delivery
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsOpenDeliveryPopUp(true);
              }}
            >
              <Image source={question_ic} style={styles.delivertQuestionImg} />
            </TouchableOpacity>
          </View>
          <Text condensed color={addressGrey}>
            ฿{number_format(delivery, "0,0")}
          </Text>
        </View>

        <View style={styles.cartTextRow}>
          <Text color={cartDrkGrey} bold>
            Total{" "}
          </Text>
          <Text condensedBold color={cartDrkGrey}>
            ฿{number_format(total, "0,0")}
          </Text>
        </View>
      </View>
    );
  };

  const renderRemoveButton = () => (
    <View style={styles.emptyContainer}>
      <TouchableOpacity
        onPress={() => {
          hapticFeedback();
          API.deleteCart(
            cartData,
            setCartData,
            mealsCartData,
            setMealsCartData,
            { user_id: user_id, token: token }
          );
        }}
      >
        <View style={styles.rowCenter}>
          <Image source={trash} style={styles.trashIcon}/>
          <Text small style={styles.emptyText}>Empty cart</Text>
        </View>
      </TouchableOpacity>
      <View style={{flex: 1}}/>
    </View>
  );

  const renderHelp = () => {
    return (
      <ChatUs></ChatUs>
    );
  };
  /* Totals/ Empty Cart/ Chat sections END*/

  /* Errors and Warnings Related Functions */
  const renderMinimumOrderWarning = () => {
    if (!cartData) {
      return null;
    }
    const amount_total_noship = cartData.amount_total_noship;
    return renderMinimumOrderDisplay(amount_total_noship, false);
  };

  // Multiple Deliveries
  const renderMinimumOrderWarningCombined = (exist, deliveryDate) => {
    let amount_total_noship = "";
    if (!exist) {
      amount_total_noship = cartData.amount_total_noship;
    } else {
      amount_total_noship = cartData.amount_total_noship + getAmountForOneDayOfMeals(deliveryDate);
    }
    return renderMinimumOrderDisplayForCombinedDelivery(amount_total_noship);
  };

  // SINGLE Delivery Functions
  const renderMinimumOrderWarningSingleDay = () => {
    if (!cartData) {
      return null;
    }
    const amount_total_noship = cartData.amount_total_noship + mealsCartData.amount_total_noship;
    return renderMinimumOrderDisplay(amount_total_noship, true);
  };

  // Multiple Deliveries
  const getAmountForOneDayOfMeals = (date) => {
    let amount = 0;
    let data = [];
    for (let index = 0; index < dataArray.length; index++) {
      if (dataArray[index].type == "meal" && dataArray[index].deliveryDate == date) {
        data = dataArray[index].data;
      }
    }
    for (let index = 0; index < data.length; index++) {
      amount = amount + data[index].amount;
    }
    return amount;
  };

  // Render minimum order warning for combined delivery
  const renderMinimumOrderDisplayForCombinedDelivery = (amount_total_noship) => {
    const remainingAmount = MIN_DELIVERY_ORDER_AMOUNT - amount_total_noship;
    if (remainingAmount > 0) {
      return (
        <View style={styles.combinedMinOrderWarningContainer}>
          <Image source={appImages.cautionDangerIcon} resizeMode="contain" style={styles.minOrderWarningIcon}/>
          <Text small style={{color: appColors.textDark, flex: 1}}>
            {`We have a minimum delivery value of ฿${MIN_DELIVERY_ORDER_AMOUNT} unless your order contains only Fresh Meals. Please add ฿${remainingAmount} to this delivery to check out.`}
            <Pressable
              onPress={() => {
                setIsOpenAmountPopUp(true);
                setIsAnyPopupOpened(true);
              }}>
              <Image source={appImages.question_ic_black} style={styles.minOrderWarningTooltipIcon} />
            </Pressable>
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }

  const renderMinimumOrderDisplay = (amount_total_noship, isSingleDay) => {

    const remainingAmount = MIN_DELIVERY_ORDER_AMOUNT - amount_total_noship;
    let percentage = (amount_total_noship / MIN_DELIVERY_ORDER_AMOUNT) * 100;
    percentage = percentage + "%";

    if (remainingAmount > 0) {
      return (
        <View style={styles.minOrderSection}>
          <View style={styles.questionRow}>
            <Text color={darkGrey} lineHeight={21.8} style={styles.amountText}>
              Minimum delivery amount is
              <Text condensed color={darkGrey}>
                {" "}
                ฿
              </Text>
              {MIN_DELIVERY_ORDER_AMOUNT}
            </Text>
            <Pressable
              onPress={() => {
                setIsOpenAmountPopUp(true);
                setIsAnyPopupOpened(true);
              }}
            >
              <Image source={question_ic} style={styles.questionImg} />
            </Pressable>
          </View>

          <Text tiny color={darkGrey}>
            Please add {number_format(remainingAmount, "0")} baht more to
            {isSingleDay ? ' checkout.' : ' this day.'}
          </Text>
          <View style={styles.redProgress}>
            <View style={[styles.lightProgress, { width: percentage }]}></View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const renderWaterWarningDisplay = () => {

    if (check_exist_only_water(cartData) == true) {
      return (
        <View style={styles.minOrderSection}>
          <View style={styles.questionRow}>
            <Text color={darkGrey} lineHeight={21.8} style={styles.amountText}>
              You can not check out with only water.
            </Text>
          </View>
          <Text tiny color={darkGrey}>
            Please add some other grocery product to your order.
          </Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const renderMinimumOrderWarningForMeals = () => {
    if (!exist_min_each_day(mealsCartData)) {
      return (
        <View style={styles.minOrderSection}>
          <View style={styles.questionRow}>
            <Text color={darkGrey} lineHeight={21.8} style={styles.amountText}>
              Minimum delivery amount for each day is
              <Text condensed color={darkGrey}>
                {" "}
                ฿
              </Text>
              249
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const renderMinimumOrderWarningForMealsCombined = (deliveryDate) => {
    if (!exist_min_each_day_combined(mealsCartData,deliveryDate)) {
      return (
        <View style={styles.minOrderSection}>
          <View style={styles.questionRow}>
            <Text color={darkGrey} lineHeight={21.8} style={styles.amountText}>
              Minimum delivery amount for each day is
              <Text condensed color={darkGrey}>
                {" "}
                ฿
              </Text>
              249
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  // Multiple Deliveries
  const renderFreeDeliveryWarning = () => {

    var bellow_min = cartData ? cartData.amount_total_noship < MIN_DELIVERY_ORDER_AMOUNT : 0;
    var selected_date = cartData ? cartData.delivery_date : "";
    let free_shipping_amt = 0;
    let free_shipping_percentage = 0;
    if (cartData) {
      if (!cartData.free_ship_min_amount || !cartData.amount_ship) {
        free_shipping_amt = 0;
      } else {
        free_shipping_amt = cartData.free_ship_min_amount - cartData.amount_total_noship;
        free_shipping_percentage = ((cartData.free_ship_min_amount - free_shipping_amt) / cartData.free_ship_min_amount) * 100;
        free_shipping_percentage = free_shipping_percentage.toFixed(2);
      }
    }
    const percentageData = free_shipping_percentage + "%";

    // console.log('percentages', percentageData , free_shipping_percentage)

    var shouldDisplay = true;
    if ((selected_date == null) || (bellow_min == true) || (free_shipping_amt <= 0)) {
      shouldDisplay = false;
    }

    if (shouldDisplay == true) {
      return (
        <View style={styles.minOrderSectionWarning}>
          {free_shipping_percentage >= 100 ? (
            <Text style={styles.topText} extSmall color={addressGrey}>
              Hurray, you got free delivery! You saved
              <Text condensed extSmall color={addressGrey}>
                {" "}
                ฿
              </Text>
              90.
            </Text>
          ) : (
            <Text style={styles.topText} extSmall color={addressGrey}>
              {`Add `}
              <Text condensed extSmall color={addressGrey}>฿</Text>
              {`${number_format(free_shipping_amt, "0,0")} to this day to get free delivery.`}
            </Text>
          )}
          <View style={styles.progressWarning}>
            <View
              style={[styles.progressOrangeWarning, { width: percentageData }]}
            ></View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  /* Errors and Warnings Related Functions End */

  /* Helper functions */
  // Multiple Deliveries
  const getTogetherStyles = (anyDeliveryTogetherExit, togetherDateExist) => {
    if (anyDeliveryTogetherExit) {
      if (togetherDateExist) {
        return {
          combineStyles: [styles.selectTime, styles.togetherContainer],
          sectionHeaderStyles: [{ marginTop: 20 }],
          textColor: accountSettingGray,
        };
      } else {
        return {
          combineStyles: [styles.selectTime, styles.togetherGreyContainer],
          sectionHeaderStyles: [{ marginTop: 20 }],
          textColor: green,
        };
      }
    } else {
      return {
        combineStyles: [styles.selectTime],
        sectionHeaderStyles: [{ marginTop: 20 }],
        textColor: green
      };
    }
  };

  // Multiple Deliveries
  const isTogetherDateExit = (listDta, section) => {
    let exist = false;
    let mealsTogether = false;
    let groceryTogether = false;
    let anyDeliveryTogether = false;
    let combinedDate = "";
    let combineAddress = "";
    let isFirstSectionInCombinedDelivery = false;
    if (
      section.type == "meal" &&
      section.disabled &&
      cartData &&
      cartData.lines.length > 0
    ) {
      for (let index = 0; index < section.data.length; index++) {
        if (section.data[0].delivery_date && cartData.delivery_date == section.data[0].delivery_date) {
          mealsTogether = true;
          exist = true;
          isFirstSectionInCombinedDelivery = section.index < index;
          break;
        }
      }
    }

    if (
      section.type == "grocery" &&
      section.disabled &&
      cartData &&
      cartData.lines.length > 0
    ) {
      for (let index = 0; index < listDta.length; index++) {
        if (listDta[index].type == "meal" && listDta[index].data[0]) {
          if (cartData.delivery_date == listDta[index].data[0].delivery_date) {
            groceryTogether = true;
            exist = true;
            combinedDate = convertDeliveryDateToDisplayDate(listDta[index].data[0].delivery_date, listDta[index].data[0].delivery_slot_id.name);
            combineAddress = listDta[index].data[0].ship_address_id ? listDta[index].data[0].ship_address_id.address: null;
            isFirstSectionInCombinedDelivery = section.index < index;
            break;
          }
        }
      }
    }

    anyDeliveryTogether = groceryTogether || mealsTogether;

    return {
      togetherDateExist: exist,
      anyDeliveryTogether,
      combinedDate,
      combineAddress,
      isFirstSectionInCombinedDelivery
    };
  };

  // Multiple Deliveries
  const getShipAddresses = (cartObj) => {
    const array = [];
    for (let index = 0; index < cartObj.ship_addresses.length; index++) {
      if (cartData.ship_addresses[index].zone_id !== null && cartData.ship_addresses[index].zone_id !== 'null' && cartData.ship_addresses[index].zone_id !== '' ) {
        array.push({
          ...cartData.ship_addresses[index],
          address: cartData.ship_addresses[index].name,
          postal_code: "",
        });
      }
    }
    return array;
  };

  // Multiple Deliveries
  const getMealsShipAddresses = (cartObj, delivery_date) => {
    const array = [];
    if (cartObj && delivery_date) {
      if (cartObj.ship_addresses_days[delivery_date]) {
        const shipAddressesData = cartObj.ship_addresses_days[delivery_date];

        for (let index = 0; index < shipAddressesData.length; index++) {
          if (shipAddressesData[index].zone_id !== null && shipAddressesData[index].zone_id !== 'null' && shipAddressesData[index].zone_id !== '' ) {
            array.push({
              ...shipAddressesData[index],
              address: shipAddressesData[index].name,
              postal_code: "",
              delivery_date: delivery_date,
            });
          }
        }
      }
    }
    return array;
  };
  /* Helper functions End */

  /* Actual rendering for the sections based on the available scenarios END */
  const returnSectionDataSingleDay = () => {
    const sections = [];
    const freshMealArray = [];
    const groeryMealArray = [];
    const disabledGroceries = getDisabledItems( cartData, "grocery").disabledItems;
    const disabledMeals = getDisabledItems(mealsCartData, "meals").disabledItems;

    sections.push({
      time: "",
      objectNo: 0,
      title: "Groceries",
      data: getDisabledItems(cartData, "grocery").items,
      type: "grocery",
      disabled: true,
    });
    sections.push({
      time: "",
      objectNo: 0,
      title: "Fresh Meals",
      data: getDisabledItems(mealsCartData, "meals").items,
      type: "meal",
      disabled: true,
    });
    //disabledMeals.length > 0
    if (false) {
      sections.push({
        time: "",
        objectNo: 0,
        title: " ",
        data: disabledMeals,
        type: "meal",
        disabled: false,
      });
    }

    if (false) {
      sections.push({
        time: "",
        objectNo: 0,
        title: " ",
        data: disabledGroceries,
        type: "grocery",
        disabled: false,
      });
    }
    // console.log("sections--", sections);
    return sections;
  };

  // This function and functionality is not complete (discuss with Jon)
  const getDisabledItemsIds = (disabledItems) => {
    const ids = [];
    for (let index = 0; index < disabledItems.length; index++) {
      ids.push(disabledItems[index].id);
    }
    return ids;
  };

  // This function and functionality is not complete (discuss with Jon)
  const renderNotAvailable = (disabledItems) => {

    const cartType = getCartType(cartData, mealsCartData);
    console.log('Disabled Items', disabledItems);

    if (disabledItems.length > 0) {
      return (
        <View>
          <View style={styles.changeAdress}>
            <View style={styles.questionRow}>
              <Text
                smallRegular
                color={orGrey}
                lineHeight={18.53}
                style={styles.margin}
              >
                Not available outside Bangkok
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsOpenCheckoutPopUp(true);
                  setIsAnyPopupOpened(true);
                }}
              >
                <Image source={question_ic} style={styles.notQuestionImg} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowAddressModalDisabledItems(true);
              }}
            >
              <Text smallRegular color={green}>
                Change address
              </Text>
            </TouchableOpacity>

            {/*
            // Not sure if this sstill needed so leave here for now.
            <View style={styles.questionRow}>
              <Text
                smallRegular
                color={orGrey}
                lineHeight={18.53}
                style={styles.margin}
              >
                Not available after 8pm
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsOpenCheckoutPopUp(true);
                  setIsAnyPopupOpened(true);
                }}
              >
                <Image source={question_ic} style={styles.notQuestionImg} />
              </TouchableOpacity>
            </View>
            */}
          </View>

          <FlatList
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            style={styles.bottomlistStyle}
            data={disabledItems}
            renderItem={({ item, index }) => {
              const length = disabledItems.length;
              return renderListItem(item, index, length, false);
            }}
          />
          <TouchableOpacity
            style={styles.removeItem}
            onPress={() => {
              const ids = getDisabledItemsIds(disabledItems);
              API.cart_delete_multi_lines(
                ids,
                setCartData,
                setMealsCartData,
                cartType,
                setIsAnyApiLoading,
                { user_id: user_id, token: token }
              );
            }}
          >
            <Text smallRegular color={darkGrey} lineHeight={18.53}>
              Remove items
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return null;
    }
  };

  const checkForGroceryErrorsAndFix = (obj) => {

    const cartType = getCartType(cartData, mealsCartData);

    // console.log('Checking Obj', obj)
    if ((obj.qty_avail < obj.total_qty) && (obj.product_id.categ_id!=394) && (obj.product_id.categ_id!=406)) {
      if (obj.lot_id) {
        console.log('Obj will have a lot related error', obj)
        // Another customer just snatched up this weight
        if (obj.qty_avail <= 0) {
          API.cart_delete_line(
            obj.id,
            setCartData,
            setMealsCartData,
            cartType,
            { user_id: user_id, token: token }
          );
          return;
        // Find me a new one
        } else {
          API.grocery_cart_replace_lot(
            obj.id,
            setMealsCartData,
            setCartData,
            'yes',
            cartType,
            { user_id: user_id, token: token },
            'delete_item'
          );
          return;
        }
      } else if (obj.product_id.ecom_no_order_unavail) {
        console.log('Obj will have a quantity related error', obj)
        // This item is no longer available
        if (obj.qty_avail<=0) {
          API.cart_delete_line(
            obj.id,
            setCartData,
            setMealsCartData,
            cartType,
            { user_id: user_id, token: token }
          );
          return;
        } else if (obj.qty > obj.qty_avail ) {
        // Sorry, we only have")} {l.qty_avail} {NF.translate("in stock today")}. {NF.translate("You have also selected this item as part of a bundle"
            API.grocery_cart_set_qty_simple(
            obj.product_id.id,
            obj.qty_avail,
            2,
            updateCartId,
            setCartData,
            setMealsCartData,
            cartType,
            setIsAnyApiLoading,
            { token, user_id },
            'grocery_add_to_cart_cart', 
            (err) => {
              console.log("err--", err);
            }
          );
          return;
        }
        /*
        // Review this scenario later on
        if (obj.total_qty>obj.qty) {
          API.grocery_cart_set_qty_simple(
            obj.product_id.id,
            obj.qty-(obj.total_qty-obj.qty_avail),
            2,
            updateCartId,
            setCartData,
            setMealsCartData,
            cartType,
            setIsAnyApiLoading,
            { token, user_id },
            'grocery_add_to_cart_cart', 
            (err) => {
              console.log("err--", err);
            }
          );
          return;
        }
        */
        // Sorry, we only have x in stock today
      } else {
        return;
      }
    } else {
      return;
    }

  };

  // Merged function for displaying a item line
  const renderListItem = (obj, index, data, available) => {

    var CombinedOrMultipleDays = CombinedOrMultipleDaysDelivery();
    const cartType = getCartType(cartData, mealsCartData);

    // console.log('CombinedOrMultipleDays',CombinedOrMultipleDays, cartType);

    var border = 1;
    if (CombinedOrMultipleDays == true) {
      // console.log('Should be removed obj.type',obj.type);
      if (obj.type == "meal" && should_meal_be_removed(obj.delivery_date) == true) {
        API.cart_delete_line(
          obj.id,
          setCartData,
          setMealsCartData,
          cartType,
          { user_id: user_id, token: token }
        );
      }
      if (obj.type == 'grocery') {
        checkForGroceryErrorsAndFix(obj);
      }
      if (index + 1 == data.length) {
        border = 0;
      }
      var type = obj.type;
    } else {
      if (cartType == 'meal') {
        var type = 'meal';
        if (should_meal_be_removed(obj.delivery_date) == true) {
          API.cart_delete_line(
            obj.id,
            setCartData,
            setMealsCartData,
            cartType,
            { user_id: user_id, token: token }
          );
        }
      }
      // Automations for certain errors in grocery cart
      if (cartType == 'grocery') {
        var type = 'grocery';
        checkForGroceryErrorsAndFix(obj);
      }
      if (index + 1 == data) {
        border = 0;
      }
    }

    const {product_id, uom_id, qty, amount, lot_id} = obj;
    const {name, image , ecom_short_title, sale_max_qty, sale_qty_multiple} = product_id;

    var product_name = name;
    if ((ecom_short_title!== null) && (ecom_short_title!=='')) {
      product_name = ecom_short_title;
    }

    let saleTaxId = null;
    const imageUrl = IMAGE_URL + image;

    const imageStyles = [styles.favouriesMultiple];
    if (!available) {
      imageStyles.push({ tintColor: 'gray' });
    }

    return (
      <>
      <View
        style={[
          styles.cell,
          {
            borderBottomWidth: border,
            borderTopLeftRadius: index == 0 ? 5 : 0,
            borderTopRightRadius: index == 0 ? 5 : 0,
            borderBottomLeftRadius: index == data.length - 1 ? 5 : 0,
            borderBottomRightRadius: index == data.length - 1 ? 5 : 0
          },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.imgContainer}>
            {available ? (
              <FastImage
                source={{
                  uri: get_thumbnail(imageUrl, 256),
                }}
                style={imageStyles}
              >
                {(product_id.categ_id == "394" || product_id.categ_id == "406") && (
                  <FastImage source={mtoWhite} style={styles.mtoImg} />
                )}
              </FastImage>
            ) : (
              <Grayscale>
                <FastImage
                  source={{
                    uri: get_thumbnail(imageUrl, 256),
                  }}
                  style={imageStyles}
                >
                  {(product_id.categ_id == "394" || product_id.categ_id == "406") && (
                    <FastImage source={mtoWhite} style={styles.mtoImg} />
                  )}
                </FastImage>
              </Grayscale>
            )}
          </View>
          <View style={styles.textContainerMultiple}>
            <Text noOfLines={2}>
              { type === 'meal' &&
                <>
                  <Text condensedBold minSmall color={accountSettingGray} style={{textTransform: 'uppercase'}}>
                    {renderMealProductUOM(product_id, uom_id.name,'big') + " | "}
                  </Text>
                  <Text
                    extSmall
                    color={available ? accountSettingGray : addressGrey}
                    lineHeight={14}
                    numberOfLines={2}
                    style={styles.itemName}
                  >
                    {renderMealProductName(product_id, product_name)}
                  </Text>
                </>
              }
              { type === 'grocery' &&
                <Text
                  extSmall
                  color={available ? accountSettingGray : addressGrey}
                  lineHeight={14}
                  numberOfLines={2}
                  style={styles.itemName}
                >
                  {product_name}
                </Text>
              }
            </Text>
            <Text minSmall color={available ? accountSettingGray : addressGrey}>
              { type === 'meal' &&
                <>
                  {"per " + renderMealProductUOM(product_id, uom_id.name, 'small') + " "}
                </>
              }
              { type === 'grocery' &&
                <>
                  {(uom_id && uom_id.name) && 
                    <>
                      {"per " + uom_id.name + " "}
                    </>
                  }
                  {lot_id &&
                    "(" + number_format(lot_id.weight, "0,0") + "g)"
                  }
                </>
              }
              {(saleTaxId == "76" || saleTaxId == "77") && (
                <Text minSmall>{"(ex VAT)"}</Text>
              )}
            </Text>
          </View>
        </View>

        <View style={styles.endRow}>
          {lot_id ?
            (
              <TouchableOpacity
                onPress={() => {
                  if (CombinedOrMultipleDays == true) {
                    setSelectedObject({index, data, type });
                  } else {
                    setSelectedObject(index);
                  }
                  setShowSpecialQuantityPopup(true);
                  setIsAnyPopupOpened(true);
                }}
                style={styles.addBtn}
              >
                <Text regular color={available ? accountSettingGray : addressGrey}>
                  {qty}
                </Text>
              </TouchableOpacity>
            )
            :
            (
              <TouchableOpacity
                onPress={() => {
                  if (CombinedOrMultipleDays == true) {
                    setSelectedObject({index, data, type });
                  } else {
                    setSelectedObject(index);
                  }
                  setIsOpenQuantitySelectPopUp(true);
                }}
                style={styles.addBtn}
              >
                <Text regular color={available ? accountSettingGray : addressGrey}>
                  {qty}
                </Text>
              </TouchableOpacity>
            )
          }

          <Text condensed color={available ? black : addressGrey}>
            ฿{number_format(amount, "0,0")}
          </Text>
        </View>
      </View>
      {/*
      {renderExpendedDetailsNew(product_id)}
      */}
      </>
    );
  };

  const renderMealProductUOM = (product_id, uom_name, type) => {

    var output = uom_name;

    if (product_id && product_id.byo_salad_id && product_id.byo_salad_id!==null) {
      if (type == 'big') {
        output = 'BYO Salad';
      } else {
        output = 'Salad';
      }
    }

    if (product_id && product_id.byo_plate_id && product_id.byo_plate_id!==null) {
      if (type == 'big') {
        output = 'BYO Plate';
      } else {
        output = 'Plate';
      }
    }

    return output;

  };

  const renderMealProductName = (product_id, product_name) => {

    var output = product_name;

    if (product_id && product_id.byo_salad_id && product_id.byo_salad_id!==null) {
      output = product_id.byo_salad_id.salad_mix[0].product_id.name;
    }

    if (product_id && product_id.byo_plate_id && product_id.byo_plate_id!==null) {
      output = product_id.byo_plate_id.proteins[0].product_id.name;
    }

    return output;

  };

  const renderExpendedDetailsNew = (product_id) => {

    return (
      <>
        {(product_id && product_id.byo_salad_id && product_id.byo_salad_id!==null) &&
          <View style={styles.expendedDetails}>
            {(product_id.byo_salad_id.salad_mix !=null && product_id.byo_salad_id.salad_mix.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Salad mix:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_salad_id.salad_mix[0].product_id.name}
                </Text>
              </Text>
            }
            {(product_id.byo_salad_id.proteins !=null && product_id.byo_salad_id.proteins.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Protein:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_salad_id.proteins[0].product_id.name}
                </Text>
              </Text>
            }

            {(product_id.byo_salad_id.dressings !=null && product_id.byo_salad_id.dressings.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Dressing:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_salad_id.dressings[0].product_id.name}
                </Text>
              </Text>
            }

            {(product_id.byo_salad_id.premium_addons !=null && product_id.byo_salad_id.premium_addons.length>0) &&
              <>
              {product_id.byo_salad_id.premium_addons.map((item_details,i)=>{
                return <Text extSmall color={orderDarkGray} lineHeight={17} key={i}>
                          Add-ons:
                          <Text extSmall color={accountSettingGray}>
                            {" "}
                            ({item_details.qty}) {item_details.product_id.name}
                          </Text>
                        </Text>
              })}
              </>
            }

          </View>
        }

        {(product_id && product_id.byo_plate_id && product_id.byo_plate_id!==null) &&
          <View style={styles.expendedDetails}>
            {(product_id.byo_plate_id.proteins !=null && product_id.byo_plate_id.proteins.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Protein:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_plate_id.proteins[0].product_id.name}
                </Text>
              </Text>
            }
            {(product_id.byo_plate_id.dressings !=null && product_id.byo_plate_id.dressings.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Sauce:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_plate_id.dressings[0].product_id.name}
                </Text>
              </Text>
            }

            {(product_id.byo_plate_id.sides !=null && product_id.byo_plate_id.sides.length>0) &&
              <>
              {product_id.byo_plate_id.sides.map((item_details,i)=>{
                return <Text extSmall color={orderDarkGray} lineHeight={17} key={i}>
                          Side
                          <Text extSmall color={accountSettingGray}>
                            {" "}
                            ({item_details.qty}) {item_details.product_id.name}
                          </Text>
                        </Text>
              })}
              </>
            }

            {(product_id.byo_plate_id.premium_addons !=null && product_id.byo_plate_id.premium_addons.length>0) &&
              <>
              {product_id.byo_plate_id.premium_addons.map((item_details,i)=>{
                return <Text extSmall color={orderDarkGray} lineHeight={17} key={i}>
                          Add-ons:
                          <Text extSmall color={accountSettingGray}>
                            {" "}
                            ({item_details.qty}) {item_details.product_id.name}
                          </Text>
                        </Text>
              })}
              </>
            }

          </View>
        }
      </>
    )

  };

  const renderDeliveryTime = () => {
    return (
      <View style={[styles.headerSection, { marginTop: 10 }]}>
        <Text regular color={addressGrey} lineHeight={25}>
          Delivery Time
        </Text>
        <View style={styles.headerRowSingle}>
          <TouchableOpacity
            style={styles.selectTime}
            onPress={() => {
              setShowModal(true);
            }}
          >
            <Text
              smallRegular
              color={getTimeSlotForDelivery().dateString == "Select time" ? darkGrey : green}
              style={styles.timeWidth}
            >
              {getTimeSlotForDelivery().dateString}
            </Text>

            <Image source={thick_arrow} style={styles.arrow}></Image>
          </TouchableOpacity>

          <View style={styles.line} />
          {(loginData) &&
            <TouchableOpacity
              style={styles.selectAddress}
              onPress={() => {
                setAddressArray(getShipAddresses(cartData));
                setShowAddressModal(true);
              }}
            >
              <Text
                smallRegular
                color={!(cartData && cartData.ship_address_id) ? darkGrey : green}
                style={styles.addressWidth}
                noOfLines={1}
              >
                {mealsCartData && mealsCartData.lines[0].ship_address_id
                  ? mealsCartData.lines[0].ship_address_id.address
                  : "Address"}
              </Text>
              <Image source={thick_arrow} style={styles.arrow}></Image>
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  };

  // Render for One combined day
  const renderCombinedSingleDayCart = () => {
    const sectionData = returnSectionDataSingleDay();
    const previewRowKey = showSuggestiveReveal ? ((((sectionData || [])[0] || {}).data || [])[0] || {}).id : null;
    return (
      <SwipeListView
        useSectionList={true}
        style={[styles.listSectionStyle, { marginTop: 14 }]}
        scrollEnabled={false}
        keyExtractor={(item, index) => item.id}
        previewRowKey={previewRowKey}
        previewDuration={SWIPE_ACTION_PREVIEW_DELAY}
        previewOpenValue={-75}
        sections={sectionData.map((section, index) => ({
          ...section,
          index,
        }))}
        renderItem={(obj) => {
          const { item, index, section, disabled } = obj;
          return renderListItem({ ...item, type: section.type }, index, section.data, section.disabled);
        }}
        renderHiddenItem={(data, rowMap) => {
          const { item, index, section } = data;
          return (
            <TouchableOpacity
              style={[
                styles.rowBack,
                {
                  borderTopLeftRadius: index == 0 ? 6 : 0,
                  borderTopRightRadius: index == 0 ? 6 : 0,
                  borderBottomLeftRadius: index == section.data.length - 1 ? 6 : 0,
                  borderBottomRightRadius: index == section.data.length - 1 ? 6 : 0,
                  overflow: 'hidden'
                }
              ]}
              onPress={() => {
                API.cart_delete_line(
                  item.id,
                  setCartData,
                  setMealsCartData,
                  'combined',
                  { user_id: user_id, token: token }
                );
                hapticFeedback();
              }}
            >
              <View style={styles.removeButton}>
                <Text color={white}>Remove</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        renderSectionHeader={(obj) => {
          const { title, index, type, data } = obj.section;
          return (
            <View>
              {(type == "grocery" && cartData.delivery_date && cartData.delivery_slot_id) &&
                renderMinimumOrderWarningSingleDay()
              }
              {/* {type == "meal" && renderMinimumOrderWarningForMeals()} */}
              <View style={[styles.headerMargin, { marginTop: index > 0 ? 24 : 0 }]} >
                <Text smallRegular color={orderDarkGray}>
                  {title}
                </Text>
                {index == 1 && (
                  <Image source={fresh_meals_ic} style={styles.freshMeals} />
                )}
              </View>
            </View>
          );
        }}
        leftOpenValue={75}
        rightOpenValue={-75}
        disableRightSwipe={true}
      />
    );
  };

   // Render for Multiple days worth of meals or combined carts (with multiple days)
  const renderCombinedOrMultipleDaysMealsCart = () => {
    let anyDeliveryTogetherExit = false;
    const listDta = dataArray;
    // console.log('renderCombinedOrMultipleDaysMealsCart',dataArray);

    const previewRowKey = showSuggestiveReveal ? ((((listDta || [])[0] || {}).data || [])[0] || {}).id : null;
    return (
      <Transitioning.View ref={ref} transition={transition}>
        <SwipeListView
          useSectionList={true}
          scrollEnabled={false}
          style={styles.listSectionStyle}
          keyExtractor={(item, index) => item.id}
          previewRowKey={previewRowKey}
          previewDuration={SWIPE_ACTION_PREVIEW_DELAY}
          previewOpenValue={-75}
          sections={listDta.map((section, index) => ({ ...section, index }))}
          renderItem={(obj) => {
            const { item, index, section } = obj;
            return renderListItem({ ...item, type: section.type }, index, section.data, section.disabled);
          }}
          renderHiddenItem={(data, rowMap) => {
            let { item, index, section } = data;
            section = section || {};
            return (
              <TouchableOpacity
                style={[styles.rowBack,
                {
                  borderTopLeftRadius: index == 0 ? 6 : 0,
                  borderTopRightRadius: index == 0 ? 6 : 0,
                  borderBottomLeftRadius: index == (section.data || []).length - 1 ? 6 : 0,
                  borderBottomRightRadius: index == (section.data || []).length - 1 ? 6 : 0,
                  overflow: 'hidden'
                }]}
                onPress={() => {
                  // if (section.type == "grocery" && cartData.lines.length == 1) {
                    API.cart_delete_line(
                      item.id,
                      setCartData,
                      setMealsCartData,
                      'combined',
                    { user_id: user_id, token: token }
                    );
                  // }
                  hapticFeedback();
                }}
                key={index}
              >
                <View style={styles.removeButton}>
                  <Text color={white}>Remove</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          renderSectionHeader={(obj) => {
            const {
              selectedTime,
              selectedAddress,
              objectNo,
              index,
              data,
              shipAddresses,
              type,
              deliveryDate,
            } = obj.section;

            if (!obj.section.disabled) {
              return null;
            }

            const {
              togetherDateExist,
              anyDeliveryTogether,
              combinedDate,
              combineAddress,
              isFirstSectionInCombinedDelivery,
            } = isTogetherDateExit(listDta, obj.section);

            if (anyDeliveryTogether) {
              anyDeliveryTogetherExit = true;
            }
            const { combineStyles, textColor, sectionHeaderStyles } = getTogetherStyles( anyDeliveryTogetherExit, togetherDateExist);
            if (index == 0) {
              sectionHeaderStyles.push({
                marginTop: 0
              });
            }

            return (
              <View style={[...sectionHeaderStyles, styles.headerSection]}>
                {(!togetherDateExist || isFirstSectionInCombinedDelivery) && (
                  <Text regular color={addressGrey} lineHeight={25} style={{marginBottom: 10}}>
                    Delivery Time
                  </Text>
                )}

                <View style={[styles.headerRowMultiple, {
                    alignItems: anyDeliveryTogetherExit ? 'flex-start' : 'center'
                  }]}>
                  <View style={[styles.selectTimeOuter]}>
                    <TouchableOpacity
                      style={combineStyles}
                      onPress={() => {
                        setShowModal(true);
                        setSelectedSection(index);
                        // alert(index + dataArray[selectedSection].data[0].delivery_date);
                      }}
                    >
                      <Text
                        smallRegular
                        color={
                          selectedTime == "Select time" ? darkGrey : textColor
                        }
                        style={styles.timeWidth}
                      >
                        {togetherDateExist && type == "grocery"
                          ? combinedDate
                          : selectedTime}
                      </Text>
                      <Image source={thick_arrow} style={styles.arrow}></Image>
                    </TouchableOpacity>

                    {togetherDateExist && (
                      <Text
                        minSmall
                        color={togetherGrey}
                        lineHeight={15}
                        style={styles.deliveredTogether}
                      >
                        *Will be delivered together
                      </Text>
                    )}
                  </View>

                  {!anyDeliveryTogetherExit && <View style={styles.line} />}
                  {(loginData) &&
                    <TouchableOpacity
                      style={[
                        styles.selectAddress,
                        styles.selectButton,
                      ]}
                      onPress={() => {
                        // alert(objectNo);
                        // setSelectedSection(objectNo); // Not sure what objectNo is all about
                        setSelectedSection(index);
                        setAddressArray(shipAddresses);
                        setShowAddressModal(true);
                        //   setIsAnyPopupOpened(true)
                      }}
                    >
                      <Text
                        smallRegular
                        color={selectedAddress == "Address" ? darkGrey : green}
                        style={styles.addressWidth}
                        noOfLines={1}
                      >
                        {togetherDateExist && type == "grocery"
                          ? combineAddress
                          : selectedAddress}
                      </Text>
                      <Image source={thick_arrow} style={styles.arrow}></Image>
                    </TouchableOpacity>
                  }
                </View>

                {!togetherDateExist && type == "meal" && renderMinimumOrderWarningForMealsCombined(deliveryDate)}
                {!togetherDateExist && type == "grocery" && renderMinimumOrderWarning()}

                {!togetherDateExist && type == "grocery" && renderFreeDeliveryWarning()}

                {/*
                {objectNo == 0 && selectedTime !== 'Select time' && (
                  <View>
                    {selectedTime.includes('Sun') ? (
                      <Text
                        style={styles.topTextSaved}
                        extSmall
                        color={addressGrey}
                      >
                        Hurray, you got free delivery! You saved
                        <Text condensed extSmall color={addressGrey}>
                          {' '}
                          ฿
                        </Text>
                        90.
                      </Text>
                    ) : (
                      <Text style={styles.topText} extSmall color={addressGrey}>
                        Add
                        <Text condensed extSmall color={addressGrey}>
                          {' '}
                          ฿
                        </Text>
                        50 to your cart to get free delivery.
                      </Text>
                    )}
                  </View>
                )}
                {objectNo == 0 &&
                  selectedTime !== 'Select time' &&
                  !selectedTime.includes('Sun') && (
                    <View style={styles.progress}>
                      <View style={styles.progressOrange}></View>
                    </View>
                  )} */}
              </View>
            );
          }}
          renderSectionFooter={(obj) => {
            const {
              type,
              deliveryDate,
            } = obj.section;
            const { togetherDateExist } = isTogetherDateExit(listDta, obj.section);

            if (togetherDateExist && type == 'meal' && cartData.delivery_date && cartData.delivery_slot_id) {
              return (
                <View style={styles.sectionFooterStyle}>
                  {renderMinimumOrderWarningCombined(togetherDateExist, deliveryDate)}
                </View>
              )
            } else {
              return null;
            }
          }}
          leftOpenValue={75}
          rightOpenValue={-75}
          disableRightSwipe={true}
        />
      </Transitioning.View>
    );
  };

  // Render for One day worth of Meals or Groceries Only
  const renderGroceriesOrSingleDayMealCart = () => {
    var cartType = getCartType(cartData, mealsCartData);
    // console.log("cartType in render",cartType)
    let items = (cartItems.length > 0 || disabledGroceries.length > 0) ? cartItems : mealsCartItems;
    items = items.map((item) => ({
      ...item,
      key: String(item.id)
    }));
    const previewRowKey = showSuggestiveReveal ? (items[0] || {}).key : null;
    return (
      <View style={styles.flex}>
        {(cartData && cartData.lines.length > 0) && (
          <View style={styles.singleDayWarningsContainer}>
            {renderFreeDeliveryWarning()}
          </View>
        )}
        <SwipeListView
          stickySectionHeadersEnabled
          windowSize={11}
          swipeGestureBegan={() => {
            // setIsScrollEnabled(false)
          }}
          swipeGestureEnded={() => {
            // setIsScrollEnabled(true)
          }}
          previewRowKey={String(previewRowKey)}
          previewDuration={SWIPE_ACTION_PREVIEW_DELAY}
          previewOpenValue={-75}
          style={styles.listStyle}
          scrollEnabled={false}
          data={items}
          renderItem={({ item, index }) => {
            const length = items.length;
            return renderListItem(item, index, length, true);
          }}
          renderHiddenItem={(data, rowMap) => {
            let { item, index, section } = data;
            section = section || {};
            return (
              <TouchableOpacity
                style={[
                  styles.rowBack,
                  {
                    borderTopLeftRadius: index == 0 ? 6 : 0,
                    borderTopRightRadius: index == 0 ? 6 : 0,
                    borderBottomLeftRadius: index == (section.data || []).length - 1 ? 6 : 0,
                    borderBottomRightRadius: index == (section.data || []).length - 1 ? 6 : 0,
                    overflow: 'hidden'
                  }
                ]}
                onPress={() => {
                  API.cart_delete_line(
                    item.id,
                    setCartData,
                    setMealsCartData,
                    cartType,
                    { user_id: user_id, token: token }
                  );
                  hapticFeedback();
                }}
                key={index}
              >
                <View style={styles.removeButton}>
                  <Text color={white}>Remove</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          leftOpenValue={75}
          rightOpenValue={-75}
          disableRightSwipe={true}
        />
      </View>
    );
  };
  /* Actual rendering for the sections based on the available scenarios END */

  // RENDER RELATED END

  // VALIDATION - Validation before moving to next step
  const validateData = () => {

    var cartType = getCartType(cartData, mealsCartData);
    var CombinedOrMultipleDays = CombinedOrMultipleDaysDelivery();

    const disItems = getDisabledItems(cartData, 'grocery').disabledItems;

    // mealsCartData
    // console.log('VALIDATE DATA', getTimeSlotForDelivery().dateString, exist_min_each_day(mealsCartData), cartType, CombinedOrMultipleDays);
    var error = false;

    if (CombinedOrMultipleDays == true) {

      const timesArray = Object.assign([], dataArray);
      // console.log("timesArray=", timesArray);

      let timeCount = 0;
      let addressCount = 0;
      for (let index = 0; index < dataArray.length; index++) {
        if (timesArray[index].selectedTime == "Select time" &&  cartData.delivery_date == null) {
          console.log('Error 1 1');
          timeCount = 1;
        }

        if (loginData) {
          if (timesArray[index].selectedAddress == "Address") {
            console.log('Error 1 2');
            addressCount = 1;
          }
        }
      }

      // console.log("timeCount-=-=", timeCount);
      // console.log("addressCount-=-=", addressCount);

      if (timeCount > 0 || addressCount > 0) {
        console.log('Error 1');
        error = true;
      }

      if ((cartType === "meal") || (cartType === "combined")) {
        if (cartData.delivery_date) {
          if (exist_min_each_day_no_combined(mealsCartData,cartData.delivery_date) == false) {
            error = true;
            console.log('Error 2');
          }
        }
      }

      if ((cartType === "grocery") || (cartType === "combined")) {
        var bellow_min = 0;
        if(cartData) {
          var bellow_min = cartData.amount_total_noship; // Review this
          if (isSingleDayDelivery() == true) {
            bellow_min += mealsCartData.amount_total_noship;
          } else {
            if (cartData.delivery_date) {
              // Brought over from the new web
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

              var we_have_same_date_delivery = false;
              {delivery_dates.map( mealplan_date => {
                let order=order_by_date[mealplan_date]
                if (cartData.delivery_date == mealplan_date) {
                  we_have_same_date_delivery = true;
                }
              })}

              if (we_have_same_date_delivery == true) {
                bellow_min += getAmountForOneDayOfMeals(cartData.delivery_date);
              }
              console.log('bellow_min',bellow_min);
            }
          }
        }
        // Check if the order is lower than 750B
        if (bellow_min < MIN_DELIVERY_ORDER_AMOUNT) { //  && we_have_same_date_delivery == false
          error = true;
          console.log('Error 3');
        }
      }

      if (disItems.length >0) {
        error = true;
        console.log('Error 4 - We have disabled items');
      }

    } else {

      if (getTimeSlotForDelivery().dateString == "Select delivery time") {
        error = true;
        console.log('Error 1');
      }

      if (cartType === "meal") {
        if (exist_min_each_day(mealsCartData) == false) {
          error = true;
          console.log('Error 2');
        }
      }

      if (cartType === "grocery") {
        var bellow_min = 0;
        if(cartData) {
          var bellow_min = cartData.amount_total_noship;
        }
          // Check if the order is lower than 750B
        if (bellow_min < MIN_DELIVERY_ORDER_AMOUNT) { //  && we_have_same_date_delivery == false
          error = true;
          console.log('Error 3');
        }

        if (check_exist_only_water(cartData) == true) {
          error = true;
          console.log('Error 4');
        }

      }

      if (disItems.length >0) {
        error = true;
        console.log('Error 4 - We have disabled items');
      }

    }

    // console.log('error verification after ', error, exist_min_each_day(mealsCartData), cartType, CombinedOrMultipleDays)
    return error;

  };

  const validation = validateData();

  const insets = useSafeAreaInsets();

  console.log('RERENDER Cart.js');
  if (cartData && (cartData.amount_total == undefined || cartData.ship_addresses == undefined) && cartItems.length > 0) {
    console.log("Scenario 0 - Loading Cart");
    return (
      <View style={styles.container}>
        <LoadingCart />
      </View>
    );
  } else if (cartItems.length == 0 && mealsCartItems.length == 0 && disabledMeals == 0 && disabledGroceries == 0 && dataArray.length == 0) { // || (mealsCartData && mealsCartData.amount_total == undefined)
    console.log("Scenario 1 - Empty Cart");
    return (
      <View style={styles.container}>
        <EmptyCart />
        {(loginData) &&
          <LinkLINEAccountPopup showPopup={showLINELinkPopup} setShowPopup={setShowLINELinkPopup} loginData={loginData} popupType={'follow_qa'}/>
        }
      </View>
    );
  // Scenario for Combined Cart and Multile Days Deliveries For Mealplan
  } else if (CombinedOrMultipleDaysDelivery() == true) {
    console.log("Scenario 2 - Multiple Days of Meals or Combined Cart",isSingleDayDelivery());
    // console.log("dataArray",selectedSection, dataArray[selectedSection], dataArray[selectedSection].type);
    return (
      <View style={styles.container}>
        <View style={[styles.bodyMultiple, { paddingTop: insets.top }]}>
          <ScrollView>
            {(isSingleDayDelivery() == true) && (
              <View>
                <View>{renderDeliveryTime()}</View>
                {renderCombinedSingleDayCart()}
              </View>
            )}
            {(isSingleDayDelivery() == false) && <View>{renderCombinedOrMultipleDaysMealsCart()}</View>}
            {renderNotAvailable(disabledGroceries)}
            {disabledGroceries.length == 0 ? renderRemoveButton() : null}
            {renderCartTotals()}
            {renderHelp()}
          </ScrollView>

          <Button
            disabled={validation}
            onPress={() => {
              if (loginData) {
                navigation.navigate("Checkout");
              } else {
                setShowLoginOrCreateAccountPopup(true);
              }
            }}
            btnTitle={"Checkout"}
            style={[
              styles.checkoutBtn,
              {
                backgroundColor: validation ? greenButtonOpacity : quantityGreen,
              },
            ]}
          />

          {showAddressModal &&
            <SelectAddress
              heading={"Select address"}
              flow={'cart'}
              deliveryDate={getTimeSlotForDelivery().defaultDateForPicker}
              navigation={navigation}
              fromCart={true}
              cartData={cartData}
              cartType={getCartType(cartData, mealsCartData)}
              addressArray={addressArray}
              showAddressModal={showAddressModal}
              setSelectedAddress={(obj) => setSelectedAddress(obj)}
              selectedSection ={(selectedSection !== null && dataArray[selectedSection] && dataArray[selectedSection].type == "grocery" && (isSingleDayDelivery() == false)) ? dataArray[selectedSection].type : 'meal'}
              setShowAddressModal={() => {
                setShowAddressModal(false);
                //  setIsAnyPopupOpened(false)
              }}
            />
          }

          {/* Used for adjusting address on the Disabled Items */}
          {(showAddressModalDisabledItems) &&
            <SelectAddress
              heading={'Select address'}
              flow={'cart'}
              deliveryDate={getTimeSlotForDelivery().defaultDateForPicker}
              navigation={navigation}
              fromCart={true}
              cartType={getCartType(cartData, mealsCartData)}
              cartData={cartData}
              addressArray={getShipAddresses(cartData)}
              showAddressModal={showAddressModalDisabledItems}
              setSelectedAddress={(obj) => setSelectedAddress(obj)}
              selectedSection ={'grocery'}
              setShowAddressModal={() => {
                setShowAddressModalDisabledItems(false)
                //  setShowAddressModalConatiner(false)
                //  setIsAnyPopupOpened(false)
              }}
            />
         }

          {showModal && (
            <TimeSlot
              heading={"Delivery times"}
              freshMeals={true}
              isSingleDay={isSingleDayDelivery()}
              timeSlots={getTimeSlots()}
              cartType={getCartType(cartData, mealsCartData)}
              mealsCartData={mealsCartData}
              cartData={cartData}
              fromCart={true}
              defaultDate={getTimeSlotForDelivery().defaultDateForPicker}
              showModal={showModal}
              splitTheDelivery={() => SplitDeliveries()}
              selectedSection ={(selectedSection !== null && dataArray[selectedSection] && dataArray[selectedSection].type == "grocery" && (isSingleDayDelivery() == false)) ? dataArray[selectedSection].type : 'meal'}
              setSelectTimeSlot={(obj) => {
                updateTimeSlot(obj);
                onchange_time_slot(obj.completeDate, obj.slotId);
              }}
              setShowPrivacyModal={() => {
                setShowModal(false);
              }}
            />
          )}

          {isOpenAmountPopUp && (
            <View style={styles.modalContain}>
              <OrderAmountsPopup
                heading={"Minimum delivery amounts"}
                content={NotAvailable}
                showPrivacyModal={isOpenAmountPopUp}
                contentHeight={301}
                setShowPrivacyModal={() => {
                  setIsOpenAmountPopUp(false);
                  setIsAnyPopupOpened(false);
                }}
              />
            </View>
          )}

          {isOpenQuantitySelectPopUp && (
            <View style={styles.modalContain}>
              <QuantityPopup
                heading={"Select time slot"}
                showModal={isOpenQuantitySelectPopUp}
                selectedObject={selectedObject}
                selectedQuantityObject={getSelectedQuantityObj()}
                setSelectQuantity={selectQuantity}
                setShowPrivacyModal={() => {
                  setIsOpenQuantitySelectPopUp(false);
                  setSelectedObject(null);
                }}
              />
            </View>
          )}

          {showSpecialQuantityPopup && (
            <View style={styles.modalContain}>
              <SpecialQuantityPopup
                deleteLot={deleteLot}
                addExtraLot={addExtraLot}
                CombinedOrMultipleDaysDelivery={CombinedOrMultipleDaysDelivery()}
                selectedObject={selectedObject}
                showModal={showSpecialQuantityPopup}
                setShowPrivacyModal={() => {
                  setShowSpecialQuantityPopup(false);
                  setIsAnyPopupOpened(false);
                  // setShowModal(false);
                  setSelectedObject(null);
                }}
              />
            </View>
          )}

          {showLoginOrCreateAccountPopup && (
            <LoginOrCreateAccountPopup
              showModal={showLoginOrCreateAccountPopup}
              navigation={navigation}
              setShowPrivacyModal={() => {
                setShowLoginOrCreateAccountPopup(false);
              }}
            />
          )}

          {isOpenCheckoutPopUp && (
            <View style={styles.modalContain}>
              <PopupModal
                heading={"Not available outside Bangkok"}
                content={NotAvailable}
                showPrivacyModal={isOpenCheckoutPopUp}
                contentHeight={230}
                contentStyle={styles.contentStyle}
                setShowPrivacyModal={() => {
                  setIsOpenCheckoutPopUp(false);
                  setIsAnyPopupOpened(false);
                }}
              />
            </View>

          )}

          {isOpenDeliveryPopUp && (
            <DeliveryPopup
              heading={"Delivery fee"}
              showPrivacyModal={isOpenDeliveryPopUp}
              contentHeight={301}
              setShowPrivacyModal={() => {
                setIsOpenDeliveryPopUp(false);
              }}
            />
          )}

        </View>
        {(loginData) &&
          <LinkLINEAccountPopup showPopup={showLINELinkPopup} setShowPopup={setShowLINELinkPopup} loginData={loginData} popupType={'follow_qa'}/>
        }
      </View>
    );
  // Scenario for 1 Meal delivery or 1 Grocery Cart
  } else {
    console.log("Scenario 3 - Only 1 Day of Meals or 1 Day of Groceries");
    return (
      <View style={styles.container}>
        <MarketHeader
          onPressDropDown={() => {
            setShowModal(!showModal);
            //  setIsAnyPopupOpened(true)
            //  setIsOpenQuantitySelectPopUp(true)
          }}
          titleStyle={
            getTimeSlotForDelivery().dateString == "Select delivery time"
              ? styles.titleStyle
              : styles.title
          }
          title={
            getTimeSlotForDelivery().dateString
              ? getTimeSlotForDelivery().dateString
              : " "
          }
        />

        <View style={styles.body}>

          <ScrollView
            decelerationRate={"fast"}
            showsVerticalScrollIndicator={false}
            directionalLockEnabled={true}
            bounces={true}
            scrollEnabled={isScrollEnabled}
          >
            <View style={styles.singleDayWarningsContainer}>
              {(cartData &&  cartData.delivery_date && cartData.delivery_slot_id &&  cartData.lines.length > 0) &&
                renderMinimumOrderWarning()
              }
              {(cartData &&  cartData.delivery_date && cartData.delivery_slot_id &&  cartData.lines.length > 0) &&
                renderWaterWarningDisplay()
              }
              {mealsCartData && mealsCartData.lines.length > 0 &&
                renderMinimumOrderWarningForMeals()
              }
            </View>
            {(cartData || mealsCartData) && renderGroceriesOrSingleDayMealCart()}
            {renderNotAvailable(disabledGroceries)}
            {disabledGroceries.length == 0 ? renderRemoveButton() : null}
            {renderCartTotals()}
            {renderHelp()}
          </ScrollView>

          <Button
            onPress={() => {
              if (loginData) {
                analytics().logEvent('click_checkout');
                navigation.navigate("Checkout", {
                  selectedTimeSlot: getTimeSlotForDelivery(),
                });
              } else {
                setShowLoginOrCreateAccountPopup(true);
              }
            }}
            disabled={validation}
            btnTitle={
              getTimeSlotForDelivery().dateString == "Select delivery time"
                ? "Checkout"
                : "Checkout for " + checkoutDay(getTimeSlotForDelivery().defaultDateForPicker)
            }
            style={[
              styles.checkoutBtn,
              {
                backgroundColor: validation ? greenButtonOpacity : quantityGreen,
              },
            ]}
          />

          <TimeSlot
            heading={"Delivery times"}
            freshMeals={true}
            isSingleDay={false}
            timeSlots={getSlotsForDelivery()}
            cartType={getCartType(cartData, mealsCartData)}
            mealsCartData={mealsCartData}
            cartData={cartData}
            fromCart={false}
            defaultDate={getTimeSlotForDelivery().defaultDateForPicker}
            showModal={showModal}
            selectedSection={getCartType(cartData, mealsCartData)}
            setSelectTimeSlot={(obj) => {
              global.freshMealsTimeSlotNew = obj;
              onchange_time_slot(obj.completeDate, obj.slotId);
            }}
            setShowPrivacyModal={() => {
              setShowModal(false);
            }}
            screen={"CART"}
          />

          {isOpenQuantitySelectPopUp && (
            <QuantityPopup
              heading={"Select time slot"}
              showModal={isOpenQuantitySelectPopUp}
              selectedObject={selectedObject}
              selectedQuantityObject={getSelectedQuantityObj()}
              setSelectQuantity={selectQuantity}
              setShowPrivacyModal={() => {
                setIsOpenQuantitySelectPopUp(false);
                setSelectedObject(null);
              }}
            />
          )}

          {showSpecialQuantityPopup && (
            <View style={styles.modalContain}>
              <SpecialQuantityPopup
                deleteLot={deleteLot}
                addExtraLot={addExtraLot}
                CombinedOrMultipleDaysDelivery={CombinedOrMultipleDaysDelivery()}
                selectedObject={selectedObject}
                showModal={showSpecialQuantityPopup}
                setShowPrivacyModal={() => {
                  setShowSpecialQuantityPopup(false);
                  setIsAnyPopupOpened(false);
                  // setShowModal(false);
                  setSelectedObject(null);
                }}
              />
            </View>
          )}

          {showLoginOrCreateAccountPopup && (
            <LoginOrCreateAccountPopup
              showModal={showLoginOrCreateAccountPopup}
              navigation={navigation}
              setShowPrivacyModal={() => {
                setShowLoginOrCreateAccountPopup(false);
              }}
            />
          )}

          {isOpenCheckoutPopUp && (
            <View style={styles.modalContain}>
              <PopupModal
                heading={"Not available outside Bangkok"}
                content={NotAvailable}
                showPrivacyModal={isOpenCheckoutPopUp}
                contentHeight={230}
                contentStyle={styles.contentStyle}
                setShowPrivacyModal={() => {
                  setIsOpenCheckoutPopUp(false);
                  setIsAnyPopupOpened(false);
                }}
              />
            </View>
          )}

          {isOpenAmountPopUp && (
            <View style={styles.modalContain}>
              <OrderAmountsPopup
                heading={"Minimum delivery amounts"}
                content={NotAvailable}
                showPrivacyModal={isOpenAmountPopUp}
                contentHeight={301}
                setShowPrivacyModal={() => {
                  setIsOpenAmountPopUp(false);
                  setIsAnyPopupOpened(false);
                }}
              />
            </View>
          )}

          {/* Used for adjusting address on the Disabled Items */}
          {(showAddressModalDisabledItems) &&
            <SelectAddress
              heading={'Select address'}
              flow={'cart'}
              deliveryDate={getTimeSlotForDelivery().defaultDateForPicker}
              navigation={navigation}
              fromCart={true}
              cartType={getCartType(cartData, mealsCartData)}
              cartData={cartData}
              addressArray={getShipAddresses(cartData)}
              showAddressModal={showAddressModalDisabledItems}
              setSelectedAddress={(obj) => setSelectedAddress(obj)}
              selectedSection ={'grocery'}
              setShowAddressModal={() => {
                setShowAddressModalDisabledItems(false)
                //  setShowAddressModalConatiner(false)
                //  setIsAnyPopupOpened(false)
              }}
            />
         }

          {isOpenDeliveryPopUp && (
            <DeliveryPopup
              heading={"Delivery fee"}
              showPrivacyModal={isOpenDeliveryPopUp}
              contentHeight={301}
              setShowPrivacyModal={() => {
                setIsOpenDeliveryPopUp(false);
              }}
            />
          )}
        </View>

        {(loginData) &&
          <LinkLINEAccountPopup showPopup={showLINELinkPopup} setShowPopup={setShowLINELinkPopup} loginData={loginData} popupType={'follow_qa'}/>
        }
      </View>
    );
  }
};

export default Cart;