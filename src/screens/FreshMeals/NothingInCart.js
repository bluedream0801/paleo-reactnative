import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import styles from "./NothingInCartStyles";
import { appColors, appImages } from "../../theme";
import { Text } from "../../components";
import FastImage from "react-native-fast-image";
import moment from "moment";
import Services from "../../services";
import AddMore from "./AddMore";

const { API } = Services;
const {
  green,
  black,
  lessDarkGray,
  accountSettingGray,
  dragShadow,
  blackOpacity,
  orderDarkGray,
  mealsGrey,
  addressGrey,
} = appColors;
import DeleteDayPopUp from "./DeleteDayPopUp";
import { useFocusEffect } from "@react-navigation/native";
import helpers from "../../helpers";
const {
  get_thumbnail,
  checkForTodayTomorrow,
  number_format,
  groupBy2,
  shortSlotName,
  should_meal_be_removed,
  hapticFeedback,
} = helpers;
import { IMAGE_URL } from "../../services/ApiConstants";
import { CUTOFF_TIME, TIMEZONE } from "../../common/constants";
import TimeSlot from "../PickupTimeSlot";
import { createDaysArray } from "../PickupTimeSlot";
import HowItWorksPopup from "./HowItWorksPopup";
import AppContext from "../../provider";
import DraggableFlatList from "react-native-draggable-flatlist";
import * as momenttz from 'moment-timezone';
const { delete_ic, right_arrow, clock_ic } = appImages;

