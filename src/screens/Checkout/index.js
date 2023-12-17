import React, { useState, useContext, useEffect, useCallback } from 'react'

import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native'
import { My2c2p } from '../../helpers/my2c2p';

// Paypal
import { requestOneTimePayment, requestDeviceData } from 'react-native-paypal';
import AsyncStorage from "@react-native-async-storage/async-storage";
// Paypal

import { useFocusEffect } from '@react-navigation/native'
import styles from './Styles'
import { appColors, appImages } from '../../theme'
import DeliveryPopup from "../Cart/DeliveryPopup";
import TimeSlot from "../PickupTimeSlot";
import { createDaysArray } from "../PickupTimeSlot";
import Services from '../../services'
import moment from "moment";
const { API } = Services
import VoucherPopup from './VoucherPopup'
import SelectAddress from '../SelectAddress'

import * as momenttz from 'moment-timezone';

import {
  MarketHeader,
  Text,
  Button,
  Input,
  AccountHeader,
} from '../../components/'

const {
  textDarkGray,
  darkGray,
  lightGreen,
  black,
  lessDarkGray,
  green,
  accountSettingGray,
  addressGrey,
  darkGrey,
  sharpGreen,
  orGrey,
  greenButtonOpacity,
  quantityGreen,
  orderDarkGray,
  placeHolderGrey,
  darkBlue,
  sharpRed,
  redProgress,
} = appColors

import AppContext from '../../provider'
import helpers, { AppsFyler } from "../../helpers";
import { ChatUs } from '../../components/ChatUs';
import { useAnimatedRef } from 'react-native-reanimated';
// Clear whatever is not used from the helpers
const {
  exist_min_each_day,
  get_thumbnail,
  number_format,
  convertDeliveryDateToDisplayDate,
  getCartType,
  getDefaultDateForFreshMeals,
  getDisabledItems,
  checkForTodayTomorrow,
  groupBy2,
  formatCreditCardNumber,
  check_exist_only_water,
  exist_min_each_day_no_combined,
  
} = helpers;

const {
  small_chat_ic,
  clock_ic,
  question_ic,
  right_arrow,
  red_location_ic,
  wallet_red_ic,
  dotted_line,
  forgot_reset,
  caveman_error,
  instore_ic,
  circle_animation,
  master_card_ic,
  visa_ic,
  express_ic,
  paypal_logo,
  small_qrcode_ic,
} = appImages

const {
  MIN_DELIVERY_ORDER_AMOUNT,
} = appConstants;

