import styles from "./Styles";
import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import { View, Image, TouchableOpacity, ScrollView, Pressable, AppState} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import analytics from '@react-native-firebase/analytics';
import provider from "../../firebase/ProductsProvider";
import Services from "../../services";
import FastImage from "react-native-fast-image";
import PickupTimeSlot from "../PickupTimeSlot";
import { createDaysArray } from "../PickupTimeSlot";
const { API } = Services;
import {nf_state} from "../../services/Api.js";
const {
  getHomeScreenData,
  getProductsData,
} = provider;
import { appColors, appImages } from "../../theme";
import { Text } from "../../components/";
import { TIMEZONE, CUTOFF_TIME} from '../../common/constants';
import * as momenttz from 'moment-timezone';
import Video from 'react-native-video';

const {
  shop_category_ic,
  specials_ic,
  last_order_ic,
  thik_search_ic,
  calander_ic,
  right_arrow,
  promise1,
  promise2,
  promise3,
  promise4,
} = appImages;
const { textDarkGray, darkGray, black, accountSettingGray, white, maroonRed } =
  appColors;
import { CommonActions } from "@react-navigation/native";
import NewItems from "./NewItems";
import AppContext from "../../provider";
import helpers from "../../helpers";
import LINE from "../../helpers/line";
import moment from "moment";
import LinkLINEAccountPopup from "../LinkLINEAccount/LinkLINEAccountPopup";

const {
  number_format,
  checkForTodayTomorrow,
  get_thumbnail,
  getCartType,
  groupBy2,
  convertDeliveryDateToHomepageDisplayDate,
  shortSlotName,
} = helpers;

const PromisesArray = [
  {
    title: "No antibiotics or growth hormones.",
    details:
      "We cook with and carry only 100% grass-\nfed meats, free-range poultry, and wild-\ncaught fish.",
    image: promise1,
  },
  {
    title: "No cheap, highly-processed\n“vegetable” or seed oils. ",
    details:
      "We cook with extra virgin olive\noil, unrefined coconut oil, grass-fed\nbutter, or animal fat.",
    image: promise2,
  },
  {
    title: "No weird stuff, period.",
    details:
      "Know your food! We skip all the artificial ingredients and additives in modern processed food - if you don’t recognize an ingredient, your body probably doesn’t either.",
    image: promise3,
  },
  {
    title: "Most important: tastes great! ",
    details:
      "When you start with great quality\ningredients, it’s hard to go wrong.",
    image: promise4,
  },
];