const NothingInCart = (props) => {
  const { goToSpecial, navigation, specialBigItemsArray, timeSlotForDelivery, timeSlotForIndexDelivery } = props;

  const [showCartItem, setShowCartItem] = useState(false);
  const [showCartItemOneDay, setShowCartItemOneDay] = useState(false);
  const {
    setIsAnyPopupOpened,
    mealsCartData,
    cartData,
    setCartData,
    setMealsCartData,
    setIsAnyApiLoading,
    loginData,
  } = useContext(AppContext);
  
  if (loginData) {
    var { token, user_id } = loginData; 
  } else {
    var user_id = null;
    var token = null;
  }
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ordersDataArray, setOrdersDataArray] = useState([]);
  const [showAddressModalContainer, setShowAddressModalContainer] =
    useState(false);
  const [showHowWorksModal, setShowHowWorksModal] = useState(false);

  const [isBlueBoxVisible, setIsBlueBoxVisible] = useState(true);
  const [isAnyItemActive, setIsAnyItemActive] = useState(false);
  const [animationValue, setAnimationValue] = useState(new Animated.Value(1));
  const [objectState, setObjectState] = useState(0);

  const timeSlots = createDaysArray();

  const animationStart = () => {
    Animated.spring(animationValue, {
      toValue: 0.9,
      friction: 1.5,
      tension: 100,
      useNativeDriver: true,
    }).start();
    setObjectState(0);
  };

  const handlePressIn = () => {
    Animated.spring(animationValue, {
      toValue: 1.11,
      friction: 1.5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (mealsCartData) {
      returnSectionData();
    }
    if (mealsCartData) {
      if (mealsCartData.lines.length > 0) {
        setShowCartItem(true);
      } else {
        setShowCartItem(false);
      }
    } else {
      setShowCartItem(false);
    }
  }, [mealsCartData]);

  const getTimeSlotForIndexDelivery = (delivery_date, delivery_slot) => {
    console.log('delivery_slot check',delivery_slot)
    if (delivery_slot) {
      return "In cart for " + checkForTodayTomorrow(delivery_date,'') + ", " + shortSlotName(delivery_slot.name);
    } else {
      return "In cart for " + checkForTodayTomorrow(delivery_date,'');
    }
  };

  const returnSectionData = () => {
    const data = groupBy2(mealsCartData.lines, "delivery_date");
    const dataKeys = Object.keys(data);

    const checkBYOItem = (product) => {
      let shortTitle = product.ecom_short_title;
      let text = "";
      let customUmoName = '';
      if (product.name == 'BYO: Salad' || product.name == 'BYO: Plate') {
        shortTitle = product.name.replace('BYO: ', '');
        text = "Expand details";
        customUmoName = 'Build your own';
      }
      return {
        shortTitle,
        text,
        customUmoName
      }
    }

    let sections = [];
    if (dataKeys.length > 1) {
      let keyIndex = 0;
      let sectionIndex = 1;
      for (let j = 0; j < dataKeys.length; j++) {
        const itemObj = data[dataKeys[j]][0];
        const { delivery_date, delivery_slot_id, id } = itemObj;
        const date = moment(delivery_date)
          .format("DD,ddd,dddd,MM,MMMM,Do,MMM,YYYY")
          .toString()
          .split(",");
        sections.push({
          time: true,
          title: getTimeSlotForIndexDelivery(delivery_date, delivery_slot_id),
          adMore: false,
          borderBottomWidth: 1,
          key: keyIndex,
          section: sectionIndex,
          delivery_date: itemObj.delivery_date,
          id: id,
        });

        for (let index = 0; index < data[dataKeys[j]].length; index++) {
          keyIndex = keyIndex + 1;
          const itemObj = data[dataKeys[j]][index];
          const { product_id, amount, delivery_date, id, qty, uom_id } = itemObj;
          const imageUrl = IMAGE_URL + product_id.image;

          const {
            shortTitle,
            text,
            customUmoName
          } = checkBYOItem(product_id);

          sections.push({
            title: product_id.name,
            shortTitle: shortTitle,
            uomID: customUmoName || uom_id.name,
            text: text,
            image: imageUrl,
            price: amount,
            time: false,
            adMore: false,
            borderBottomWidth: 1,
            key: keyIndex,
            section: sectionIndex,
            delivery_date: delivery_date,
            delivery_slot_id: delivery_slot_id.id,
            id: id,
            qty: qty,
            product_id: product_id,
            expanded: false,
          });
          if (data[dataKeys[j]].length - 1 == index) {
            keyIndex = keyIndex + 1;
          }
        }
        sectionIndex = sectionIndex + 1;
      }
    }

    if (dataKeys.length == 1) {
      let keyIndex = 0;
      const itemObj = data[dataKeys[0]][0];
      const { delivery_date, delivery_slot_id, id } = itemObj;
      const date = moment(delivery_date)
        .format("DD,ddd,dddd,MM,MMMM,Do,MMM,YYYY")
        .toString()
        .split(",");
      sections.push({
        time: true,
        title:getTimeSlotForIndexDelivery(delivery_date, delivery_slot_id),
        adMore: false,
        borderBottomWidth: 1,
        key: 0,
        section: 1,
        delivery_date: itemObj.delivery_date,
        delivery_slot_id: delivery_slot_id.id,
        id: id,
      });

      for (let index = 0; index < data[dataKeys[0]].length; index++) {
        keyIndex = keyIndex + 1;
        const itemObj = data[dataKeys[0]][index];
        const { product_id, amount, delivery_date, id, qty, uom_id, delivery_slot_id } = itemObj;
        const imageUrl = IMAGE_URL + product_id.image;

        const {
          shortTitle,
          text,
          customUmoName
        } = checkBYOItem(product_id);

        sections.push({
          title: product_id.name,
          shortTitle: shortTitle,
          uomID: customUmoName || uom_id.name,
          text: text,
          image: imageUrl,
          price: amount,
          time: false,
          adMore: false,
          borderBottomWidth: 1,
          key: keyIndex,
          section: 2,
          delivery_date: delivery_date,
          delivery_slot_id: delivery_slot_id.id,
          id: id,
          qty: qty,
          product_id: product_id,
          expanded: false,
        });
      }
    }

    if (sections.length > 0) {
      setShowCartItem(true);
    }
    setOrdersDataArray(sections);
  };

  const onGotoSpecial = (imgIndex) => {
    goToSpecial(imgIndex);
  };

  const openHowItWorksModal = () => {
    setShowHowWorksModal(true);
  };

  const heading = () => {
    // if (isBlueBoxVisible) {
    return (
      <TouchableOpacity
        style={styles.whiteContainer}
        onPress={() => {
          setIsBlueBoxVisible(false);
          openHowItWorksModal();
        }}
      >
        <View style={styles.blueContainer}>
          <Text textAlign="center" color={accountSettingGray}>
            Fresh Meals must be ordered {"\n"} before 8pm for the next day.
          </Text>
        </View>
      </TouchableOpacity>
    );
    //}
  };  

  const getInnerObject = () => {
    let minObj = null;
    for (let index = 0; index < ordersDataArray.length; index++) {
      if (
        ordersDataArray[index].adMore &&
        ordersDataArray[index].section == section
      ) {
        minObj = ordersDataArray[index];
      }
    }
    return minObj;
  };

  const getItemsIdsOFDeleteDay = (date) => {
    const ids = [];
    for (let index = 0; index < mealsCartData.lines.length; index++) {
      if (mealsCartData.lines[index].delivery_date == date) {
        ids.push(mealsCartData.lines[index].id);
      }
    }
    return ids;
  };

  const renderListItem = ({ drag, index, isActive, item }) => {
    const obj = item;
    
    // console.log('obj',obj);
    // console.log('item',item);

    if (obj.adMore) {
      if (isAnyItemActive) {
        if (obj.title == "Add more for Tues, 21th") {
          return (
            <Text
              small
              color={orderDarkGray}
              textAlign={"center"}
              style={[
                styles.bottomText,
                {
                  marginBottom: index == 11 ? 30 : 0,
                },
              ]}
            >
              Menu item not available on this day
            </Text>
          );
        } else {
          if (item.section == isAnyItemActive.section) {
            return null;
          } else
            return (
              <View style={styles.moewToThis}>
                <Text small color={orderDarkGray} textAlign={"center"}>
                  Move to this day
                </Text>
              </View>
            );
        }
      } else if (!obj.show)
        return (
          <TouchableOpacity
            onPress={() => {
              onGotoSpecial(0);
            }}
          >
            <Text
              lineHeight={18.53}
              smallRegular
              color={green}
              textAlign={"center"}
              style={[
                styles.bottomText,
                {
                  marginBottom: index == 11 ? 30 : 0,
                },
              ]}
            >
              Add more for Wed, 21th
            </Text>
          </TouchableOpacity>
        );
      else return null;
    } else if (obj.time) {
      
      // Remove the entire day if it's in the past
      if (should_meal_be_removed(obj.delivery_date) == true) {
        const ids = getItemsIdsOFDeleteDay(obj.delivery_date);
        API.cart_delete_multi_lines(
          ids,
          setCartData,
          setMealsCartData,
          "meal",
          setIsAnyApiLoading,
          { user_id: user_id, token: token }
        );
      }
      
      return (
        <>
          {index > 0 && (
            <AddMore item={ordersDataArray[index-1]} onClick={onAddMore}/>
          )}
          <View
            style={[
              styles.textRow,
              { marginTop: index == 0 ? 14 : 21, marginBottom: 6 },
            ]}
          >
            <Text smallRegular color={orderDarkGray} lineHeight={18.53}>
              {obj.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // setShowAddressModal(true);
                // setIsAnyPopupOpened(true);
                // setShowAddressModalContainer(true);

                const ids = getItemsIdsOFDeleteDay(obj.delivery_date);

                API.cart_delete_multi_lines(
                  ids,
                  setCartData,
                  setMealsCartData,
                  "meal",
                  setIsAnyApiLoading,
                  { user_id: user_id, token: token }
                );
                hapticFeedback();
              }}
            >
              <Text small color={addressGrey}>
                Delete day
              </Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else
      return (
        <>
          <Animated.View
            style={[
              ,
              styles.itemContainerCell,
              {
                // borderBottomWidth:
                //   !ordersDataArray[index + 1].adMore &&
                //   !ordersDataArray[index + 1].time
                //     ? 1
                //     : 0,

                shadowColor: isActive ? dragShadow : "rgba(0, 0, 0, 0,1)",
                shadowOffset: { width: 0, height: isActive ? 0 : 0 },
                shadowOpacity: isActive ? 0.8 : 0,
                shadowRadius: isActive ? 14 : 0,
                elevation: isActive ? 5 : 0,
                transform: [
                  { scale: isActive ? animationValue : new Animated.Value(1) },
                ],
              },
            ]}
          >
            <TouchableOpacity
              //disabled={obj.text !== 'Expand details'}

              onPressIn={() => {
                handlePressIn();
              }}
              onPressOut={() => {
                animationStart();
              }}
              onLongPress={() => {
                obj.expanded = false;
                drag();
                setIsAnyItemActive(item);
                setOrdersDataArray([...ordersDataArray]);
              }}
              onPress={() => {
                if (obj.text == "Expand details") {
                  obj.expanded = !obj.expanded;
                  setOrdersDataArray([...ordersDataArray]);
                }
              }}
              style={[
                styles.itemCell,
                {
                  borderRadius: isActive ? 5 : 0,
                },
              ]}
            >
              <View style={styles.cellRowrow}>
                <View style={styles.imgContainerCell}>
                  <Image source={{ uri: obj.image }} style={styles.favouries} />
                </View>
                <View style={styles.textContainer}>
                  <Text color={accountSettingGray} noOfLines={2}>
                    <Text condensedBold minSmall color={accountSettingGray} style={{textTransform: 'uppercase'}}>
                      {(obj.qty > 1 ? `(${obj.qty}) ` : '') + obj.uomID + (obj.shortTitle ? ' | ' : '')}
                    </Text>
                    <Text minSmall color={accountSettingGray}>{obj.shortTitle}</Text>
                  </Text>
                  <View style={styles.dropDownRow}>
                    <Text
                      extSmall
                      noOfLines={1}
                      color={accountSettingGray}
                      style={styles.detailsText}
                    >
                      {obj.expanded && obj.text == "Expand details"
                        ? "Collapse details"
                        : obj.text}
                    </Text>

                    {obj.text == "Expand details" && (
                      <Image
                        source={right_arrow}
                        style={[
                          styles.smallArrow,
                          {
                            transform: obj.expanded
                              ? [{ rotate: "-90deg" }]
                              : [{ rotate: "90deg" }],
                          },
                        ]}
                      />
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.delRow}>
                <Text condensed color={black} style={styles.smallMargin}>
                  ฿{number_format(obj.price, "0,0")}
                </Text>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => {
                    API.cart_delete_line(
                      item.id,
                      setCartData,
                      setMealsCartData,
                      "meal",
                      { user_id: user_id, token: token }
                    );
                    hapticFeedback();
                  }}
                >
                  <Image source={delete_ic} style={styles.delImg} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            
            
            {obj.expanded &&
              obj.text == "Expand details" &&
              renderExpendedDetailsNew(obj.product_id)}
          </Animated.View>

          {index === ordersDataArray.length - 1 && (
            <AddMore item={item}  onClick={onAddMore} isLast/>
          )}
        </>

      );
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
  
  const renderCartItems = () => {
    return (
      <View style={{ flex: 1 }}>
        {!showCartItemOneDay && (
          <View style={styles.flex}>
            <DraggableFlatList
              withSpring={true}
              animationConfig={{}}
              style={{ flex: 1 }}
              extraData={[]}
              ListHeaderComponent={() => <View />}
              ListFooterComponent={() => <View />}
              activationDistance={10}
              showsVerticalScrollIndicator={false}
              data={ordersDataArray}
              onDragBegin={(index) => {
                hapticFeedback(false);
              }}
              renderItem={(obj) => {
                return renderListItem(obj);
              }}
              keyExtractor={(item, index) => `draggable-item-${item.key}`}
              onDragEnd={({ data, from, to }) => {
                setIsAnyItemActive(false);
                const array = Object.assign([], data);
                // array[1].title = 'hello'
                // const border = array[from].borderBottomWidth
                // array[from].borderBottomWidth = array[to].borderBottomWidth
                // array[to].borderBottomWidth = border
                if (ordersDataArray[from] && ordersDataArray[to]) {
                  API.meal_cart_update_delivery_date(
                    ordersDataArray[from].id,
                    ordersDataArray[to].delivery_date,
                    setMealsCartData,
                    setIsAnyApiLoading,
                    { user_id: user_id, token: token }
                  );
                  if (array[to]) {
                    array[from].delivery_date = array[to].delivery_date;

                    setOrdersDataArray(array);
                    // if (!array[to].time && !array[to].adMore) {
                    //   // for (let index = 0; index < array.length; index++) {
                    //   //   if (true) {
                    //   //     if (true) {
                    //   //       array.splice(index, 1);
                    //   //       array.splice(index - 1, 1);
                    //   //     }
                    //   //   }
                    //   // }
                    // }
                  }
                }
              }}
            />
          </View>
        )}
        {/* {showCartItemOneDay && (
          <View style={{ paddingHorizontal: 10 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              data={ordersDataArry1}
              style={{}}
              renderItem={({ item, index }) => renderListItem({ item, index })}
            />

            <Text
              small
              color={lessDarkGray}
              textAlign={'center'}
              style={styles.bottomText}
              lineHeight={16}
            >
              You can add Meal deliveries for than 1 day in the same cart!{'\n'}{' '}
              Just change the date to see the menu for different days.
            </Text>
          </View>
        )} */}
      </View>
    );
  };
  const renderSpecialsItems = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => onGotoSpecial(index)}
        style={{
          marginTop: index > 3 ? 4 : 0,
          marginRight: 2,
        }}
      >
        <FastImage
          source={{ uri: get_thumbnail(item.image, 256) }}
          style={[styles.mealImg, {}]}
        />
        <View style={styles.opacityView}></View>
      </TouchableOpacity>
    );
  };

  const renderTimings = () => {
    return (
      <View style={styles.marginContainer}>
        {showCartItem ? (
          <Text smallRegular color={orderDarkGray}>
            {"Add another meal for:"}
          </Text>
        ) : (
          <Text smallRegular color={orderDarkGray}>
            {"When to deliver your meals?"}
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.timeContainer,
            { height: showCartItem && !isBlueBoxVisible ? 50 : 70 },
          ]}
          onPress={() => {
            setShowModal(true);
          }}
        >
          <View style={styles.row}>
            <Image source={clock_ic} style={styles.clockImg} />
            <Text color={accountSettingGray} regular>
              Delivery on: {timeSlotForIndexDelivery}
            </Text>
          </View>

          <Image source={right_arrow} style={styles.arrowImg} />
        </TouchableOpacity>
      </View>
    );
  };

  // Used only for warning
  const checkIsPastCutOffTime = () => {
    let isPastCutOffTime = false;
    if (global.freshMealsTimeSlotNew) {
      const selectedDate = moment(global.freshMealsTimeSlotNew.completeDate);
      const today = momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD');
      const tomorrow = momenttz.tz('Asia/Bangkok').add(1, "days").format('YYYY-MM-DD');
      if ((selectedDate.isSameOrBefore(today, "day")) || (selectedDate.isSame(tomorrow, "day") && momenttz.tz('Asia/Bangkok').hour() >= CUTOFF_TIME)) {
        isPastCutOffTime = true;
      }
    }
    return isPastCutOffTime;
  };

  const onSelectTime = (obj) => {
    global.freshMealsTimeSlotNew = obj;
    onGotoSpecial(0);
  };

  const onAddMore = (item) => {
    const dateSlot = timeSlots.find((slot) => slot.completeDate === item.delivery_date);
    const timeSlot = dateSlot.slots.find((slot) => slot.id === item.delivery_slot_id);

    const slot = {
      day: dateSlot.day,
      time: timeSlot.name,
      shortDay: dateSlot.shortDay,
      shortDate: dateSlot.shortDate,
      completeDate: dateSlot.completeDate,
      slotId: timeSlot.id,
    }

    global.freshMealsTimeSlotNew = obj;
    onGotoSpecial(0);
  }

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true} style={{ flex: 1 }}>
        {checkIsPastCutOffTime() && heading()}

        {renderTimings()}

        {showCartItem ? (
          renderCartItems()
        ) : (
          <View>
            <View style={styles.nothing}>
              <TouchableOpacity
                onPress={() => {
                  setShowCartItem(!showCartItem);
                }}
              >
                <Text
                  condensedBold
                  largeRegularBetween
                  color={mealsGrey}
                  lineHeight={31}
                >
                  You haven’t added any Fresh Meals yet.
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowCartItem(!showCartItem);
                  setShowCartItemOneDay(true);
                }}
              >
                <Text
                  regular
                  color={addressGrey}
                  style={styles.topMargin}
                  lineHeight={21}
                >
                  They will appear here when you do.
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.white}
                onPress={() => onGotoSpecial(0)}
              >
                <Text small color={black}>
                  See Specials menu for {timeSlotForDelivery}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imgContainer}>
              <View style={styles.imagesRow}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  scrollEnabled={false}
                  keyExtractor={(item, index) => index.toString()}
                  data={specialBigItemsArray}
                  numColumns={4}
                  style={styles.listStyle}
                  renderItem={({ item, index }) =>
                    renderSpecialsItems(item, index)
                  }
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {!showCartItem && (
        <View style={styles.bottom}>
          <Text smallRegular color={addressGrey}>
            Questions about our Meals? See
          </Text>
          <TouchableOpacity
            onPress={() => openHowItWorksModal()}
            style={styles.underline}
          >
            <Text smallRegular color={addressGrey}>
              How it Works
            </Text>
          </TouchableOpacity>
          <Text smallRegular color={addressGrey}>
            .
          </Text>
        </View>
      )}

      {showAddressModalContainer && (
        <View style={styles.modalContain}>
          <DeleteDayPopUp
            heading={"Select address"}
            showModal={showAddressModal}
            setShowPrivacyModal={() => {
              setShowAddressModal(false);

              setTimeout(() => {
                setShowAddressModalContainer(false);
                setIsAnyPopupOpened(false);
              }, 250);
            }}
          />
        </View>
      )}

      <TimeSlot
        heading={"Choose delivery slot"}
        showModal={showModal}
        setSelectTimeSlot={(obj) => onSelectTime(obj)}
        timeSlots={timeSlots}
        setShowPrivacyModal={() => {
          setShowModal(false);
          //  setIsAnyPopupOpened(false)
          // setTimeout(() => {
          //    setIsAnyPopupOpened(false)
          // }, 0)
        }}
        selectedSection={'fresh_meals'}
      />

      <Modal
        testID={"modal"}
        isVisible={showHowWorksModal}
        backdropColor={blackOpacity}
        style={{ margin: 0 }}
        onSwipeComplete={() => {
          setShowHowWorksModal(false);
        }}
        useNativeDriverForBackdrop
        swipeDirection={["down"]}
      >
        <HowItWorksPopup
          navigation={navigation}
          freshMeals={true}
          heading={"Choose delivery slot"}
          showModal={showHowWorksModal}
          setShowPrivacyModal={() => {
            setShowHowWorksModal(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default NothingInCart;
