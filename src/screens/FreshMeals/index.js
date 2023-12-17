import React, { useState, useContext, createRef, useEffect, useCallback } from "react";
import { View, LogBox, Pressable, Animated } from "react-native";
import Specials from "./Specials";
import styles from "./Styles";
import { appColors, appImages } from "../../theme";
import BuildYourOwn from "./BuildYourOwn";
import Beverages from "./Beverages";
import { MarketHeader, Text, Button } from "../../components/";
import ScrollableTabView, {
  ScrollableTabBar,
} from "react-native-scrollable-tab-view";
const { accountSettingGray, headerBgColor } = appColors;
import NothingInCart from "./NothingInCart";
import AppContext from "../../provider";
import provider from "../../firebase/ProductsProvider";
import helpers from "../../helpers";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { CUTOFF_TIME, TIMEZONE } from "../../common/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { getFreshMealsArrayData, getProductsDataOrderByDoc } = provider;
const { getDefaultDateForFreshMeals, checkForTodayTomorrow, shortSlotName } = helpers;
const {} = appImages;
import * as momenttz from 'moment-timezone';
import ReAnimated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SwipePageGuideAlert from '../../components/SwipePageGuideAlert';

LogBox.ignoreAllLogs();

const FreshMeals = (props) => {
  const { navigation, route } = props;
  const { fromHome, BYO } = route.params;
  const tabRef = createRef();
  const {
    isAnyPopupOpened,
    setIsApiLoaderShowing,
    loginData
  } = useContext(AppContext);

  const [currentTab, setCurrentTab] = useState(0);
  const [freshMeals, setFreshMeals] = useState([]);
  const [specialBigItemsArray, setSpecialBigItemsArray] = useState([]);
  const [fromHomeScreen, setFromHomeScreen] = useState(fromHome);
  const [fromBYOScreen, setFromBYOScreen] = useState(BYO);
  const [imageIndex, setImageIndex] = useState(0);
  const [showChangeAddress, setShowChangeAddress] = useState(false);
  const [showSwipeGuideNotification, setShowSwipeGuideNotification] = useState(false);
  
  const [selectedFreshMealsTime, setSelectedFreshMealsTime] = useState(global.freshMealsTimeSlotNew);

  const defaultDate = getDefaultDateForFreshMeals();
  const { pretty_date, tomorrow, formattedTomorrow } = defaultDate;

  // console.log('default Date', defaultDate);

  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
    var { contact_id } = accountInfo;
    var { default_address_id, addresses } = contact_id;
  } else {
    var user_id = null;
    var token = null;
  }

  const [routes] = React.useState([
    { key: "first", title: "Delivery day" },
    { key: "second", title: "Build your own" },
    { key: "third", title: "Sides" },
    { key: "fourth", title: "Snacks & desserts" },
    { key: "fifth", title: "Beverages" },
    { key: "sixth", title: "Beverages" },
  ]);

  const fadeAnim = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value
    }
  }, [fadeAnim.value]);

  useEffect(() => {
    (async () => {
      let visitCount = await AsyncStorage.getItem('visit-count');
      visitCount = visitCount ? Number.parseInt(visitCount, 10) : 0;
      if (visitCount < 2) {
        setShowSwipeGuideNotification(true);
        visitCount++;
        await AsyncStorage.setItem('visit-count', String(visitCount));
      }
    })();
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (showSwipeGuideNotification) {
      fadeAnim.value = withSequence(
        withTiming(1, { duration: 1000 }),
        withDelay(5000, withTiming(0, { duration: 1000}))
      );
      setTimeout(() => {
        if (isMounted) {
          setShowSwipeGuideNotification(false);
        }
      }, 7000);
    }
    return () => {
      isMounted = false;
    }
  }, [showSwipeGuideNotification]);

  useEffect(() => {
    if (fromHomeScreen) {
      setFromHomeScreen(false);
      tabRef.current.goToPage(1);
    }
    if (fromBYOScreen) {
      setFromBYOScreen(false);
      tabRef.current.goToPage(2);
    }
  });

  useFocusEffect(
    useCallback(() => {
      console.log('Use Focus Effect Test For Notification');

      var user_zone_id = "", selected_address;
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

      console.log('Checking', selected_address, user_zone_id);

      // Trigger Popus
      if ( selected_address == "" || user_zone_id == "" || user_zone_id == null || user_zone_id == "null" || user_zone_id == 32 || user_zone_id == 34) {
        setShowChangeAddress(true);
      } else {
        // Do nothing
        setShowChangeAddress(false);
      }

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [loginData])
  );

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

  const searchPress = () => {
    navigation.navigate("Search");
  };

  const goToSpecial = (imgIndex) => {
    setImageIndex(imgIndex);
    tabRef.current.goToPage(1);
  };

  const backPress = () => {
    if (currentTab > 0) {
      tabRef.current.goToPage(0);
    } else {
      navigation.goBack();
    }
  };

  const getSpecialsProducts = async (jumboItemsIds, regularItemIds, time) => {
    const arrayIds = [...jumboItemsIds, ...regularItemIds];
    const ids = arrayIds.map(String);
    if (arrayIds.length > 0) {
      let data = await getProductsDataOrderByDoc(ids, setIsApiLoaderShowing);

      // console.log('Special Products Data',data);

      data = data.sort((a, b) => {
        return arrayIds.indexOf(a.docId) - arrayIds.indexOf(b.docId);
      });

      const updatedArray = [];
      const specialBig = [];
      const special = [];
      for (let index = 0; index < data.length; index++) {
        if (index < jumboItemsIds.length) {
          
          var fire_reviews = 100;
          var thumbs_up_reviews = 100;
          var sad_reviews = 100;
          var spicy_reviews = 100;
          
          if (data[index]) {
            if (data[index].ecom_feedback) {
              
              if (data[index].ecom_feedback.fire) {
                fire_reviews += data[index].ecom_feedback.fire;
              }
              
              if (data[index].ecom_feedback.thumbs_up) {
                thumbs_up_reviews += data[index].ecom_feedback.thumbs_up;
              }
              
              if (data[index].ecom_feedback.sad) {
                sad_reviews += data[index].ecom_feedback.sad;
              }
              
              if (data[index].ecom_feedback.spicy) {
                spicy_reviews += data[index].ecom_feedback.spicy;
              }
            }
          }
          
          if (data[jumboItemsIds.length + index]) {
            if (data[jumboItemsIds.length + index].ecom_feedback) {
              
              if (data[jumboItemsIds.length + index].ecom_feedback.fire) {
                fire_reviews += data[jumboItemsIds.length + index].ecom_feedback.fire;
              }
              
              if (data[jumboItemsIds.length + index].ecom_feedback.thumbs_up) {
                thumbs_up_reviews += data[jumboItemsIds.length + index].ecom_feedback.thumbs_up;
              }
              
              if (data[jumboItemsIds.length + index].ecom_feedback.sad) {
                sad_reviews += data[jumboItemsIds.length + index].ecom_feedback.sad;
              }
              
              if (data[jumboItemsIds.length + index].ecom_feedback.spicy) {
                spicy_reviews += data[jumboItemsIds.length + index].ecom_feedback.spicy;
              }
              
            }
          }
          
            
          specialBig.push({
            ...data[index],
            jumbo: true,
            reviews: [fire_reviews,thumbs_up_reviews,sad_reviews,spicy_reviews],
            translateX: new Animated.Value(0),
            quantity: 0,
            regularPrice: data[jumboItemsIds.length + index]?.sale_price,
            regularCalories: data[jumboItemsIds.length + index]?.nutrition_id?.calories,
            regularLipid: data[jumboItemsIds.length + index]?.nutrition_id?.lipid_tot_g,
            regularProtein: data[jumboItemsIds.length + index]?.nutrition_id?.protein_g,
            regularCarbohydrt: data[jumboItemsIds.length + index]?.nutrition_id?.carbohydrt_g,
            regularDocId: data[jumboItemsIds.length + index]?.docId,
            time: time, // Store the time for this menu here so we can test it when freshMealsTimeSlot changes
          });
        // Don't think this is needed but leave it here for now
        } else {
          special.push({
            ...data[index],
            jumbo: true,
            reviews: [fire_reviews,thumbs_up_reviews,sad_reviews,spicy_reviews],
            translateX: new Animated.Value(0),
            quantity: 0,
          });
        }
      }
      setSpecialBigItemsArray(specialBig);
    } else {
      setSpecialBigItemsArray([]);
    }
  };

  // console.log('specialBigItemsArray',specialBigItemsArray)

  const getFreshMealObjByDate = (arr, time) => {
    // Find the correct menu since we might still have 2-3 menus pulled
    const mealsObj = arr.find((meal) => {
      const strDateFrom = meal[1].date_from;
      const strDateTo = meal[1].date_to;
      let strDateFromDate = moment(strDateFrom).format("YYYY-MM-DD");
      let strDateToDate = moment(strDateTo).format("YYYY-MM-DD");
      if (time >= strDateFromDate && time <= strDateToDate) {
        return true;
      }
      return false;
    });

    const mealData = {
      ...mealsObj[1],
      beverages: mealsObj[1].menu_id.beverages.map((beverage) =>
        beverage.product_id.toString()
      ),
      desserts: mealsObj[1].menu_id.desserts.map((dessert) =>
        dessert.product_id.toString()
      ),
      side_dishes: mealsObj[1].menu_id.side_dishes.map((sideDish) =>
        sideDish.product_id.toString()
      ),
      specials: mealsObj[1].menu_id.specials.map((special) =>
        special.product_id.toString()
      ),
      specials_big: mealsObj[1].menu_id.specials.map((special) =>
        special.product_big_id.toString()
      ),
    };
    delete mealData.menu_id;

    return [mealsObj[0], mealData];
  };

  const getFreshMeals = async (time, key) => {

    // Do not reload the menu if the currently selected menu is still a good one.
    var reload_menu = true;
    if (specialBigItemsArray && specialBigItemsArray.length >0) {
      console.log('specialBigItemsArray time', specialBigItemsArray[0].time);
      var current_menu_week_day = moment(specialBigItemsArray[0].time).format("dddd");
      var current_selected_time_slot_week_day = moment(global.freshMealsTimeSlotNew?.completeDate).format("dddd");
      console.log('Compare days',current_menu_week_day,current_selected_time_slot_week_day);

      if
        (
          (
            (
              (current_menu_week_day == "Monday" || current_menu_week_day == "Tuesday" || current_menu_week_day == "Wednesday") &&
              (current_selected_time_slot_week_day == "Monday" || current_selected_time_slot_week_day == "Tuesday" || current_selected_time_slot_week_day == "Wednesday")
            )
              ||
            (
              (current_menu_week_day == "Thursday" || current_menu_week_day == "Friday" || current_menu_week_day == "Saturday") &&
              (current_selected_time_slot_week_day == "Thursday" || current_selected_time_slot_week_day == "Friday" || current_selected_time_slot_week_day == "Saturday")
            )
          )
          &&
          (
            moment(specialBigItemsArray[0].time).isSame(global.freshMealsTimeSlotNew?.completeDate, "week") == true
          )
        )
      {
        reload_menu = false;
      }
    }

    if (reload_menu == true) {
      // Maybe remove those in the future
      setFreshMeals([]);
      setSpecialBigItemsArray([]);
      // console.log('XXXXXXXXXXXXXXXXXXXXX',time);

      const freshMealsMenus = await getFreshMealsArrayData(setIsApiLoaderShowing, time);
      console.log('Menus retrieved from firestore', freshMealsMenus);

      const mealsObj = getFreshMealObjByDate(freshMealsMenus, time);
      console.log('Items in selected menu by id', mealsObj);

      if (mealsObj && mealsObj.length > 0) {
        setFreshMeals(mealsObj ? mealsObj[1] : []);
        getSpecialsProducts(mealsObj[1].specials_big, mealsObj[1].specials, time);
      }
    }

  };

  // Use useEffect instead in order to avoid refresh ?

  useEffect(() => {
    console.log('UseFocusEffect Fresh Meals');
    var isPastCutOffTime = checkIsPastCutOffTime();
    if (isPastCutOffTime == true) {
      getFreshMeals(formattedTomorrow);
    } else {
      getFreshMeals(global.freshMealsTimeSlotNew.completeDate);
    }
  }, [global.freshMealsTimeSlotNew]);

  const getTimeSlotForDelivery = () => {
    var isPastCutOffTime = checkIsPastCutOffTime();
    if (isPastCutOffTime == true) {
      return pretty_date + ' '+ tomorrow[5];
    } else {
      if (global.freshMealsTimeSlotNew) {
        return (checkForTodayTomorrow(global.freshMealsTimeSlotNew.completeDate,'') + " " + global.freshMealsTimeSlotNew.shortDate);
      } else {
        return null;
      }
    }
  };

  const getTimeSlotForIndexDelivery = () => {
    var isPastCutOffTime = checkIsPastCutOffTime();
    if (isPastCutOffTime == true) {
      return (pretty_date + ", 10am-12pm");
    } else {
      if (global.freshMealsTimeSlotNew) {
        return (checkForTodayTomorrow(global.freshMealsTimeSlotNew.completeDate,'') + ", " + shortSlotName(global.freshMealsTimeSlotNew.time));
      } else {
        return null;
      }
    }
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

  const onChangeDeliveryAddress = () => {
    props.navigation.navigate('AccountStack', { screen: 'DeliveryAddresses'})
  }

  const insets = useSafeAreaInsets();

  console.log('RERENDER FreshMeals.js');

  return (
    <View style={styles.container}>
      {showChangeAddress && (
        <View style={[styles.deliveryAddressWarningContainer, {height: 59 + insets.top, paddingTop: insets.top + 9}]}>
          <View>
            <Text bold small style={{color: appColors.white, textAlign: 'center'}}>Fresh Meals cannot be delivered outside of Bangkok.</Text>
            <View style={styles.textChangeAddressWrapper}>
              <Text small style={{color: appColors.white}}>Please </Text>
              <Pressable style={styles.pressableChangeDeliveryAddress} onPress={onChangeDeliveryAddress}><Text small style={{color: appColors.white}}>change your delivery address</Text></Pressable>
              <Text small style={{color: appColors.white}}> to be able to order.</Text>
            </View>
          </View>
        </View>
      )}
      <MarketHeader
        hasNotificationBar={showChangeAddress}
        searchEnabled={true}
        backArrow
        backPress={() => backPress()}
        condensedTitle={"Fresh Meals"}
        searchPress={() => searchPress()}
      />

      <View style={styles.body}>
        {isAnyPopupOpened && <View style={styles.overLay} />}

        <ScrollableTabView
          initialPage={0}
          automaticallyAdjustContentInsets={false}
          scrollWithoutAnimation={false}
          ref={tabRef}
          tabBarTextStyle={styles.tabBarTextStyle}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          onScroll={(position) => {
            if (position < -0.3) {
              backPress();
            }
          }}
          onChangeTab={(obj) => {
            setCurrentTab(obj.i);
          }}
          renderTabBar={(props) => {
            if (true) {
              return (
                <ScrollableTabBar
                  automaticallyAdjustContentInsets={false}
                  style={[styles.ScrollableTabBar, { height: 30, borderWidth: 0 }]}
                  activeTextColor={headerBgColor}
                  inactiveTextColor={accountSettingGray}
                  tabStyle={[styles.tabStyle]}
                ></ScrollableTabBar>
              );
            } else {
              return <View />;
            }
          }}
        >
          {routes.map((obj, index) => {
            if (index == 0) {
              return (
                <NothingInCart
                  specialBigItemsArray={specialBigItemsArray}
                  key={index}
                  tabLabel="Delivery day"
                  goToSpecial={(dataIndex) => goToSpecial(dataIndex)}
                  navigation={navigation}
                  timeSlotForDelivery={getTimeSlotForDelivery()}
                  timeSlotForIndexDelivery={getTimeSlotForIndexDelivery()}
                  setSelectedFreshMealsTime={setSelectedFreshMealsTime}
                />
              );
            }
            if (index == 1) {
              return (
                <Specials
                  key={index}
                  imageIndex={imageIndex}
                  specialBigItemsArray={specialBigItemsArray}
                  setIsApiLoaderShowing={setIsApiLoaderShowing}
                  productsIdsArray={
                    freshMeals.specials || freshMeals.specials_big
                      ? [...freshMeals.specials, ...freshMeals.specials_big]
                      : []
                  }
                  specialsLength={
                    freshMeals.specials ? freshMeals.specials.length : 0
                  }
                  dateFrom={freshMeals.date_from ? freshMeals.date_from : ""}
                  dateTo={freshMeals.date_to ? freshMeals.date_to : ""}
                  tabLabel="Specials"
                  navigation={navigation}
                  timeSlotForDelivery={getTimeSlotForDelivery()}
                  setSelectedFreshMealsTime={setSelectedFreshMealsTime}
                />
              );
            }
            if (index == 2) {
              return (
                <BuildYourOwn
                  key={index}
                  navigation={navigation}
                  tabLabel="Build your own"
                  timeSlotForDelivery={getTimeSlotForDelivery()}
                  showChangeAddress={showChangeAddress}
                  setSelectedFreshMealsTime={setSelectedFreshMealsTime}
                />
              );
            }
            if (index == 3) {
              return (
                <Beverages
                  key={index}
                  tabLabel="Sides"
                  setIsApiLoaderShowing={setIsApiLoaderShowing}
                  dateFrom={freshMeals.date_from || ""}
                  dateTo={freshMeals.date_to || ""}
                  productsIdsArray={freshMeals.side_dishes || []}
                  timeSlotForDelivery={getTimeSlotForDelivery()}
                  setSelectedFreshMealsTime={setSelectedFreshMealsTime}
                />
              );
            }
            if (index == 4) {
              return (
                <Beverages
                  key={index}
                  setIsApiLoaderShowing={setIsApiLoaderShowing}
                  dateFrom={freshMeals.date_from || ""}
                  dateTo={freshMeals.date_to || ""}
                  productsIdsArray={freshMeals.desserts || []}
                  tabLabel="Snacks & desserts"
                  timeSlotForDelivery={getTimeSlotForDelivery()}
                  setSelectedFreshMealsTime={setSelectedFreshMealsTime}
                />
              );
            }
            if (index == 5) {
              return (
                <Beverages
                  key={index}
                  setIsApiLoaderShowing={setIsApiLoaderShowing}
                  dateFrom={freshMeals.date_from || ""}
                  dateTo={freshMeals.date_to || ""}
                  productsIdsArray={freshMeals.beverages || []}
                  tabLabel="Beverages"
                  timeSlotForDelivery={getTimeSlotForDelivery()}
                  setSelectedFreshMealsTime={setSelectedFreshMealsTime}
                />
              );
            }
          })}
        </ScrollableTabView>

        {showSwipeGuideNotification && (
          <ReAnimated.View style={[styles.swipeGestureGuideView, animatedStyles]}>
            <SwipePageGuideAlert></SwipePageGuideAlert>
          </ReAnimated.View>
        )}
      </View>
    </View>
  );
};

export default FreshMeals;