const Home = (props) => {
  const { navigation, route } = props;

  const {
    setIsApiLoaderShowing,
    setIsNotificationShowing,
    setBarStyle,

    mealsCartData,
    cartData,
    setMealsCartData,
    updateCartId,
    setCartData,

    homeDataObj,
    setHomeDataObj,

    // refVoucher,
    // refId,

    loginData,
    setLoginData,
    userDataArray
  } = useContext(AppContext);

  // console.log('nf_state',nf_state);

  const [showModal, setShowModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showLINELinkPopup, setShowLINELinkPopup] = useState(false);
  const cartDataRef = useRef(cartData);
  const updateTimeSlotForDeliveryRef = useRef();

  const scrollRef = useRef();

  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
    var { first_name, create_time, receivable_credit, line_user_id, line_popup_showed } = accountInfo.contact_id;
  } else {
    var user_id = null;
    var token = null;
  }

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    (async () => {
      if (loginData) {
        const askLINEAccountLinking = !line_user_id && (line_popup_showed == false || line_popup_showed == null) &&  (moment(momenttz.tz('Asia/Bangkok').format()).diff(moment(create_time), 'hours') > 168);
        console.log('askLINEAccountLinking', askLINEAccountLinking,line_user_id,line_popup_showed, moment(momenttz.tz('Asia/Bangkok').format()).diff(moment(create_time), 'hours'));
        if (askLINEAccountLinking !== showLINELinkPopup) {
          // Only show the popup once ever
          var vals = {}
          vals['line_popup_showed'] = true;
          await API.execute('contact', 'write', [[loginData.accountInfo.contact_id.id], vals], {}, () => {}, {token: token, user_id: user_id})
          .catch((err) => {
            alert('Error: ' + err)
          })
          setShowLINELinkPopup(askLINEAccountLinking);
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
          await API.check_latest_carts(accountInfo.contact_id.id, setCartData, updateCartId,  setMealsCartData, 'normal', { token, user_id },'grocery_initial_cart_load');

          // Added for checking if the users receivable credit has changed - We might be able to remove it - Test
          var users_receivabile_credit = await getUsersReceivableCredit();
          if (users_receivabile_credit && users_receivabile_credit[0]) {
            console.log('Credits comparison',users_receivabile_credit[0].contact_id.receivable_credit, receivable_credit)
            if (users_receivabile_credit[0].contact_id.receivable_credit != receivable_credit) {
              getUserData();
            } else {
              console.log('User credit has not changed');
            }
          }

          // Get order history for displaying upcoming orders
          getOrderHistory();
        } else {
          console.log('User not logged in - just checking his cart');
          await API.check_latest_carts_no_login(setCartData, updateCartId, setMealsCartData, 'normal',  { token, user_id },'grocery_initial_cart_load');
        }
      }
      fetchData();
    }, [])
  );

  useFocusEffect(useCallback(() => {
    setBarStyle('light-content');
    return () => {
      setBarStyle('dark-content');
    }
  }, []));

  useEffect(() => {
    if (homeDataObj == null) {
      console.log('Getting initial Homepage Data');
      getHomepageData();
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [route.params?.resetScrollPosition]);

  useFocusEffect(
    useCallback(() => {
      updateTimeSlotForDelivery();
      updateTimeSlotForDeliveryRef.current = updateTimeSlotForDelivery;
    }, [mealsCartData, cartData])
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

  useEffect(() => {
    cartDataRef.current = cartData;
  }, [cartData]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/background/) && nextAppState === "active") { // inactive|
        // alert("App has come beocome active at "+ momenttz.tz('Asia/Bangkok').format("HH:mm:ss") +". Do something!");
        console.log('Check Cart Data',cartDataRef.current); // THIS IS NULL HERE FOR WHATEVER REASON
        updateTimeSlotForDeliveryRef.current();
      } // else {
        // alert("App has gone to the background!");
      // }
      appState.current = nextAppState;
      console.log("AppState Current State", momenttz.tz('Asia/Bangkok').format("HH:mm:ss"), appState.current);
      if (appState.current === 'active') {
        analytics().logEvent('open_app');
      }
    });
    return () => {
      subscription?.remove();
    };
  }, []);

  // Maybe optimize to only get the upcoming orders directly from the API and not have to further sort them here
  const getOrderHistory = async () => {
    if (loginData) {
      try {
        var res = await API.execute(
          "sale.order",
          "search_read_path",
          [
            [
              ["contact_id", "=", accountInfo.contact_id.id],
              ["state", "=", "paid"],
              ["ecom_state", "in", ["wait_delivery","wait_ship"]]
            ],
            [
              "date",
              "number",
              "amount_total",
              "plr_use_credit_amount",
              "ecom_state",
              "state",
              "plr_order_type",
              "due_date",
              "delivery_orders.state",
              "delivery_orders.due_date",
              "delivery_orders.delivered_time",
              "delivery_orders.time_delivered",
              "delivery_orders.slot_id.name",
            ],
          ],
          {
            order: "date desc",
          },
          setIsApiLoaderShowing,
          { token, user_id }
        );
        if (res.length > 0) {
          // alert('da');
          console.log("Upcoming orders", res)
          setOrderHistory(res);
        }
      } catch (err) {
        console.log("err", err);
      }
    }
  };

  const getHomepageData = async () => {

    const currentDate = momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD');
    const homeScreenDataArray = await getHomeScreenData(setIsApiLoaderShowing, currentDate);
    console.log('homeScreenDataArray',homeScreenDataArray);

    // Check if the user is a first time user
    if (loginData) {
      var isFirstTimeUser = moment(momenttz.tz('Asia/Bangkok').format()).diff(moment(create_time), 'hours') <= 24;
    } else {
      var isFirstTimeUser = true;
    }
    console.log('isFirstTimeUser',isFirstTimeUser);

    // Retrieving the correct AppPeriod to show to user (first time or specific interval)
    let appPeriodIndex = homeScreenDataArray.findIndex((meal) => {
      const { date_from, date_to, first_time } = (meal || [])[1] || {};
      if (isFirstTimeUser) {
        return first_time;
      } else {
        return ((currentDate >= date_from && currentDate <= date_to) &&  (first_time != true));
      }
    });
    if (appPeriodIndex < 0) appPeriodIndex = homeScreenDataArray.length - 1;
    const appPeriod = homeScreenDataArray[appPeriodIndex];

    // If we have a period to show
    if (appPeriod && appPeriod.length) {
      const [idsArray, groupIdsArray] = [...Array(8).keys()].reduce((result, idx) => {
        const id = appPeriod[1][`feat_product${idx+1}_id`];
        if (id) {
          result[0].push(String(id));
        }
        const groupId = appPeriod[1][`popu_group${idx+1}_id`];
        if (groupId) {
          result[1].push(String(groupId));
        }
        return result;
      }, [[], []]);

      let productGroupArray = global.categoriesArray;

      // Retrieving the Popular Categories
      const popularGroups = groupIdsArray.map((id) => {
        const groupData = productGroupArray.find((productGroup) => productGroup[0] == id);
        if (groupData) {
          return {
            id,
            image: groupData[1].image,
            text: groupData[1].name,
          };
        } else {
          return { id };
        }
      });

      // Retrieving the Featured Products
      // Make sure there are no problems with featured products rendering
      let featuredProductsData = await getProductsData(idsArray, () => {}, true);
      // let featuredProductsData = await getProductsData(idsArray, setIsApiLoaderShowing, true);
      const featuredProductsDataArray = [];
      for (let index = 0; index < featuredProductsData.length; index++) {
        featuredProductsDataArray.push({
          ...featuredProductsData[index],
          quantity: 0,
        });
      }
      
      console.log('popularGroups',popularGroups);

      if (appPeriod[1].feat_headline) {
        setHomeDataObj({
          ...appPeriod[1],
          feat_products: featuredProductsDataArray,
          popu_groups: popularGroups,
        });
      }
    }
  };

  const renderHeader = () => {

    var selectedDateSlotString = getTimeSlotForDeliveryDisplay();

    return (
      <View style={styles.headerContainer}>
        <View style={styles.searchRow}>
          {(loginData) ?
            (
              <Text condensedBold color={white} largeRegular>
                {"Hello, " + first_name + "."}
              </Text>
            )
            :
            (
              <Text condensedBold color={white} largeRegular>
                {"Hi there!"}
              </Text>
            )
          }
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Search");
            }}
          >
            <Image source={thik_search_ic} style={styles.searchIc} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.time}
          onPress={() => {
            setShowModal(true);
          }}
        >
          <Image source={calander_ic} style={styles.calanderIc} />
          <Text color={accountSettingGray} smallRegular>
            Shopping for:{" "}
          </Text>
          <Text color={accountSettingGray} smallRegular bold>
            {selectedDateSlotString}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Review this function later on ... logic is very messy.
  const renderUpComings = () => {
    if (orderHistory.length >0) {
      const [currentDate, currentTime] = momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD,hha').split(',');
      const getScheduledTime = (deliveryOrder) => {
        let time = '';
        if (deliveryOrder.slot_id && deliveryOrder.slot_id.name) {
          time = ((deliveryOrder.slot_id.name || '').split('-')[0] || '').trim();
        }
        return [deliveryOrder.delivered_time || deliveryOrder.time_delivered || deliveryOrder.due_date, time];
      }

      const getSoonestOrderTime = (order) => {
        if (!(order.delivery_orders || []).length) {
          return [moment(order.date || order.due_date).format('YYYY-MM-DD'), ''];
        }
        const scheduledOrders = order.delivery_orders.filter(deliveryOrder => {
          return !['delivered', 'canceled'].includes(deliveryOrder.state);
        });
        if (!scheduledOrders.length) {
          return [moment(order.date || order.due_date).format('YYYY-MM-DD'), ''];
        } else {
          // find the soonest time
          let [soonestDate, soonestTime] = getScheduledTime(scheduledOrders[0]);
          for (let deliveryOrder of scheduledOrders) {
            const [scheduledDeliveryDate, scheduledDeliveryTime] = getScheduledTime(deliveryOrder);
            if (scheduledDeliveryDate < soonestDate || (scheduledDeliveryDate == soonestDate && soonestTime > scheduledDeliveryTime)) {
              soonestDate = scheduledDeliveryDate;
              soonestTime = scheduledDeliveryTime;
            }
          }
          return [soonestDate, soonestTime];
        }
      }

      let upcomingOrders = orders.filter((order) => {
        const [orderDate, orderTime] = getSoonestOrderTime(order);
        if ((orderDate > currentDate || (orderDate == currentDate && orderTime >= currentTime)) && !['canceled', 'done'].includes(order.ecom_state)) {
          return true;
        }
        return false;
      });

      if (upcomingOrders.length) {
        let soonestOrder = upcomingOrders[0];
        let [soonestOrderDate, soonestOrderTime] = getSoonestOrderTime(upcomingOrders[0]);
        upcomingOrders.forEach((order) => {
          const [deliveryDate, deliveryTime] = getSoonestOrderTime(order);
          if (deliveryDate < soonestOrderDate || (deliveryDate == soonestOrderDate && deliveryTime < soonestOrderTime)) {
            soonestOrder = order;
            soonestOrderDate = deliveryDate;
            soonestOrderTime = deliveryTime;
          }
        })
        return (
          <TouchableOpacity
            style={styles.upcoming}
            onPress={() => {
              navigation.navigate("MyOrders");
            }}
          >
            <View>
              <Text color={textDarkGray} small bold lineHeight={16}>
                UPCOMING DELIVERIES
              </Text>
              <Text
                color={accountSettingGray}
                lineHeight={20}
                style={styles.todayText}
                bold
              >
                {moment(soonestOrderDate).format("ddd, D MMMM").toString()}
                {(soonestOrder.delivery_orders && soonestOrder.delivery_orders.length > 0) &&
                  <>
                    {", " + shortSlotName(soonestOrder.delivery_orders[0].slot_id.name)}
                  </>
                }
              </Text>
            </View>

            <View style={styles.arrowRow}>
              <Text
                color={accountSettingGray}
                condensed
                largeRegular
                lineHeight={20.61}
              >
                ฿{soonestOrder.amount_total}
              </Text>

              <Image source={right_arrow} style={styles.arrowRight} />
            </View>
          </TouchableOpacity>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }

  };

  const renderCredit = () => {
    return (
      <View style={styles.creditContainer}>
        {(loginData) &&
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PaleoWallet");
            }}
          >
            <Text color={textDarkGray} small bold lineHeight={16}>
              PALEO CREDIT:
              <Text color={accountSettingGray} condensed regular lineHeight={16}>
                {" "}
                ฿{number_format(Math.floor(receivable_credit ? receivable_credit : 0), "0,0")}
              </Text>
            </Text>
          </TouchableOpacity>
        }
        <TouchableOpacity
          style={[styles.creditRow, styles.creditFirstRow]}
          onPress={() => {
            analytics().logEvent('home_click_shoplastorder');
            navigation.navigate("Favorites", { selectTab: "reorder" });
          }}
        >
          <View style={styles.smallRow}>
            <Image source={last_order_ic} style={styles.lastOrderImg} />
            <Text color={accountSettingGray} regular>
              Shop your last order
            </Text>
          </View>
          <Image source={right_arrow} style={styles.arrowRight} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            analytics().logEvent('home_click_shopcategory');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  { name: "MarketStack" },
                  {
                    name: "Market",
                  },
                ],
              })
            );
            navigation.reset({
              index: 0,
              routes: [{ name: "MarketStack" }],
            });
            navigation.navigate("Market");
          }}
          style={styles.creditRow}
        >
          <View style={styles.smallRow}>
            <Image source={shop_category_ic} style={styles.lastOrderImg} />
            <Text color={accountSettingGray} regular>
              Shop by category
            </Text>
          </View>
          <Image source={right_arrow} style={styles.arrowRight} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            analytics().logEvent('home_click_seefreshmeals');
            navigation.navigate('FreshMeals', { fromHome: true, BYO: false });}
          }
          style={[styles.creditRow, styles.creditLattRow]}
        >
          <View style={styles.smallRow}>
            <Image source={specials_ic} style={styles.lastOrderImg} />
            <Text color={accountSettingGray} regular>
              See the Fresh Meals menu
            </Text>
          </View>
          <Image source={right_arrow} style={[styles.arrowRight]} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderFoodPromise = () => {
    return (
      <View>
        <Text minTitle color={black} style={styles.promiseText}>
          <Text condensedBold minTitle color={black}>Our</Text>
          <Text
            futuraPassata
            minTitle
            color={maroonRed}
            style={styles.realText}
          >
            {" "}
            REAL FOOD{" "}
          </Text>
          <Text condensedBold minTitle color={black}>promise to you:</Text>
        </Text>

        <Text
          regular
          color={darkGray}
          style={styles.paleoText}
          lineHeight={21.18}
        >
          <Text regular color={darkGray} bold lineHeight={21.18}>
            Paleo
          </Text>{" "}
          just means we prioritize time-tested, {"\n"}unprocessed foods. Your
          grandmother would{"\n"}recognize this:
        </Text>
        <View style={styles.promiseSection}>
          {PromisesArray.map((obj, i) => {
            return (
              <View style={styles.promiseRow} key={i}>
                {i !== 3 && (
                  <Image
                    source={obj.image}
                    style={[styles.promiseImg, { marginTop: i == 0 ? -10 : 0 }]}
                  ></Image>
                )}

                {i == 3 && (
                  <Image
                    source={obj.image}
                    style={[styles.promiseImg, { marginTop: -7 }]}
                  ></Image>
                )}

                <View style={styles.promiseInner}>
                  <Text bold color={darkGray} lineHeight={20} noOfLines={2}>
                    {obj.title}
                  </Text>
                  <Text
                    extSmall
                    noOfLines={5}
                    color={darkGray}
                    lineHeight={17.5}
                    style={{ flex: 1 }}
                  >
                    {obj.details}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable style={styles.whiteContainer} onPress={() => {
          navigation.dispatch(
            CommonActions.navigate(
              'AccountStack', {
              screen: 'AboutUs'
            })
          );
        }}>
          <Text color={black} regular>
            {" "}
            More about our food sourcing standards
          </Text>
        </Pressable>
      </View>
    );
  };

  // Review all functions bellow
  // GET SLOTS FUNCTIONS
  const getSlotsForDelivery = () => {

    var cartType = getCartType(cartData, mealsCartData);
    let res = [];
    const dateFormat = "DD,ddd,dddd,MM,MMMM,ddd,Do";
    var data = [];

    var slots_source = 'server';
    if (cartType=='meal') {
      var number_of_meal_delivery_days = Object.keys(mealsCartData.ship_addresses_days).length;
      if (number_of_meal_delivery_days == 1) {
        slots_source = 'local';
      }
    }

    if (slots_source == 'server') {
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

      console.log('Createing Slots on the Server'); // ,data

    } else {

      data = createDaysArray();
      console.log('Createing Slots Locally'); // ,data

    }

    return data;

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
          }

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
        }

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
        }
      }
    }

  };

  const getTimeSlotForDeliveryDisplay = () => {

    // console.log('GETTING TIME SLOT');

    var dateString = 'Please select';

    // Reviewed Logic
    const slots = getSlotsForDelivery();
    var cartType = getCartType(cartData, mealsCartData);

    // If we have a grocery cart only (then it manages the grocery cart date)  (or a combined 1 day worth of meals / or 1 days worth of meals)
    // If we have 1 days worth of meals, then it manages the meals date
    if (cartData && (cartType=='grocery' || cartType=='combined')) {
      // If we have a grocery cart with a date/slot on them
      if (cartData.delivery_date && cartData.delivery_slot_id) {

        // console.log('Display Scenario 1');
        let deliveryDate = cartData.delivery_date;
        dateString = convertDeliveryDateToHomepageDisplayDate(deliveryDate);

      }

    } else if (cartType=='meal') {

      // console.log('Display Scenario 2');

      let deliveryDate = "";
      let deliverySlotId = "";

      const multiDeliveries = groupBy2( mealsCartData ? mealsCartData.lines : [], "delivery_date");
      const multiDeliveriesLength = Object.keys(multiDeliveries).length;

      if (multiDeliveriesLength == 1) {

        deliveryDate = mealsCartData.lines[0].delivery_date;
        dateString = convertDeliveryDateToHomepageDisplayDate(deliveryDate);

      } else if (cartData) {

        if (cartData.delivery_date && cartData.delivery_slot_id) {

          // console.log('Display Scenario 3');
          let deliveryDate = cartData.delivery_date;
          dateString = convertDeliveryDateToHomepageDisplayDate(deliveryDate);

        }

      }

    }  else if (cartData) {

      if (cartData.delivery_date && cartData.delivery_slot_id) {

        // console.log('Display Scenario 4');
        let deliveryDate = cartData.delivery_date;
        dateString = convertDeliveryDateToHomepageDisplayDate(deliveryDate);

      }

    }

    return dateString;

  };

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

  const onchange_time_slot = (date, slotId) => {

    console.log('TIMESLOT CHANGED');

    var cartType = getCartType(cartData, mealsCartData);
    if (cartType == null) {
      cartType = "grocery";
    }
    var isSingleDay = isSingleDayDelivery();

    var slot_id = parseInt(slotId);
    var vals = {
      delivery_date: date,
      delivery_slot_id: slot_id,
    };

    // Don't load the first cart if we are doing a second operation on the server
    var load_cart = 'yes';
    if (isSingleDay == true) {
      load_cart = 'no';
    }

    API.grocery_cart_write(
      vals,
      setMealsCartData,
      setCartData,
      cartType,
      load_cart,
      { token, user_id },
      'grocery_slot_change_app'
    );

    if (isSingleDay == true) {

      const oldDate = mealsCartData.lines[0].delivery_date;
      API.meal_cart_update_delivery(
        oldDate,
        vals,
        setMealsCartData,
        setCartData,
        { token, user_id },
        cartType,
        'yes',
        'meal_cart_update_delivery_app'
      );
    }

  };

  console.log('RERENDER Home.js');

  if (global.freshMealsTimeSlotNew) {
    console.log('freshMealsTimeSlot check',global.freshMealsTimeSlotNew);
  }
  // console.log('Moment tz currentTime Home', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'), momenttz.tz('Asia/Bangkok').hour(), momenttz.tz('Asia/Bangkok'), momenttz.tz('Asia/Bangkok').format(), momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD"), momenttz.tz('Asia/Bangkok').format("H"), momenttz.tz('Asia/Bangkok').add(1, "days").format("YYYY-MM-DD"), momenttz.tz('Asia/Bangkok').add(1, "days"), momenttz.tz('Asia/Bangkok').add(1, "days").format())
  // console.log('Moment tz currentTime Home', momenttz.tz('Asia/Bangkok').hour(), momenttz.tz('Asia/Bangkok').format(), momenttz.tz('Asia/Bangkok').format("H"))
  /*
  if (refVoucher) {
    console.log('we have refVoucher' + refVoucher);
  } else {
    console.log('we dont have a refVoucher');
  }

  if (refId) {
    console.log('we have refId' + refId);
  } else {
    console.log('we dont have a refId');
  }
  */

  console.log('Testing cartId/mealsCartId as a global variable', global.cartId, global.mealsCartId);
  console.log('Checking cart', cartData);

  // console.log('Testing categories as global variable',global.categoriesArray);


  return (
    <View style={styles.container}>
      {renderHeader()}
      {/* <Video source={{uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}} style={{height: 200, width: '100%', backgroundColor: 'green'}}
        controls={true}>
      </Video> */}
      <View style={styles.body}>
        <ScrollView
          ref={scrollRef}
          >
          {renderUpComings()}
          {renderCredit()}
          {homeDataObj && (
            <FastImage
              style={styles.largeImg}
              source={{ uri: get_thumbnail(homeDataObj.prom_image) }}
            />
          )}
          {homeDataObj && (
            <NewItems
              homeDataObj={homeDataObj}
              navigation={navigation}
            />
          )}

          {renderFoodPromise()}
        </ScrollView>
      </View>

      {(loginData) &&
        <LinkLINEAccountPopup showPopup={showLINELinkPopup} setShowPopup={setShowLINELinkPopup} loginData={loginData} setLoginData={setLoginData} popupType={'link_account'}/>
      }

      {showModal && (
        <PickupTimeSlot
          freshMeals={true}
          fromCart={false}
          mealsCartData={mealsCartData}
          cartData={cartData}
          cartType={getCartType(cartData, mealsCartData)}
          timeSlots={getSlotsForDelivery()}
          splitTheDelivery={() => {}}
          isSingleDay={isSingleDayDelivery()}
          heading={"Delivery times"}
          defaultDate={""}
          selectedSection={'none'}
          showModal={showModal}
          setSelectTimeSlot={(obj) => {
            global.freshMealsTimeSlotNew = obj;
            onchange_time_slot(obj.completeDate, obj.slotId);
          }}
          setShowPrivacyModal={() => {
            setShowModal(false);
          }}
        />
      )}
    </View>
  );
};

export default Home;