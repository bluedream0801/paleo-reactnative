import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import { View, TouchableOpacity, FlatList, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import analytics from '@react-native-firebase/analytics';
import Modal from "react-native-modal";
import FastImage from "react-native-fast-image";
import { getTrackingPermissionsAsync, PermissionStatus } from 'expo-tracking-transparency';
import provider from "../../firebase/ProductsProvider";
const { getProductsGroupsData, getProductsData, getAllProductsData } = provider;
import styles from "./Styles";
import { appColors, appImages } from "../../theme";
import { MarketHeader, Text } from "../../components/";
import { TIMEZONE, CUTOFF_TIME} from '../../common/constants';
const { accountSettingGray } = appColors;
import moment from "moment";
import PickupTimeSlot from "../PickupTimeSlot";
import { createDaysArray } from "../PickupTimeSlot";
import Services from "../../services";
const { API } = Services;
import AppContext from "../../provider";
const {} = appImages;
import helpers from "../../helpers";
import * as momenttz from 'moment-timezone';
const {
  get_thumbnail,
  convertDeliveryDateToDisplayDate,
  checkForTodayTomorrow,
  groupBy2,
  getCartType,
  convertDeliveryDateToHomepageDisplayDate,
  getSlotsForDelivery,
  getTimeSlotForDeliveryDisplay,
  isSingleDayDelivery,
  onchange_time_slot,
} = helpers;
import AppTrackingPermissionModal from '../AppTrackingPrompt';

const LIST_OPTIONS = {
  NEW_AND_JUSTIN: 'new-and-just-in',
  BUNDLES: 'bundles',
  LISTS_FROM_OUR_FRIENDS: 'lists-from-out-friends'
}

const options = [
  // { label: 'New & just in', id: LIST_OPTIONS.NEW_AND_JUSTIN },
  { label: 'Bundles', id: LIST_OPTIONS.BUNDLES },
  { label: 'Lists from our friends', id: LIST_OPTIONS.LISTS_FROM_OUR_FRIENDS }
]

const Market = (props) => {
  const { navigation, route } = props;

  const {
    setIsApiLoaderShowing,
    setProductsRoutesData,
    cartData,
    setCartData,
    setMealsCartData,
    setIsAnyApiLoading,
    loginData,
    mealsCartData,
    setIsNotificationShowing,
  } = useContext(AppContext);

  if (loginData) {
    var { token, user_id } = loginData;
  } else {
    var user_id = null;
    var token = null;
  }

  const [showModal, setShowModal] = useState(false);
  const [showAppTrackingPermissionModal, setShowAppTrackingPermissionModal] = useState(false);
  const scrollRef = useRef();

  const searchPress = () => {
    navigation.navigate("Search");
  };

  useEffect(() => {
    (async () => {
      const appTrackingPermission = await getTrackingPermissionsAsync();
      if (!appTrackingPermission || appTrackingPermission.status === PermissionStatus.UNDETERMINED) {
        setShowAppTrackingPermissionModal(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({ offset: 0 });
    }
  }, [route.params?.resetScrollPosition]);

  const getSubcategoriesByParentId = (id) => {
    let filtered = global.categoriesArray.filter((x) => x[1].parent_id == id);

    filtered = filtered.sort(function (a, b) {
      const first = a[1].sequence || Number.MAX_SAFE_INTEGER;
      const second = b[1].sequence || Number.MAX_SAFE_INTEGER;
      return first - second;
    });

    return filtered;
  };

  // Rendering of categories on Main Market Page
  const renderListItem = (obj, index) => {
    const dataObj = obj[1];

    const { name, image, touch, id, code, items } = dataObj;

    const routeObj = {
      categoriesArray: getSubcategoriesByParentId(obj[0]),
      selectedTab: 0,
      headingTitle: name,
      parentId: obj[0],
      parentObj: obj,
      items: items,
    };
    
    // console.log('routeObj',routeObj);
     // console.log('routeObj 2', obj[1].items);

    return (
      <TouchableOpacity
        disabled={touch == "disabled"}
        onPress={() => {
          if (index == 0) {
            analytics().logEvent('market_click_freshmeals');
            navigation.navigate('FreshMeals', { fromHome: false, BYO: false });
          } else {
            analytics().logEvent(`market_click_${code}`);
            navigation.navigate("Products", {
              ...routeObj,
            });
          }
        }}
        style={[
          styles.cell,
          {
            marginRight: index % 2 == 0 ? 7 : 0,
            marginLeft: index % 2 !== 0 ? 7 : 0,
            marginBottom: index == 10 || index == 11 ? 10 : 10,
          },
        ]}
      >
        <FastImage
          source={{ uri: get_thumbnail(image, 512) }}
          style={styles.cellImg}
        >
        </FastImage>
        <Text smallRegular color={accountSettingGray} lineHeight={19}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };


  // Time Slot Related functions
  useFocusEffect(
    useCallback(() => {
      console.log('Are we even doing this');
      updateTimeSlotForDelivery();
    }, [mealsCartData, cartData])
  );

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
    if (((cartData) && (cartType=='grocery' || isSingleDayDelivery(cartData, mealsCartData)== true)) || ((cartData) && (cartType==null))){ //

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

        let new_selected_slot;

        if (update_slot == true) {
          console.log('We need to update the slot');
          var new_selected_day = available_days.find(
            (slot) => !/disabled/.test(slot.status)
          );
          if (new_selected_day) {
            var new_day_slots = new_selected_day.slots;
            new_selected_slot = new_day_slots.find(
              (slot) => slot.state == 'avail'
            );
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

          API.grocery_cart_write(
            vals,
            setMealsCartData,
            setCartData,
            cartType,
            'yes',
            { token, user_id },
            'grocery_slot_change_app'
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
          };

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
        deliverySlotId = mealsCartData.lines[0].delivery_slot_id || {};

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
          const slots = getSlotsForDelivery(cartData, mealsCartData);
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
        const slots = getSlotsForDelivery(cartData, mealsCartData);
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



  const selectedDateSlotString = getTimeSlotForDeliveryDisplay(cartData, mealsCartData);

  console.log('RERENDER Market.js');

  const onPressOption = (option) => {
    switch (option.id) {
      case LIST_OPTIONS.BUNDLES:
        // alert('Bundles will come soon');

        // Redirect user to the New Category
        //console.log('categoriesArray',categoriesArray);

        var categoriesArraySelected = global.marketSectionCategoriesArray.filter((x) => x[1].id == 287);

        console.log('categoriesArraySelected',categoriesArraySelected);
        analytics().logEvent('market_click_bundles');

        var obj = categoriesArraySelected[0];

        if (obj && obj[1]) {
          const dataObj = obj[1];

          const { name } = dataObj;

          const routeObj = {
            categoriesArray: getSubcategoriesByParentId(obj[0]),
            selectedTab: 0,
            headingTitle: name,
            parentId: obj[0],
            parentObj: obj,
          };

          navigation.navigate("Products", {
            ...routeObj,
          });
        }


        break;
      /*
      case LIST_OPTIONS.NEW_AND_JUSTIN:

        // Redirect user to the New Category
        //console.log('categoriesArray',categoriesArray);
        console.log('categoriesArray[1]',global.marketSectionCategoriesArray[1]);
        analytics().logEvent('market_click_new');
        var obj = global.marketSectionCategoriesArray[1];

        if (obj && obj[1]) {
          const dataObj = obj[1];

          const { name } = dataObj;

          const routeObj = {
            categoriesArray: getSubcategoriesByParentId(obj[0]),
            selectedTab: 0,
            headingTitle: name,
            parentId: obj[0],
            parentObj: obj,
          };

          navigation.navigate("Products", {
            ...routeObj,
          });
        }
        break;
      */
      case LIST_OPTIONS.LISTS_FROM_OUR_FRIENDS:
        analytics().logEvent('market_click_lists');
        navigation.navigate('Influencers');
        break;

      default:
        break;
    }
  }

  const renderOtherWaysToShopSection = () => {
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader} lineHeight={29.12}>
          <Text smallMinTitle color={appColors.accountSettingGray}>
            Other ways to shop
          </Text>
        </View>
        <View style={styles.listOptions}>
          {options.map((option, i) => {
            return (
              <TouchableOpacity
                onPress={() => onPressOption(option)}
                style={[
                  styles.listOption,
                  {
                    borderBottomWidth: options.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <Text color={appColors.accountSettingGray} largeRegular lineHeight={23.83}>
                  {option.label}
                </Text>
                <Image style={styles.arrow} source={appImages.right_arrow} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    )
  }

  // Manually remove the New section from top listings
  // Will also do this for Bundles
  const getCategoriesArrayTop = () => {
    var categoriesArrayTop = global.marketSectionCategoriesArray.filter((x) => x[1].id != 287); // x[1].id != 127 && 

    if (categoriesArrayTop.length % 2 !== 0) {
      const LastItem = [
        "130",
        {
          code: " ",
          description: null,
          image: "https",
          name: " ",
          parent_id: " ",
          products: [],
          sequence: 0,
          touch: "disabled",
        },
      ];
      categoriesArrayTop.push(LastItem);
    }

    return categoriesArrayTop;
  }
  
  console.log('Moment tz currentTime Home', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'))
  // console.log('global.groceryProductsArray',global.groceryProductsArray);

  return (
    <View style={styles.container}>
      <MarketHeader
        searchEnabled={true}
        calenderImg={true}
        onPressDropDown={() => {
          setShowModal(!showModal);
        }}
        title={selectedDateSlotString}
        searchPress={() => searchPress()}
      />
      <View style={styles.body}>
        <FlatList
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={getCategoriesArrayTop()}
          style={styles.listStyle}
          numColumns={2}
          renderItem={({ item, index }) => renderListItem(item, index)}
          ListFooterComponent={renderOtherWaysToShopSection()}
        />
      </View>

      {showModal && (
        <PickupTimeSlot
          freshMeals={true}
          fromCart={false}
          mealsCartData={mealsCartData}
          cartData={cartData}
          cartType={getCartType(cartData, mealsCartData)}
          timeSlots={getSlotsForDelivery(cartData, mealsCartData)}
          splitTheDelivery={() => {}}
          isSingleDay={isSingleDayDelivery(cartData, mealsCartData)}
          heading={"Delivery times"}
          defaultDate={""}
          selectedSection={'none'}
          showModal={showModal}
          setSelectTimeSlot={(obj) => {
            global.freshMealsTimeSlotNew = obj;
            onchange_time_slot(cartData, mealsCartData, setMealsCartData, setCartData, obj.completeDate, obj.slotId, token, user_id, API);
          }}
          setShowPrivacyModal={() => {
            setShowModal(false);
          }}
        />
      )}

      <Modal isVisible={showAppTrackingPermissionModal}
        style={{
          margin: 0
        }}
        >
        <AppTrackingPermissionModal
          onContinue={() => setShowAppTrackingPermissionModal(false)}/>
      </Modal>
    </View>
  );
};

export default Market;