const Checkout = (props) => {
  const { navigation, route } = props
  const [showModal, setShowModal] = useState(false)
  const [isOpenCheckoutPopUp, setIsOpenCheckoutPopUp] = useState(false)
  const [isOpenAmountPopUp, setIsOpenAmountPopUp] = useState(false)
  const [isOpenVoucherPopUp, setIsOpenVoucherPopUp] = useState(false)
  const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0))
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [isOpenDeliveryPopUp, setIsOpenDeliveryPopUp] = useState(false);

  const [
    isVoucherNotificationShowing,
    setVoucherNotificationShowing,
  ] = useState(false)

  // Brought over from the cart
  const [selectedObject, setSelectedObject] = useState(null);
  const [addressArray, setAddressArray] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [mealsCartItems, setMealsCartItems] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const {
    // General
    setIsAnyPopupOpened,
    setIsAnyApiLoading,
    loginData,
    setIsApiLoaderShowing,  // Is this really necessary as we already have setIsAnyApiLoading above

    // Payment related - To Review,
    setIsPaymentProcessing,
    isPaymentProcessing,

    // Cart Related Context
    // Grocery Cart
    cartData,
    updateCartId,
    setCartData,
    // Meal Cart
    mealsCartData,
    setMealsCartData,
    // General Cart
    refVoucher,

    setLoginData,

  } = useContext(AppContext)

  const { accountInfo, token, user_id } = loginData;
  const { receivable_credit } = accountInfo.contact_id;
  // console.log("loginData---Checkout", loginData);
  console.log("Checkout Screen Loaded");

  const backPress = () => {
    navigation.goBack()
  }

  const animatedRef = useAnimatedRef();
  const disabledMeals = getDisabledItems(mealsCartData, "meals").disabledItems;
  const disabledGroceries = getDisabledItems(cartData, "grocery").disabledItems;

  // This now also loads whatever carts we have when the first is first focused
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        console.log('accountInfo',accountInfo.contact_id.id);
        console.log('Current Carts',global.cartId,global.mealsCartId);
        await API.check_latest_carts(accountInfo.contact_id.id, setCartData, updateCartId, setMealsCartData, 'all', { token, user_id }, 'grocery_cart_checkout_load');

        // Auto applying the refferal voucher if it exists and it's not already applied
        if (refVoucher) {

          const cartType = getCartType(cartData, mealsCartData);

          var voucher = null;

          if (cartType=='combined') {
            var meal_cart_id= parseInt(global.mealsCartId);
            var grocery_cart_id= parseInt(global.cartId);
            var carts = [grocery_cart_id,meal_cart_id]
            // Check that it wasn't already applied
            if (mealsCartData.voucher_id) {
              voucher = mealsCartData.voucher_id;
            } else if (cartData.voucher_id){
              voucher = cartData.voucher_id;
            }

          } else if (cartType=='grocery') {
            var cart_id= parseInt(global.cartId);
            var carts = [cart_id]
            // Check that it wasn't already applied
            voucher = cartData.voucher_id;

          } else if (cartType=='meal') {
            var cart_id= parseInt(global.mealsCartId);
            var carts = [cart_id]
            // Check that it wasn't already applied
            voucher = mealsCartData.voucher_id;
          }

          if (voucher == null) {
            var voucher_code = refVoucher;
            console.log('voucher_code',voucher_code);
            await API.execute("ecom2.cart","apply_voucher_code_check", [carts,voucher_code],{}, setIsAnyApiLoading,{token, user_id}).then((data) => {

              // console.log('voucher answer',data, data.message);

              if (data) {
                if (data.message) {
                  alert(data.message);
                }
              } else {

                if (cartType === "grocery") {
                  API.grocery_cart_load(
                    global.cartId,
                    setCartData,
                    () => {},
                    'normal',
                   {token, user_id},
                   'apply_voucher'
                  );
                }

                if (cartType === "combined" || cartType === "meal") {
                  API.combined_cart_load(
                    global.mealsCartId,
                    global.cartId,
                    setMealsCartData,
                    setCartData,
                    'normal',
                    'apply_voucher'
                  );
                }
                // setShowPrivacyModal(voucher_code)
              }

            }).catch((err) => {
              alert(err)
            })
          }
        }

        // Added for checking if the users receivable credit has changed
        if (loginData) {
          var users_receivabile_credit = await getUsersReceivableCredit();
          if (users_receivabile_credit && users_receivabile_credit[0]) {
            console.log('Credits comparison',users_receivabile_credit[0].contact_id.receivable_credit,receivable_credit)
            if (users_receivabile_credit[0].contact_id.receivable_credit != receivable_credit) {
              await getUserData();
            } else {
              console.log('User credit has not changed');
            }
          }
        }

      }
      fetchData();
    }, [])
  );

  const getUsersReceivableCredit = async () => {
    if (loginData) {
      var res = await API.execute(
        "base.user",
        "read_path",
        [
          [
            user_id,
          ],
          [
            "contact_id.receivable_credit",
          ],
        ],
        {},
        setIsApiLoaderShowing,
        { token, user_id }
      );
      if (res.length >0) {
        console.log('Receivable Credit',res);
        return res;
      }
    } else {
      console.log('Not logged in. No Receivable Credit check.')
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

  useFocusEffect(
    useCallback(() => {

      console.log('Use Focus Effect CHECKOUT 2');

      const cartType = getCartType(cartData, mealsCartData);

      if (cartType === "combined"){
        returnSectionData();
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

  useEffect(() => {

    console.log('Use Effect CHECKOUT 4');

    if (isVoucherNotificationShowing && animatedRef.current) {
      Animated.delay(1500),
        animatedRef.current
          .getNode()
          .measure((x, y, width, height, pageX, pageY) => {
            Animated.sequence([
              Animated.parallel([
                Animated.timing(opacity, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true,
                }),
              ]),

              Animated.delay(3000),
              Animated.parallel([
                Animated.timing(opacity, {
                  toValue: 0,
                  duration: 500,
                  useNativeDriver: true,
                }),
              ]),
            ]).start(() => setVoucherNotificationShowing(false))
          })
      //Animated.delay(3000)
    }
  }, [isVoucherNotificationShowing])

  useFocusEffect(
    useCallback(() => {
      if (disabledGroceries.length >0) {
        navigation.navigate('Cart')
      }
    }, [cartData, mealsCartData]),
  )

  useFocusEffect(
    useCallback(() => {
      AppsFyler.logEvent('reached_checkout', {

      });
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      AppsFyler.logEvent('reached_checkout', {

      });
    }, [])
  );

  // Brought over from the Cart screen for sorting ou the data
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

  const isSingleMealDayDelivery = () => {

    var isSingleDay = false;

    // Or if there is a simple meals cart
    if (cartType === "meal") {
      const data = groupBy2(mealsCartData.lines, "delivery_date");
      if (Object.keys(data).length == 1) {
        isSingleDay = true;
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

  const getTimeSlotForDelivery = () => {

    // const { tomorrow } = getDefaultDateForFreshMeals();
    let dateString = ""; // For Display
    let defaultDateForPicker = ""; // For TimeSlot Picker

    // Actual format required for date on this screen - Confirm with Jon if he wants this modified
    // {selectTimeSlot.day + ', June 18th, ' + 'between ' + selectTimeSlot.time}

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
            // console.log('DateString 2', dateString, mealsCartData.lines[0].delivery_date, mealsCartData.lines[0].delivery_slot_id)
          }
        }
      } else {
        // Never Execuuted
        if (dataArray.length > 0 && dataArray[selectedSection]) {
          defaultDateForPicker = dataArray[selectedSection].deliveryDate;
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

    return {
      dateString,
      defaultDateForPicker
    };

  };

  const onchange_time_slot = (date, slotId) => {

     console.log('Normal Scenario');
      var slot_id = parseInt(slotId);
      var vals = {
        delivery_date: date,
        delivery_slot_id: slot_id,
      };

      if (isSingleDayDelivery() == true) {

        oldDate = mealsCartData.lines[0].delivery_date;

        console.log('isSingleDayDelivery');
        API.meal_cart_update_delivery(
          oldDate,
          vals,
          setMealsCartData,
          setCartData,
          { token, user_id },
          cartType,
          'no',
          'meal_cart_update_delivery_slot_checkout'
        );

        API.grocery_cart_write(
          vals,
          setMealsCartData,
          setCartData,
          cartType,
          'yes',
          { token, user_id },
          'grocery_slot_change_checkout'
        );
      } else {

        const oldDate = cartItems.length > 0 ? cartData.delivery_date : mealsCartItems[0].delivery_date;

        const cartType = cartItems.length > 0 ? "grocery" : "meal";
        if (cartType == "meal") {
          API.meal_cart_update_delivery(
            oldDate,
            vals,
            setMealsCartData,
            setCartData,
            { token, user_id },
            cartType,
            'yes',
            'meal_cart_update_delivery_slot_checkout'
          );
        } else {
          API.grocery_cart_write(
            vals,
            setMealsCartData,
            setCartData,
            cartType,
            'yes',
            { token, user_id },
            'grocery_slot_change_checkout'
          );
        }

      }

  };

  // GET SLOTS FUNCTIONS
  const getSlotsForDelivery = () => {

    var cartType = getCartType(cartData, mealsCartData);
    let res = [];
    const dateFormat = "DD,ddd,dddd,MM,MMMM,ddd,Do";
    var data = [];

    if ((cartType == 'grocery') || (cartType == null)) {
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

  // Multiple Deliveries
  const isTogetherDateExit = (listDta, section) => {
    let exist = false;
    let mealsTogather = false;
    let groceryTogather = false;
    let anyDeliveryTogather = false;
    let combinedDate = "";
    let combineAddress = "";
    if (
      section.type == "meal" &&
      section.disabled &&
      cartData &&
      cartData.lines.length > 0
    ) {
      for (let index = 0; index < section.data.length; index++) {
        if (
          section.data[0].delivery_date &&
          cartData.delivery_date == section.data[0].delivery_date
        ) {
          mealsTogather = true;
          exist = true;
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
            groceryTogather = true;
            exist = true;

            combinedDate = convertDeliveryDateToDisplayDate(listDta[index].data[0].delivery_date, listDta[index].data[0].delivery_slot_id.name);

            combineAddress = listDta[index].data[0].ship_address_id.address;

            break;
          }
        }
      }
    }

    anyDeliveryTogather = groceryTogather || mealsTogather;

    return {
      togetherDateExist: exist,
      anyDeliveryTogather,
      combinedDate,
      combineAddress,
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

    // Multple Deliveries
  const setSelectedAddress = (obj) => {
    if (obj.delivery_date) {
      setMealsAddress(obj.id, obj.delivery_date);
    } else {
      SetGroceryAddress(obj.id);
    }
    if (isSingleDayDelivery() == true) {
      setMealsAddress(obj.id, mealsCartData.lines[0].delivery_date);
    }
  };

  // Multiple Deliveries
  const setMealsAddress = (addr_id, date) => {
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
      'meal_cart_update_delivery_address_checkout'
    );
  };

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
      'grocery_slot_and_address_change_checkout'
    );
  };

  // Finished brining in functions from Cart Above

  // Updating Order Comment
  const setOrderComment = (text) => {
    var vals ={
      comments : text,
    }
    const cartType = getCartType(cartData, mealsCartData);
    var selected_address = 'Select address';
    if (cartType == 'mealplan') {
      API.meal_cart_write(
        vals,
        setMealsCartData,
        setCartData,
        cartType,
        'no',
        { token, user_id },
        'change_comment'
      );
    } else {
      API.grocery_cart_write(
        vals,
        setMealsCartData,
        setCartData,
        cartType,
        'yes',
        { token, user_id },
        'change_comment'
      );
    }
  }

  // Render Delivery Time for 1 Delivery Address
  const renderTimings = () => {
    return (
      <View style={styles.firstpadding}>
        <Text
          style={styles.smallHeading}
          color={orderDarkGray}
          lineHeight={18.5}
          smallRegular
        >
          Delivery time
        </Text>
        <TouchableOpacity
          style={[styles.timeContainer]}
          onPress={() => {
            setShowModal(true)
            //  setIsAnyPopupOpened(true)
          }}
        >
          <View style={styles.timeRow}>
            <Image source={clock_ic} style={[
              styles.clockImg,
              { tintColor: (getTimeSlotForDelivery().dateString && getTimeSlotForDelivery().dateString!=='Select delivery time') ? green : darkGrey },
            ]}/>
            {(getTimeSlotForDelivery().dateString && getTimeSlotForDelivery().dateString!=='Select delivery time') ? (
              <Text textAlign="center" smallRegular color={accountSettingGray}>
                {getTimeSlotForDelivery().dateString}
              </Text>
            ) : (
              <Text color={darkGrey} smallRegular>
                Please select a delivery date
              </Text>
            )}
          </View>
          <Image source={right_arrow} style={styles.arrowImg} />
        </TouchableOpacity>
      </View>
    )
  }

  // Rendering a single address
  const renderAddress = () => {

    const cartType = getCartType(cartData, mealsCartData);
    var comments = '';
    var selected_address = 'Select address';
    if (cartType == 'grocery') {
      if (cartData && cartData.ship_address_id) {
        selected_address = cartData.ship_address_id.address;
      }
      comments = cartData.comments;
    }

    if (cartType == 'meal' || cartType == 'combined') {
      if (mealsCartData && mealsCartData.lines[0].ship_address_id) {
        selected_address = mealsCartData.lines[0].ship_address_id.address;
      }
      comments = mealsCartData.comments;
    }

    // To do (also load combined cart comments from MealsCartData

    return (
      <View style={styles.padding}>
        <Text
          style={styles.smallHeading}
          color={orderDarkGray}
          lineHeight={18.5}
          smallRegular
        >
          Delivery address
        </Text>
        <TouchableOpacity
          style={[styles.addressContainer]}
          onPress={() => {
            setShowAddressModal(true)
            //  setIsAnyPopupOpened(true)
            // setShowAddressModalConatiner(true)
          }}
        >
          <View style={styles.timeRow}>
            <Image
              source={red_location_ic}
              style={[
                styles.locationImg,
                { tintColor: (selected_address !== 'Select address') ? green : darkGrey },
              ]}
            />

            {(selected_address !== 'Select address') ? (
              <Text smallRegular color={accountSettingGray} noOfLines={2} style={styles.flexText}>
                {selected_address}
              </Text>
            ) : (
              <Text color={darkGrey} smallRegular>
                Select address
              </Text>
            )}
          </View>

          <Image source={right_arrow} style={styles.arrowImg} />
        </TouchableOpacity>

        <Input
          placeholderTextColor={placeHolderGrey}
          placeholder={'Any extra details? E.g. leave at building lobby'}
          onEndEditing={e => setOrderComment(e.nativeEvent.text)}
          defaultValue={comments}
          inputViewStyle={styles.InputView}
          inputStyle={styles.Input}
          multiline={true}
        />
      </View>
    )
  }

  // I think it's used for the multi day delivery scenario with different addressess and slots
  // currently seems to work with dummy data
  const renderAddresses = () => {

    // console.log('dataArray',dataArray);

    for (let index = 0; index < dataArray.length; index++) {
      console.log('dataArray[index].type',dataArray[index].type);
      if ((dataArray[index].type = "meal")) {
        if (dataArray[index].deliveryDate == cartData.delivery_date) {
          // console.log('dataArray[index].deliveryDate cartData.delivery_date',dataArray[index].deliveryDate,cartData.delivery_date);
          // console.log('dataArray[index].data[0].ship_address_id.id',dataArray[index].data[0].ship_address_id.name);
        }
      }
    }

    // console.log('Second one ----------------------------------------------');

    // console.log('dataArray.length',dataArray.length);

    var DeliveryList = [];

    for (let index = 0; index < dataArray.length; index++) {
      // console.log('index',index);
      // console.log('dataArray[index].type',dataArray[index].type);
      // console.log('dataArray[index].deliveryDate',dataArray[index].deliveryDate);
      // console.log('dataArray[index].time',dataArray[index].time);
      // console.log('dataArray[index].selectedAddress',dataArray[index].selectedAddress);

      var DeliveryListVals = {
        day: moment(dataArray[index].deliveryDate).format("ddd"),
        date: moment(dataArray[index].deliveryDate).format("D") + ' '+moment(dataArray[index].deliveryDate).format("MMMM"),
        time: dataArray[index].time,
        address: dataArray[index].selectedAddress
      };
      // console.log('DeliveryListVals',DeliveryListVals);

      DeliveryList.push(DeliveryListVals);
    }

    console.log('DeliveryList',DeliveryList);

    return (
      <View style={styles.flex}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {DeliveryList.map((obj, i) => {
            return (
              <View style={styles.addressCell} key={i}>
                <View style={styles.lineDottedRow}>
                  <View style={styles.dayCell}>
                    <Text color={accountSettingGray} smallRegular>
                      {obj.day}
                    </Text>
                  </View>
                  {DeliveryList.length !== i + 1 && (
                    <ImageBackground
                      source={dotted_line}
                      style={styles.dottedLine}
                    />
                  )}
                  {DeliveryList.length !== i + 1 && (
                    <View style={styles.arrowContainer}>
                      <Image
                        source={right_arrow}
                        style={styles.absoluteArrowImg}
                      />
                    </View>
                  )}
                </View>
                <View>
                  <Text
                    color={accountSettingGray}
                    minSmall
                    lineHeight={14}
                    style={styles.dateText}
                  >
                    {obj.date}
                  </Text>
                  <Text minSmall lineHeight={14} color={addressGrey}>
                    {obj.time}
                  </Text>
                  <Text
                    color={accountSettingGray}
                    tiny
                    lineHeight={14}
                    style={styles.topDistance}
                  >
                    {obj.address}
                  </Text>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  // I think it's used for the multi day delivery scenario with different addressess and slots
  // currently seems to work with dummy data
  const renderMultipleAddresses = () => {

     var comments = '';

    return (
      <View style={styles.multiContainer}>
        <View style={styles.changeAdress}>
          <View style={styles.questionRow}>
            <Text
              smallRegular
              color={orGrey}
              lineHeight={18.53}
              style={styles.margin}
            >
              Delivery times & addresses
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Cart')
            }}
          >
            <Text smallRegular color={green}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.multiAddressContainer]}>
          <View style={styles.multiAddRow}>
            <Image source={clock_ic} style={styles.clockTopImg} />
            {renderAddresses()}
          </View>
        </View>

        <Input
          placeholderTextColor={placeHolderGrey}
          placeholder={'Any extra details? E.g. leave at second floor'}
          onChangeText={(text) => setOrderComment(text)}
          value={comments}
          inputViewStyle={styles.InputView}
          inputStyle={styles.Input}
          multiline={true}
        />
      </View>
    )
  }

  const getAmounts = () => {
    const cartType = getCartType(cartData, mealsCartData);
    if (cartType === "grocery") {
      return {
        subTotal: cartData.amount_items,
        amountVoucher: cartData.amount_voucher,
        subTotalwithVoucher: cartData.amount_subtotal,
        vat: cartData.amount_tax,
        delivery: cartData.amount_ship,
        total: cartData.amount_total,
        store_credit: cartData.amount_credit,
        amount_to_pay: cartData.amount_pay,
      };
    }
    if (cartType === "meal") {
      return {
        subTotal: mealsCartData.amount_items,
        amountVoucher: mealsCartData.amount_voucher,
        subTotalwithVoucher: mealsCartData.amount_subtotal,
        vat: mealsCartData.amount_tax,
        delivery: mealsCartData.amount_ship,
        total: mealsCartData.amount_total,
        store_credit: mealsCartData.amount_credit,
        amount_to_pay: mealsCartData.amount_pay,
      };
    }
    if (cartType === "combined") {
      return {
        subTotal: cartData.amount_items + mealsCartData.amount_items,
        amountVoucher: mealsCartData.amount_voucher_combined, // +  + cartData.amount_voucher_combined ... add this or not
        subTotalwithVoucher: cartData.amount_subtotal + mealsCartData.amount_subtotal,
        vat: cartData.amount_tax + mealsCartData.amount_tax,
        delivery: cartData.amount_ship_combined,
        total: mealsCartData.amount_total_combined,
        store_credit: mealsCartData.amount_credit_combined,
        amount_to_pay: mealsCartData.amount_total_combined - mealsCartData.amount_credit_combined,
      };
    }
    return {};
  };

  const { subTotal, amountVoucher, subTotalwithVoucher, vat, delivery, total, store_credit, amount_to_pay } = getAmounts();

  const renderCartTotals = () => {

    var voucher = null;
    var voucher_error_message = null;
    const cartType = getCartType(cartData, mealsCartData);
    if (cartType === "combined") {
      if (mealsCartData.voucher_id) {
        voucher = mealsCartData.voucher_id;
      } else if (cartData.voucher_id){
        voucher = cartData.voucher_id;
      }
      if (mealsCartData.voucher_error_message_combined) {
        voucher_error_message = mealsCartData.voucher_error_message_combined;
      }
      var amount_voucher = mealsCartData.amount_voucher_combined + cartData.amount_voucher_combined;
    }
    if (cartType === "grocery") {
      voucher = cartData.voucher_id;
      voucher_error_message = cartData.voucher_error_message;
      var amount_voucher = cartData.amount_voucher;
    }

    if (cartType === "meal") {
      voucher = mealsCartData.voucher_id;
      voucher_error_message = mealsCartData.voucher_error_message;
      var amount_voucher = mealsCartData.amount_voucher;
    }

    return (
     <View style={styles.cartMainContainer}>
        {isVoucherNotificationShowing && (
          <Animated.View
            ref={animatedRef}
            style={[
              styles.greenNotify,
              {
                opacity: opacity,
              },
            ]}
          >
            <Text color={quantityGreen}>Voucher successfully added </Text>
          </Animated.View>
        )}

        {voucher && (
          <View style={styles.voucherCode}>
            <Text extSmall color={textDarkGray}>
              Voucher code{' '}
            </Text>
            <View style={styles.vocherInner}>
              <Text extSmall lineHeight={17.21} color={darkGray}>
                {voucher.code} {' '}
              </Text>
              {(voucher_error_message) ?
                (
                  <Text
                    minSmall
                    lineHeight={15}
                    color={sharpRed}
                    style={styles.voucherMargin}
                  >
                    {voucher_error_message}{' '}
                  </Text>
                )
                :
                (
                  <Text
                    minSmall
                    lineHeight={15}
                    color={textDarkGray}
                    style={styles.voucherMargin}
                  >
                    {voucher.description}{' '}
                  </Text>
                )
              }

            </View>
          </View>
        )}

        <View style={styles.cartContainer}>
          <View style={styles.furstCartTextRow}>
            <Text lighHeight={17.2} extSmall color={textDarkGray} style={styles.cartTextRowLabel}>
              Subtotal
            </Text>
            <Text color={textDarkGray} extSmall condensed>
              ฿{number_format(subTotal, "0,0")}
            </Text>
          </View>

           <View style={styles.cartTextRow}>
            <View style={[styles.questionRow, styles.cartTextRowLabel]}>
              <Text lighHeight={17.2} color={textDarkGray} extSmall>
                VAT
              </Text>
            </View>
            <Text condensed color={textDarkGray} extSmall>
              ฿{number_format(vat, "0,0")}
            </Text>
          </View>

          <View style={styles.cartTextRow}>
            <View style={[styles.questionRow, styles.cartTextRowLabel]}>
              <Text lighHeight={17.2} color={textDarkGray} extSmall>
                Delivery
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsOpenDeliveryPopUp(true);
                  setIsAnyPopupOpened(true);
                }}
              >
                <Image source={question_ic} style={styles.delivertQuestionImg} />
              </TouchableOpacity>
            </View>
            <Text condensed color={textDarkGray} extSmall>
              ฿{number_format(delivery, "0,0")}
            </Text>
          </View>
          {(amountVoucher>0) &&
            <View style={styles.cartTextRow}>
              <Text lighHeight={17.2} color={textDarkGray} extSmall style={styles.cartTextRowLabel}>
                Voucher
              </Text>
              <Text extSmall condensed color={textDarkGray}>
                -฿{number_format(amountVoucher, "0,0")}
              </Text>
            </View>
          }

          {/*
          <View style={styles.cartTextRow}>
            <Text color={darkGray} extSmall lighHeight={17.2}>
              Subtotal
            </Text>
            <Text condensed color={darkGray} extSmall>
              ฿{number_format(subTotalwithVoucher, "0,0")}
            </Text>
          </View>

          <View style={styles.cartTextRow}>
            <Text color={darkGray} extSmall lighHeight={17.2}>
              Total{' '}
            </Text>
            <Text condensed color={darkGray} extSmall>
              ฿{number_format(total, "0,0")}
            </Text>
          </View>
          */}

          {(store_credit>0) &&
            <View style={styles.cartTextRow}>
              <Text color={textDarkGray} lighHeight={17.2} extSmall style={styles.cartTextRowLabel}>
                Store credit applied
              </Text>
              <Text condensed color={textDarkGray} extSmall>
                -฿{number_format(store_credit, "0,0")}
              </Text>
            </View>
          }

          <View style={styles.cartTextRow}>
            <Text color={darkGray} bold extSmall style={styles.cartTextRowLabel}>
              Amount to pay:
            </Text>
            <Text condensedBold color={darkGray} extSmall>
              ฿{number_format(amount_to_pay, "0,0")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const removeVoucherCode = async () => {

   const cartType = getCartType(cartData, mealsCartData);

   if (cartType=='combined') {
      var meal_cart_id= parseInt(global.mealsCartId);
      var grocery_cart_id= parseInt(global.cartId);
      var carts = [grocery_cart_id,meal_cart_id]
    } else if (cartType=='grocery') {
      var cart_id= parseInt(global.cartId);
      var carts = [cart_id]
    } else if (cartType=='meal') {
      var cart_id= parseInt(global.mealsCartId);
      var carts = [cart_id]
    }

    await API.execute("ecom2.cart","clear_voucher", [carts],{}, setIsAnyApiLoading,{token, user_id}).then((data) => {

      console.log('voucher answer',data);

      if (data) {
        if (data.message) {
          setVoucherError(data.message);
        }
      } else {

        if (cartType === "grocery") {
          API.grocery_cart_load(
            global.cartId,
            setCartData,
            () => {},
            'normal',
            {token, user_id},
            'apply_voucher'
          );
        }

        if (cartType === "combined" || cartType === "meal") {
          API.combined_cart_load(
            global.mealsCartId,
            global.cartId,
            setMealsCartData,
            setCartData,
            'normal',
            'apply_voucher'
          );
        }

      }

    }).catch((err) => {
      alert(err)
    })
  }

  const getPaymentMethod = () => {
    var payment_method = null;
    const cartType = getCartType(cartData, mealsCartData);
    if (cartType == 'grocery') {
      payment_method = cartData.pay_method_id;
    } else if (cartType == 'meal' || cartType == 'combined') {
      payment_method = mealsCartData.pay_method_id;
    }
    return payment_method;
  }

  const getCardToken = () => {
    var card_token = null;
    const cartType = getCartType(cartData, mealsCartData);
    if (cartType == 'grocery') {
      card_token = cartData.card_token_id
    } else if (cartType == 'meal' || cartType == 'combined') {
      card_token = mealsCartData.card_token_id;
    }
    return card_token;
  }

  // PAYMENT METHODS
  // Cart Details at the bottom of the screen
  const renderCartDetails = () => {

    const imageStyles = [{ ...styles.cardImg }]

    const cartType = getCartType(cartData, mealsCartData);

    var payment_method = getPaymentMethod();
    var card_token_id = getCardToken();
    // console.log('payment_method',payment_method);

    // For refference, payment method ids from the database
    // payment_method == 15 QR
    // payment_method == 17 Paypal
    // payment_method == 8 2c2p
    // payment_method == 12 Paleo Credit

    var payment_method_title = '';
    var payment_method_image = '';
    var payment_method_code = '';

    if (payment_method!== null) {
      if (payment_method == 12) {
        imageStyles.push(styles.crediWllateImgThird)
      } else {
        imageStyles.push(styles.crediWllateImg)
      }
      if (payment_method == 15) {
        var payment_method_title = 'Thai QR code';
        var payment_method_image = small_qrcode_ic;
        var payment_method_code = '';
      } else  if (payment_method == 17) {
        var payment_method_title = 'Paypal';
        var payment_method_image = paypal_logo;
        var payment_method_code = '';
      } else  if (payment_method == 8) {
        if (card_token_id) {
          if (card_token_id.mask_card) {
            var first_card_number = card_token_id.mask_card.charAt(0);
            var card_type = '';
            var card_image = '';
            if (first_card_number == 4 ) {
              card_type = 'Visa';
              card_image = visa_ic;
            } else if (first_card_number == 5 ) {
              card_type = 'Mastercard';
              card_image = master_card_ic;
            }

            var payment_method_title = formatCreditCardNumber(card_token_id.mask_card); // This is just a sample, need card details from NF Credit / debit card
            var payment_method_image = card_image; // can also be visa_ic depending on the card type which we need to get from the cart
            var payment_method_code = ''; // last 4 digits
          }
        //User might have set up the payment method on the web and doesn't have a saved card to his cart
        } else {
          var payment_method_title = '';
          var payment_method_image = '';
          var payment_method_code = '';
          payment_method = null;
        }
        /*
        var payment_method_title = '5577 55 ** **** 2912'; // This is just a sample, need card details from NF Credit / debit card
        var payment_method_image = master_card_ic; // can also be visa_ic depending on the card type which we need to get from the cart
        var payment_method_code = '2912'; // last 4 digits
        */
      } else  if (payment_method == 12) {
        var payment_method_title = 'Paleo Credit';
        var payment_method_image = instore_ic;
        var payment_method_code = '';
      }
    }

    var voucher = null;
    // Voucher details
    if (cartType === "combined") {
      if (mealsCartData.voucher_id) {
        voucher = mealsCartData.voucher_id;
      } else if (cartData.voucher_id){
        voucher = cartData.voucher_id;
      }
      var voucher_error_message = null;
      if (mealsCartData.voucher_error_message_combined) {
        var voucher_error_message = mealsCartData.voucher_error_message_combined;
      }
      var amount_voucher = mealsCartData.amount_voucher_combined + cartData.amount_voucher_combined;
    }
    if (cartType === "grocery") {
      var voucher = cartData.voucher_id;
      var voucher_error_message = cartData.voucher_error_message;
      var amount_voucher = cartData.amount_voucher;
    }

    if (cartType === "meal") {
      var voucher = mealsCartData.voucher_id;
      var voucher_error_message = mealsCartData.voucher_error_message;
      var amount_voucher = mealsCartData.amount_voucher;
    }

    console.log('payment_method',payment_method,cartType);

    /*
    receivable_credit

    if(cartData.credit_remain > cartData.amount_total){
        redirect_to = 'success';
      } else {
        redirect_to = 'payment';
      }
    } else if (cartType == 'meal') {
      if(mealsCartData.credit_remain > mealsCartData.amount_total){
        redirect_to = 'success';
      } else {
        redirect_to = 'payment';
      }
      global.freshMealsTimeSlotNew = null;
    } else if (cartType == 'combined') {
      if ((mealsCartData.amount_total_combined -  mealsCartData.amount_credit_combined)<= 0) {
        redirect_to = 'success';
      } else {
        redirect_to = 'payment';
      }
    }
    */

    var isExtraPaymentOpen = false;
    if (receivable_credit) {
      if (receivable_credit > total) {
        isExtraPaymentOpen = false;
      } else {
        isExtraPaymentOpen = true;
      }
    }

    console.log('total checks',receivable_credit, store_credit, total, isExtraPaymentOpen)

    return (
      <View style={styles.padding}>
        <View style={styles.changeAdress}>
          <View style={styles.questionRow}>
            <Text
              smallRegular
              color={orGrey}
              lineHeight={18.53}
              style={styles.margin}
            >
              Payment method
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (voucher) {
                removeVoucherCode();
                setIsAnyPopupOpened(false)
              } else {
                setIsOpenVoucherPopUp(true)
                setIsAnyPopupOpened(true)
              }
            }}
          >
            <Text smallRegular color={green}>
              {voucher ? 'Remove voucher ' : 'Add voucher code'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payments */}
        {/* Normal Payment methods or No Payment Method*/}
        {(receivable_credit == null || receivable_credit==0) &&
          <TouchableOpacity
            style={[styles.paymentRow]}
            onPress={() => {
              navigation.navigate('PaymentMethods', { flow:'cartCheckout' })
            }}
          >
            <View style={styles.timeRow}>
              {(payment_method!= null) ?
                (
                  <>
                    <Image
                      source={payment_method_image}
                      style={[imageStyles]}
                    />
                    <View style={{ marginTop: payment_method == 17 ? -3 : 0, }}>
                      <Text color={accountSettingGray} smallRegular>
                        {payment_method_title + ' ' +  payment_method_code}
                      </Text>
                    </View>
                  </>
                )
                :
                (
                  <>
                    <View style={styles.timeRow}>
                      <Image source={wallet_red_ic} style={styles.cardImg} />
                      <Text color={darkGrey} smallRegular>
                        Select payment method
                      </Text>
                    </View>
                  </>
                )
              }
            </View>
            <Image source={right_arrow} style={styles.arrowImg} />
          </TouchableOpacity>
        }

        {/* Add credit methods - REVIEW THIS LATER as it doesn't seem right */}
        {(receivable_credit != null && receivable_credit>0) &&
          <View>
            <TouchableOpacity
              style={[styles.paymentRow]}
              onPress={() => {
                navigation.navigate('StoreCreditPackages', {flow:'cartCheckoutAddCredit' })
              }}
            >
              <View style={styles.timeRow}>
                <Image source={instore_ic} style={[imageStyles]} />

                <View
                  style={{
                    marginTop: 0,
                  }}
                >
                  <View>
                    <Text color={accountSettingGray} smallRegular>
                      {'Paleo Credit'}
                    </Text>
                    <Text color={addressGrey} small>
                      Current balance:
                      <Text color={addressGrey} condensed small>
                        {' '}
                        ฿
                      </Text>
                      {number_format(receivable_credit, "0,0")}
                    </Text>
                  </View>
                </View>
              </View>

              {isExtraPaymentOpen &&
                <View style={styles.addCreditRow}>
                  <Button
                    style={styles.creditBtn}
                    small
                    btnTitle={'Add credit'}
                    textStyle={styles.textBtnStyle}
                    onPress={() => {
                      navigation.navigate('StoreCreditPackages', {flow:'cartCheckoutAddCredit' })
                    }}
                  />
                  <Text color={accountSettingGray} condensed smallRegular>
                    ฿{number_format(store_credit, "0,0")}
                  </Text>
                </View>
              }

            </TouchableOpacity>

            {isExtraPaymentOpen &&
              <TouchableOpacity
                style={[styles.paymentRow]}
                onPress={() => {
                  navigation.navigate('PaymentMethods', { flow:'cartCheckout' })
                }}
              >
                <View style={styles.timeRow}>
                  {payment_method != null ? (
                    <>
                      <Image
                        source={payment_method_image}
                        style={[imageStyles]}
                      />
                      <View style={{ marginTop: payment_method == 17 ? -3 : 0, }}>
                        <Text color={accountSettingGray} smallRegular>
                          {payment_method_title + ' ' +  payment_method_code}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <Image source={wallet_red_ic} style={styles.cardImg} />
                      <Text color={darkGrey} smallRegular>
                        Select payment method
                      </Text>
                    </>
                  )}
                </View>

                <Text color={accountSettingGray} condensed smallRegular>
                  ฿{number_format(amount_to_pay, "0,0")}
                </Text>
              </TouchableOpacity>
            }
          </View>
        }

        {renderCartTotals()}
      </View>
    )
  }

  // PAYMENT METHODS END
  const renderHelp = () => {
    return (
      <ChatUs></ChatUs>
    )
  }

  // Crate SO
  const CreateSO = async () => {

    setIsPaymentProcessing(true);

    const cartType = getCartType(cartData, mealsCartData);

    const final_amount_to_pay = amount_to_pay;

    var payment_method = null;
    if (cartType == 'grocery') {
      payment_method = cartData.pay_method_id;
    } else if (cartType == 'meal' || cartType == 'combined') {
      payment_method = mealsCartData.pay_method_id;
    }

    var card_token_id = getCardToken();
    console.log('payment_method',payment_method,cartType);

    var plan_id = null;
    var redirect_to = 'success';

    // In order to only create SO's with QR for testing
    if ((payment_method == 15) || (payment_method == 8) || (payment_method == 17)  || (parseInt(final_amount_to_pay) == 0) || (parseInt(final_amount_to_pay) < 0) ) {

      if (cartType=='combined') {
        var meal_cart_id= parseInt(global.mealsCartId);
        var grocery_cart_id= parseInt(global.cartId);
        var carts = [grocery_cart_id,meal_cart_id]
      } else if (cartType=='grocery') {
        var cart_id= parseInt(global.cartId);
        var carts = [cart_id]
      } else if (cartType=='meal') {
        var cart_id= parseInt(global.mealsCartId);
        var carts = [cart_id]
      }
      
      const deeplinkValue = await AsyncStorage.getItem('deeplink_value');
      console.log('Deeplink value', deeplinkValue);
      
      var ctx={
        checkout_url: 'app',
        sale_plan_id: plan_id,
        replace_user_id: '',
        visitor_id_no: '',
        device: "App",
        operating_system: Platform.OS === "ios" ? "ios" : "android",
        browser: "",
        deeplink: deeplinkValue || '',
        utm_campaign: deeplinkValue || '',
      };

      API.execute("ecom2.cart","confirm", [carts],{context:ctx}, setIsAnyApiLoading,{token, user_id}).then( async (data,err) => {
        if (data.message) {
          console.log('data',data);
          setIsPaymentProcessing(false);
          if (data.message == 'Cart already confirmed') {
            // Reset the cart based on what type of cart we have - Do Later
            if (cartType=='grocery') {
              
            } else if (cartType == 'meal') {
              // Adjust code from the web
              // if (meal_cart.sale_id && meal_cart.sale_id.id) {
                // if (meal_cart.sale_id.ecom_state == 'wait_payment') {
                  // alert('It seems a Sale Order was already created for your cart. You will now be redirected to the payment page!');
                  // Router.push("/order_details?order_id="+meal_cart.sale_id.id)
                // } else {
                  // alert('Your current cart was already used to create a Sale Order. You will now be redirected to the details of the SO.');
                  // Router.push("/order_details_history?order_id="+meal_cart.sale_id.id)
                // }
              // }
            } else if (cartType == 'combined') {
              
            }
            Alert.alert("Oops!", data.message, [
              {
                text: "OK",
                onPress: () => { navigation.navigate('Cart') },
              },
            ]);
          } else {
            Alert.alert("Oops!", data.message, [
              {
                text: "OK",
                onPress: () => { navigation.navigate('Cart') },
              },
            ]);
          }
          return;
          // Display the error somehow if there is one
          // this.setState({disabled:false, error:err})
        } else {

          console.log("SUCCESS PROCESS TO PAY",data, payment_method, redirect_to, cartType, cartData, mealsCartData)

          var soNumber = data.sale_id;

          var x=1;
          if (x==1) {

            redirect_to = 'payment';
            // Commented out for now in order to fast test
            if (cartType=='grocery') {
              if(cartData.credit_remain > cartData.amount_total){
                redirect_to = 'success';
              } else {
                redirect_to = 'payment';
              }

              // Payed via 100% voucher
              if ((parseInt(final_amount_to_pay) == 0) || (parseInt(final_amount_to_pay) < 0)){
                redirect_to = 'success';
              }

              await API.create_grocery_cart({token, user_id}).then((res) => {
                updateCartId(res);
                console.log('New cart id',res);
                API.grocery_cart_load(
                  res,
                  setCartData,
                  setIsAnyApiLoading,
                  'normal',
                  {token, user_id},
                  'grocery_initial_cart_load');
                global.freshMealsTimeSlotNew = null;
              });
            } else if (cartType == 'meal') {
              if(mealsCartData.credit_remain > mealsCartData.amount_total){
                redirect_to = 'success';
              } else {
                redirect_to = 'payment';
              }

              // Payed via 100% voucher
              if ((parseInt(final_amount_to_pay) == 0) || (parseInt(final_amount_to_pay) < 0)){
                redirect_to = 'success';
              }

              // We dont need to recreate a MealCart
              global.mealsCartId = null;
              setMealsCartData(null);
              global.freshMealsTimeSlotNew = null;
            } else if (cartType == 'combined') {
              if ((mealsCartData.amount_total_combined -  mealsCartData.amount_credit_combined)<= 0) {
                redirect_to = 'success';
              } else {
                redirect_to = 'payment';
              }

              // Payed via 100% voucher
              if ((parseInt(final_amount_to_pay) == 0) || (parseInt(final_amount_to_pay) < 0)){
                redirect_to = 'success';
              }

              global.mealsCartId = null;
              setMealsCartData(null);
              await API.create_grocery_cart({token, user_id}).then((res) => {
                updateCartId(res);
                console.log('New cart id',res);
                API.grocery_cart_load(
                  res,
                  setCartData,
                  setIsAnyApiLoading,
                  'normal',
                  {token, user_id},
                  'grocery_initial_cart_load');
                global.freshMealsTimeSlotNew = null;
              });
            }

            console.log('amount_to_pay 2',final_amount_to_pay,redirect_to);

            if (redirect_to == 'success') {
              // Redirect to Success page as it was payed via credit or 100% voucher
              CheckRedirectLogic(soNumber);
              navigation.navigate('CheckoutSuccess', {sale_id: soNumber});


            } else if (redirect_to == 'payment') {
              // Depending on the payment method we redirect to various screens

              // Ask to set up payment method directly in netforce on SO creation for faster speed!? (if it exists on the cart)
              await API.execute("sale.order","save_pay_method",[[soNumber],payment_method],{},setIsAnyApiLoading,{token, user_id}).then(res=>{

              })

              // QR Code scenario
              if (payment_method == 15) {

                await API.execute("sale.order","gen_qr_kbank",[[soNumber]],{},setIsAnyApiLoading,{token, user_id}).then(res=>{
                  console.log('data.sale_id before redirect', soNumber);
                  setIsPaymentProcessing(false);
                  navigation.navigate('CartStack', { screen: 'CheckoutSO', params: { sale_id: parseInt(soNumber) }})
                  navigation.navigate('QRCode', {sale_id: soNumber});
                })

              // Paypal
              } else if (payment_method == 17) {

                var order_details = await API.execute("sale.order","read_path",[
                    [soNumber],
                    [
                      "plr_payment_amount",
                    ]
                  ],
                  {},
                  setIsAnyApiLoading,
                  {token, user_id}
                  );

                var payment_amount = order_details[0].plr_payment_amount;
                var paypal_token = '';

                // Get token from netforce
                await API.execute("payment.method","get_braintree_token",[[17]],{},setIsAnyApiLoading,{token, user_id}).then(res=>{
                  console.log('Token details',res);
                  paypal_token = res.braintree_token;
                })


                try {
                  // For one time payments
                  const result = await requestOneTimePayment(
                    paypal_token,
                    {
                      amount: payment_amount,
                      currency: 'THB',
                      localeCode: 'th_TH',
                      shippingAddressRequired: false,
                      userAction: 'commit', // display 'Pay Now' on the PayPal review page
                      // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
                      intent: 'authorize',
                    }
                  );

                  const {
                    nonce,
                    payerId,
                    email,
                    firstName,
                    lastName,
                    phone
                  } = result;

                } catch (error) {
                   console.log('Braintree Error', JSON.stringify(error));
                }

                alert('Done with PP token generation');
                return;

                // For device data collection see: https://developers.braintreepayments.com/guides/advanced-fraud-management-tools/device-data-collection/
                const { deviceData } = await requestDeviceData(paypal_token);

                var ctx = {
                  contact_id: accountInfo.contact_id.id,
                  related_id: "sale.order," + soNumber,
                  amount: payment_amount,
                  currency_id: 3,
                  braintree_nonce: nonce,
                  braintree_device_data: deviceData,  // ?transaction_id={transaction_id}
                }

                console.log('ctx',ctx);

                // Get token from netforce
                await API.execute("payment.method","start_payment",[[17]],{context: ctx},setIsAnyApiLoading,{token, user_id}).then(res=>{

                  console.log('Payment details',res);

                  if (res.state == 'done') {
                    CheckRedirectLogic(soNumber);
                    navigation.navigate('CheckoutSuccess', {sale_id: soNumber});
                  } else {
                    navigation.navigate('CheckoutError', {sale_id:soNumber, transaction_id: res.transaction_id});
                  }

                })

                setIsPaymentProcessing(false);



                // alert('Payment method not implemented yet');
                // navigation.navigate('CheckoutSuccess', {sale_id: 190773});

              // 2c2p
              } else if(payment_method == 8) {

                if (card_token_id) {

                  var vals = {
                    card_token_id: card_token_id.id
                  };

                  await API.execute("sale.order","write",[[soNumber],vals],{},setIsAnyApiLoading,{token, user_id}).then(res=>{

                  })

                  var order_details = await API.execute("sale.order","read_path",[
                      [soNumber],
                      [
                        "plr_payment_amount",
                      ]
                    ],
                    {},
                    setIsAnyApiLoading,
                    {token, user_id}
                    );

                  var payment_amount = order_details[0].plr_payment_amount;

                  var vals = {
                    "type": "2c2p",
                    "pay_method_id": payment_method,
                    "amount": payment_amount,
                    "fee_amount": 0, // Ask about it
                    "currency_id": 3,
                    "contact_id": accountInfo.contact_id.id,
                    "related_id": "sale.order," + soNumber,
                    "card_token_id": card_token_id.id,
                    "2c2p_enc_card": '',
                    "2c2p_mask_card": card_token_id.mask_card,
                    "2c2p_name": '',
                    "2c2p_exp_month": '',
                    "2c2p_exp_year": '',
                    "return_url": '',
                    "error_url": '',
                  };

                  // Create Transaction in netforce first for the order
                  var payment_transaction = await API.execute("payment.transaction","create",[vals],{},setIsAnyApiLoading,{token, user_id});
                  console.log('payment_transaction',payment_transaction);

                  console.log('Transaction created');

                  let params={
                      uniqueTransactionCode: payment_transaction.toString(),
                      desc: "Order "+soNumber,
                      amount: payment_amount,
                      currencyCode:"764",
                      storeCardUniqueID: card_token_id.token.toString(),
                      securityCode: card_token_id.cvv.toString(), // "123"  Testing only - Adjust with saved security code
                  };

                  console.log('2c2p params', params);

                  let res = await My2c2p.payCreditCard(params);
                  console.log("2c2p Response",res);
                  let code = res.respCode;
                  console.log("2c2p Response Code: ",code,res.failReason);

                  // Saving the request/reponse
                  var vals = {
                    "request_details": JSON.stringify(params),
                    "response_details": JSON.stringify(res),
                  };

                  await API.execute("payment.transaction","write",[[payment_transaction],vals],{},setIsAnyApiLoading,{token, user_id});
                  console.log('payment_transaction',payment_transaction);

                  if (code == '00') {
                    // Update transaction status with details
                    /*
                    var vals = {
                      "state": "done",
                      "ref": res.refNumber,
                      "end_time": momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD hh:mm:ss"),
                    };
                    console.log('Transaction Succesfull', vals);
                    */

                    // await API.execute("payment.transaction","write",[[payment_transaction],vals],{},setIsAnyApiLoading,{token, user_id});

                    await API.execute("payment.transaction","payment_received",[[payment_transaction]],{},setIsAnyApiLoading,{token, user_id});

                    // Do we also need to update the SO ?
                    setIsPaymentProcessing(false);
                    CheckRedirectLogic(soNumber);
                    navigation.navigate('CheckoutSuccess', {sale_id: soNumber});
                    console.log('2c2p Success');
                  } else {
                    // Update transaction status with details
                    var vals = {
                      "state": "error",
                      "error": res.failReason,
                      "end_time": momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD hh:mm:ss")
                    };
                    console.log('Transaction Failed', vals);
                    await API.execute("payment.transaction","write",[[payment_transaction],vals],{},setIsAnyApiLoading,{token, user_id});

                    setIsPaymentProcessing(false);
                    navigation.navigate('CheckoutError', {sale_id:soNumber, transaction_id: payment_transaction});
                    console.log('2c2p Error');
                  }

                  console.log('Done with Payment as well');

                //User might have set up the payment method on the web and doesn't have a saved card to his cart
                } else {
                  alert('Error: It seems the selected card_token_id does not exist.');
                  return;
                }

              } else {

                return;

              }
            }

          }

        }
      }).catch((err) => {
        console.log('err',err)
        alert(err)
      });

    // Paypal
    } else if (payment_method == 17) {
      setIsPaymentProcessing(false);
      alert('Payment method not implemented yet');
      // navigation.navigate('CheckoutSuccess', {sale_id: 190773});

    // 2c2p
    } else {

      alert('No payment method selected');
      return;

    }

  }
  
  const CheckRedirectLogic = (soNumber) => {
    
    if ((accountInfo.contact_id.plr_survey1_completed == null || accountInfo.contact_id.plr_survey1_completed == false) && (accountInfo.contact_id.plr_survey1_denied == null || accountInfo.contact_id.plr_survey1_denied == false)) {
      var shown = accountInfo.contact_id.plr_survey1_first_screen_shown;
      if (shown < 3 || shown == null || shown == false ) {
        navigation.navigate('CheckoutSuccessSurvey', {sale_id: soNumber});
      } else if (accountInfo.contact_id.plr_survey1_second_screen_shown == null || accountInfo.contact_id.plr_survey1_second_screen_shown == false) {
        navigation.navigate('CheckoutSuccessShare', {sale_id: soNumber});
      } else if (accountInfo.contact_id.plr_survey1_third_screen_shown == null || accountInfo.contact_id.plr_survey1_third_screen_shown == false) {
        navigation.navigate('CheckoutSuccessInvite', {sale_id: soNumber});
      }
    } else {
      if (accountInfo.contact_id.plr_survey1_second_screen_shown == null || accountInfo.contact_id.plr_survey1_second_screen_shown == false) {
        navigation.navigate('CheckoutSuccessShare', {sale_id: soNumber});
      } else if (accountInfo.contact_id.plr_survey1_third_screen_shown == null || accountInfo.contact_id.plr_survey1_third_screen_shown == false) {
        navigation.navigate('CheckoutSuccessInvite', {sale_id: soNumber});
      }
    }
    
  }

  const renderProcessingView = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.processingContainer}
        onPress={() => {
          setIsPaymentProcessing(false)
        }}
      >
        <View style={styles.processingContainer}>
          <Image source={circle_animation} style={styles.processingImg} />
          <Text
            condensedBold
            largeTitle
            color={black}
            textAlign={'center'}
            style={styles.processHeading}
            lineHeight={30.92}
          >
            Processing your payment.
          </Text>
          <Text
            condensedBold
            color={black}
            largeRegularBetween
            textAlign={'center'}
            lineHeight={24}
            style={styles.topMargin}
          >
            Processing time may take a few seconds.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  // Should be adjusted to use the actual Cart Data for validation
  // Validate the Payment details
  const validateInput = () => {

    console.log('amount_to_pay',amount_to_pay);
    if ((parseInt(amount_to_pay) == 0) || (parseInt(amount_to_pay) < 0)){
      return true;
    }
    
    var payment_method = getPaymentMethod();
    var card_token_id = getCardToken();
    
    // console.log('payment_method, card_toke_id',payment_method,card_token_id)
    
    if (payment_method != null && payment_method !=8) {
      return true;
    }
    
    if (payment_method !=null && payment_method ==8) {
      // console.log('payment_method, card_toke_id 222222')
      if (card_token_id && card_token_id!= null) {
        return true;
      } else {
        return false;
      }
    }
    
    // if (getPaymentMethod() != null) { // selectTimeSlot && selectedAddress &&
      // return true
    // }
    return false
  }

  const validation = validateInput()
  
  
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
  
  // Revalidate the cart data
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
        
        if (mealsCartData.lines[0].ship_address_id) {
          // error = false;
        } else {
          error = true;
          console.log('Error 5');
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
        
        if (cartData.ship_address_id) {
          // error = false;
        } else {
          error = true;
          console.log('Error 5');
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

  const validation_cart = validateData();
  
  console.log('Validation',validation_cart,validation);
  

  const cartType = getCartType(cartData, mealsCartData);

  const pay = async () =>{
    let params={
        uniqueTransactionCode: "123456789",
        desc: "product item 1",
        amount: 20.00,
        currencyCode:"764",
        storeCardUniqueID:"02042214214820478166",
        securityCode: "123",
    };
    let res = await My2c2p.payCreditCard(params);
    console.log("=> res",res);
    let code=res.respCode;
    alert("resp code: "+code);
  };

  if (isPaymentProcessing) {
    return  renderProcessingView()
  }

  return (
    <View style={styles.container}>
      {(isPaymentProcessing) &&
        <>renderProcessingView()</>
      }
      {(isPaymentProcessing == false) &&
        <>
          <MarketHeader
            searchEnabled={false}
            backArrow
            backPress={() => backPress()}
            condensedTitle={'Checkout'}
          />
          <View style={styles.body}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {((isSingleMealDayDelivery() == true) || (cartType == 'grocery') || (isSingleDayDelivery() == true)) ?
                (
                  <>
                    {renderTimings()}
                    {renderAddress()}
                  </>
                )
                :
                (
                  <>
                    {renderMultipleAddresses()}
                  </>
                )
              }
              {renderCartDetails()}
              {renderHelp()}
            </ScrollView>
            <Button
              onPress={() => {
                CreateSO();
              }}
              disabled={(!validation || validation_cart == true)}
              btnTitle={'Place order'}
              style={[
                styles.checkoutBtn,
                {
                  backgroundColor: (!validation || validation_cart == true) ? greenButtonOpacity : quantityGreen,
                },
              ]}
            />
            {isOpenVoucherPopUp && (
              <View style={styles.modalContain}>
                <VoucherPopup
                  showPrivacyModal={isOpenVoucherPopUp}
                  contentHeight={301}
                  contentStyle={styles.contentStyle}
                  setShowPrivacyModal={(code) => {
                    setIsOpenVoucherPopUp(false)
                    setIsAnyPopupOpened(false)
                    if (code && code != null) {
                      setVoucherNotificationShowing(true)
                    }
                  }}
                />
              </View>
            )}
          </View>

          <TimeSlot
            heading={"Delivery times"}
            freshMeals={true}
            isSingleDay={isSingleDayDelivery()}
            timeSlots={getCartType(cartData, mealsCartData) == 'combined' ? getTimeSlots() : getSlotsForDelivery()}
            cartType={getCartType(cartData, mealsCartData)}
            mealsCartData={mealsCartData}
            cartData={cartData}
            fromCart={false}
            defaultDate={getTimeSlotForDelivery().defaultDateForPicker}
            showModal={showModal}
            selectedSection={getCartType(cartData, mealsCartData) == 'combined' ? 'meal' : getCartType(cartData, mealsCartData)}
            setSelectTimeSlot={(obj) => {
              global.freshMealsTimeSlotNew = obj;
              onchange_time_slot(obj.completeDate, obj.slotId);
            }}
            setShowPrivacyModal={() => {
              setShowModal(false);
            }}
            screen={"CHECKOUT"}
          />

          {(showAddressModal) &&
            <SelectAddress
              heading={'Select address'}
              flow={'checkout'}
              deliveryDate={getTimeSlotForDelivery().defaultDateForPicker}
              navigation={navigation}
              fromCart={true}
              cartType={getCartType(cartData, mealsCartData)}
              cartData={cartData}
              addressArray={cartType =="grocery" ? getShipAddresses(cartData) : getMealsShipAddresses(mealsCartData, mealsCartData.lines[0].delivery_date)}
              showAddressModal={showAddressModal}
              setSelectedAddress={(obj) => setSelectedAddress(obj)}
              selectedSection ={getCartType(cartData, mealsCartData) == 'combined' ? 'meal' : getCartType(cartData, mealsCartData)}
              setShowAddressModal={() => {
                setShowAddressModal(false)
                //  setShowAddressModalConatiner(false)
                //  setIsAnyPopupOpened(false)
              }}
            />
         }
          {isOpenDeliveryPopUp && (
            <View style={styles.modalContain}>
              <DeliveryPopup
                heading={"Delivery fee"}
                showPrivacyModal={isOpenDeliveryPopUp}
                setShowPrivacyModal={() => {
                  setIsOpenDeliveryPopUp(false);
                  setIsAnyPopupOpened(false);
                }}
              />
            </View>
          )}
        </>
      }

    </View>
  )
}

export default Checkout
