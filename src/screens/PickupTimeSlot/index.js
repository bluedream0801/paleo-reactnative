import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./Styles";
import { appImages, appColors } from "../../theme";
import { Text } from "../../components/";
import Modal from "react-native-modal";
import moment from "moment";
import AppContext from "../../provider";
import { TIMEZONE, CUTOFF_TIME } from '../../common/constants';
import { useFocusEffect } from "@react-navigation/native";
import * as momenttz from 'moment-timezone';

const {
  white,
  slotGrey,
  darkGrey,
  accountSettingGray,
  dateGrey,
  blackOpacity,
  addressGrey,
  black, 
} = appColors;

const { white_tick, fresh_meals_ic, split_img } = appImages;

let intervals = [
  { isSelected: false, name: "10am-12pm", id: 3, state:'avail' },
  { isSelected: false, name: "12pm-2pm", id: 4, state:'avail' },
  { isSelected: false, name: "2pm-4pm", id: 5, state:'avail' },
  { isSelected: false, name: "4pm-6pm", id: 6, state:'avail' },
  { isSelected: false, name: "6pm-8pm", id: 7, state:'avail' },
];

export const createDaysArray = () => {
  const now = momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD");
  const nowHours = momenttz.tz('Asia/Bangkok').hour();

  var start_with_day = 1;
  if (nowHours < CUTOFF_TIME) {
    var start_with_day = 1;
  } else {
    var start_with_day = 2;
  }
  const dateFormate = "DD,ddd,dddd,MM,MMMM,ddd,Do";
  var comps = [];
  for (var weekday = start_with_day; weekday < 8; weekday++) {
    var pretty_date = "Tomorrow";
    // Skip Sundays
    var week_day_name = moment(now).add(weekday, "days").format("ddd");      
    if (weekday != 1) {
      var pretty_date = moment(now).add(weekday, "days").format("dddd");
    }
    var formatted_date = moment(now).add(weekday, "days").format("YYYY-MM-DD");

    const timeDay = moment(now).add(weekday, "days").format(dateFormate).toString().split(",");

    if (week_day_name != "Sun") {
      if (formatted_date != "2023-12-16" && formatted_date != "2023-12-29" && formatted_date != "2023-12-30" && formatted_date != "2023-12-31" && formatted_date != "2024-01-01" && formatted_date != "2024-01-02") {
        //  comps.push(pretty_date)
        var current_interval = intervals;
        // console.log('Current Week Day',week_day_name);
        if (week_day_name == "Sat") {
          current_interval = [
            { isSelected: false, name: "10am-12pm", id: 3, state:'avail' },
            { isSelected: false, name: "12pm-2pm", id: 4, state:'avail' },
            { isSelected: false, name: "2pm-4pm", id: 5, state:'avail' },
            { isSelected: false, name: "4pm-6pm", id: 6, state:'avail' },
          ];
        }
        
        comps.push({
          day: pretty_date,
          slots: current_interval,
          shortDay: timeDay[1],
          shortDate: timeDay[6],
          combineDate: timeDay[4] + " " + timeDay[0],
          completeDate: moment(now).add(weekday, "days").format("YYYY-MM-DD"),
          isSelected: false,
        });
      }
    }
  }
  // console.log('comps',comps);
  return comps;
    
};

const TimeSlot = (props) => {
  const {
    setShowPrivacyModal,
    setSelectTimeSlot,
    showModal,
    heading,
    freshMeals,
    fromCart,
    isSingleDay,
    splitTheDelivery,
    
    // Used only on Cart/Homepage and Market Selector
    timeSlots,
    mealsCartData,
    defaultDate,
    cartType,
    cartData,
    selectedSection,
    isSingleDayDelivery
  } = props;

  const [daysList, setDaysList] = useState([]); // JSON.parse(JSON.stringify(timeSlots))
  
  useFocusEffect(
    React.useCallback(() => {
      // console.log('TIMESLOTS CHECK', timeSlots);
      setDaysList(JSON.parse(JSON.stringify(timeSlots)));
    }, [timeSlots])
  );
  
  const setSelectSlotObject = (obj) => {
    setDaysList(JSON.parse(JSON.stringify(timeSlots))); // This should be reviewed as it creates an unnecesary render
    setSelectTimeSlot(obj);
    setShowPrivacyModal();
  };

  const selectDay = (i) => {
    const array = Object.assign([], daysList);
    for (let index = 0; index < array.length; index++) {
      if (i == index) {
        array[index].isSelected = !array[index].isSelected;
      } else {
        array[index].isSelected = false;
      }
    }
    setDaysList(array);
  };

  const selectSlot = (i, j) => {
    const array = Object.assign([], daysList);
    const slots = Object.assign([], array[i].slots);
    for (let index = 0; index < slots.length; index++) {
      if (j == index) {
        slots[index].isSelected = !slots[index].isSelected;
        if (slots[index].isSelected) {
          setSelectSlotObject({
            day: array[i].day,
            time: slots[index].name,
            shortDay: array[i].shortDay,
            shortDate: array[i].shortDate,
            completeDate: array[i].completeDate,
            slotId: slots[index].id,
          });
        }
      } else {
        slots[index].isSelected = false;
      }
    }
    //setDaysList(array)
  };
  
  /* Conditionals */
  const checkMealsNotifications = (date) => {
    if (cartType == "meal" || cartType =="combined") {
      if (selectedSection=="meal" || (fromCart== false && isSingleDay == true)) {
        // If we come from the Homepage or the Market we set up the default date here
        var MealSelectedDate = defaultDate;
        if (fromCart== false && isSingleDay == true) {
          var MealSelectedDate = mealsCartData.lines[0].delivery_date;
        }
        
        var order_by_date = {};
        mealsCartData.lines.forEach((l) => {
          var order = order_by_date[l.delivery_date];
          if (!order) {
            order = { lines: [] };
            order_by_date[l.delivery_date] = order;
          }
          order.lines.push(l);
        });
        var delivery_dates = Object.keys(order_by_date);
        delivery_dates.sort();

        var display_date_notification = false;

        var week_day = moment(MealSelectedDate).format("dddd");
        var current_week_day = moment(date).format("dddd");

        var slotDate = moment(date).format("YYYY-MM-DD");
        const differ = moment(momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD")).diff(slotDate);
        if (differ > 0) {
          display_date_notification = true;
        }
        // console.log('Check dates ',fromCart, isSingleDay, cartType, current_week_day,week_day);
        if (
          ((current_week_day == "Monday" ||
            current_week_day == "Tuesday" ||
            current_week_day == "Wednesday") &&
            (week_day == "Thursday" ||
              week_day == "Friday" ||
              week_day == "Saturday")) ||
          ((current_week_day == "Thursday" ||
            current_week_day == "Friday" ||
            current_week_day == "Saturday") &&
            (week_day == "Monday" ||
              week_day == "Tuesday" ||
              week_day == "Wednesday"))
        ) {
          display_date_notification = true;
        }
          
        var same_week = moment(date).isSame(MealSelectedDate, "week");
        if (same_week == false) {
          display_date_notification = true;
        }
        // console.log('display_date_notification',display_date_notification);
        return display_date_notification;
      }
    }

    // if (week_day){
    //   return true;
    // }
    if (mealsCartData && cartType == "grocery") {
      const week_day = moment(date).format("dddd");
      if (week_day == "Sunday") {
        return true;
      }

      return false;
    }

    return false;
  };
  
  const hasMTO = useMemo(() => {
    if (timeSlots && timeSlots.length > 0) {
      for (let i = 0; i < timeSlots.length; i++) {
        if (/disabled-mto/.test(timeSlots[i].status)) {
          return true;
        }
      }
    }
    return false;
  }, [timeSlots]);

  const checkTomorrowBefore8 = (date) => {
    if (cartType !== 'meal' && !hasMTO) return false;

    const currentTime = moment(momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD"));
    const tomorrowTime = moment(momenttz.tz('Asia/Bangkok').add(1, "days").format('YYYY-MM-DD'));
    if (
      tomorrowTime.isSame(moment(date), "day") &&
      momenttz.tz('Asia/Bangkok').hour() < CUTOFF_TIME
    ) {
      return true;
    }
    return false;
  };

  const checkTomorrowAfter8 = (date) => {
    if (cartType !== 'meal') return false;

    const currentTime = moment(momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD"));
    const tomorrowTime = moment(momenttz.tz('Asia/Bangkok').add(1, "days").format('YYYY-MM-DD'));
    if (
      tomorrowTime.isSame(moment(date), "day") &&
      momenttz.tz('Asia/Bangkok').hour() >= CUTOFF_TIME
    ) {
      return true;
    }
    return false;
  };

  const todaySlotMessage = (item) => {
    const itemDate = moment(item.completeDate);
    const currentTime = momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD');
    let result = "";
    if (itemDate.isSame(currentTime, "day") && momenttz.tz('Asia/Bangkok').hour() < 18) {
      if (item.slots.length > 0) {
        if (cartType == "meal") {
          result = "Fresh Meals are not available same day";
        } else {
          result = "Checkout before 6pm";
        }
      } else {
        console.log('slot cartType 4',cartType);
        result = "Same-day delivery slots full";
      }
    }
    return result;
  };

  const checkIsMealsPlanSlot = (date, slotId) => {
    if (cartType=='combined' && selectedSection=="grocery") {
      for (let index = 0; index < mealsCartData.lines.length; index++) {
        const mealsSlotObj = mealsCartData.lines[index];
        if (mealsSlotObj) {
          const { delivery_date, delivery_slot_id } = mealsSlotObj;
          if (delivery_slot_id) {
            const { id } = delivery_slot_id;
            if (date == delivery_date && (id == slotId || slotId == 0)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const checkIsGroceryPlanSlot = (date, slotId) => {
    // console.log('selectedSection',selectedSection);
    if (cartType=='combined' && selectedSection=="meal") {
      var grocery_delivery_date = cartData.delivery_date || null;
      var grocery_delivery_slot_id = cartData.delivery_slot_id || null;
      if (grocery_delivery_date!==null && grocery_delivery_slot_id!== null) {
        if (date == grocery_delivery_date && (grocery_delivery_slot_id.id == slotId || slotId == 0)) { 
          var is_already_combined = false;
          for (let index = 0; index < mealsCartData.lines.length; index++) {
            const mealsSlotObj = mealsCartData.lines[index];
            if (mealsSlotObj) {
              const { delivery_date, delivery_slot_id } = mealsSlotObj;
              if (delivery_slot_id) {
                const { id } = delivery_slot_id;
                if (date == delivery_date && (id == slotId || slotId == 0)) {
                  is_already_combined = true;
                }
              }
            }
          }
          if (is_already_combined == true) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
    return false;
  };

  const checkAllSlotsAreFull = (item) => {
    let allFull = true;
    for (let index = 0; index < item.slots.length; index++) {
      if (item.slots[index].state == "avail") {
        allFull = false;
        break;
      }
    }
    return allFull;
  };

  const renderDateText = (item, dateString) => {    
    if (freshMeals) {
      if ( checkAllSlotsAreFull(item) || checkMealsNotifications(item.completeDate)) {
        return (
          <Text color={addressGrey} smallRegular style={styles.dateText}>
            Your meals are not on the menu for this day
          </Text>
        );
      } if (checkTomorrowAfter8(item.completeDate)) {
         return(
          <Text color={addressGrey} smallRegular style={styles.dateText}>
            Order before 8pm for delivery tomorrow
          </Text>
        );
      } else {
        return (
          <Text color={dateGrey} smallRegular style={styles.dateText}>
            {dateString}
          </Text>
        );
      }
    } else {
      return (
        <Text color={dateGrey} smallRegular style={styles.dateText}>
          {dateString}
        </Text>
      );
    }
  };
  
   // To do: Review the 2 functions bellow and merge them
  const renderListCell = (item, index) => {
    // console.log('item in daysList',item);
    
    const day = item.day.replace(/^0+/, "");
    const dateArray = item.combineDate.split(/(\s+)/);
    const dateString = dateArray[0] + " " + dateArray[2].replace(/^0+/, "");

    let isSllFull = checkAllSlotsAreFull(item);
    isSllFull = checkMealsNotifications(item.completeDate) || isSllFull;
    
    const isMto = /disabled-mto/.test(item.status);
    const isSameDayFreshMeal = /disabled-fresh-meal/.test(item.status);
    const TomorrowAfter8 = checkTomorrowAfter8(item.completeDate);
    
    const isDisabled = (freshMeals && isSllFull) || isMto || isSameDayFreshMeal || TomorrowAfter8;
    const todayMessage = todaySlotMessage(item);
    
    
    
    if (item.isSelected == true) {
      var show_selected = 'IS SELECTED';
    } else {
      var show_selected = 'NOT SELECTED';
    }
   
    
    return (
      <View
        key={index}
        style={[
          styles.cell,
          {
            backgroundColor: item.isSelected ? slotGrey : white,
            borderTopWidth: index == 0 ? 1 : 0,
            marginBottom: daysList == 5 ? 30 : 0,
            height: item.isSelected ? "auto" : 72,
          },
        ]}
      >
        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => {
            selectDay(index);
          }}
        >
          <Text
            color={isDisabled ? addressGrey : accountSettingGray}
            regularPlus
            bold={item.isSelected ? true : false}
            style={[styles.dayText, isDisabled && styles.textThrough]}
          >
            {day} 
          </Text>

          {isMto ? (
            <View style={styles.imageRow}>
              <Text color={addressGrey} smallRegular style={styles.dateText}>
                Some items not available same day{" "} 
              </Text>
              <Image source={appImages.mto} style={styles.mtoIcon} />
            </View>
          ) : isSameDayFreshMeal ? (
            <Text color={addressGrey} smallRegular style={styles.dateText}>
              Fresh Meals cannot be ordered for the same day.
            </Text>
          ) : checkTomorrowBefore8(item.completeDate) ? (
            <Text color={addressGrey} smallRegular style={styles.dateText}>
              Checkout before 8pm today
            </Text>
          ) :  todayMessage ? (
            <Text color={addressGrey} smallRegular style={styles.dateText}>
              {todayMessage}
            </Text>
          ) : (
          
            <View style={styles.imageRow}>

              {checkIsMealsPlanSlot(item.completeDate, 0) && !item.isSelected && (
                <>
                  <Image style={styles.mealsIc} source={fresh_meals_ic} />
                  <Text color={addressGrey} smallRegular style={styles.dateText}>
                    Combine with your Fresh Meal delivery
                  </Text>
                </>
              )}
              
              {checkIsGroceryPlanSlot(item.completeDate, 0) && !item.isSelected && (
                <Text color={addressGrey} smallRegular style={styles.dateText}>
                  Combine with your Grocery delivery
                </Text>
              )}

              {!checkIsMealsPlanSlot(item.completeDate, 0) && !checkIsGroceryPlanSlot(item.completeDate, 0) &&
                renderDateText(item, dateString)}

              {checkIsMealsPlanSlot(item.completeDate, 0) && item.isSelected && (
                <Text color={addressGrey} smallRegular style={styles.dateText}>
                  Your Groceries will be delivered together with your scheduled
                  Fresh Meals at the time slot you choose.
                </Text>
              )}
              
              {checkIsGroceryPlanSlot(item.completeDate, 0) && item.isSelected && (
                <Text color={addressGrey} smallRegular style={styles.dateText}>
                  Your Fresh Meal will be delivered together with your scheduled
                  Grocery at the time slot you choose.
                </Text>
              )}
              
            </View>
          )}
        </TouchableOpacity>

        {item.isSelected && (
          <View style={styles.slotContainer}>
            {item.slots.map((obj, j) => {
              if (obj.state == "full") {
                return null;
              }
              return (
                <TouchableOpacity
                  onPress={() => {
                    selectSlot(index, j);
                  }}
                  key={j}
                  style={[styles.timeRow]}
                >
                  <View style={styles.smallTimeRow}>
                    <Text color={accountSettingGray} smallRegular>
                      {obj.name}
                    </Text>

                    {checkIsMealsPlanSlot(item.completeDate, obj.id) && (
                      <Image style={styles.mealsIc} source={fresh_meals_ic} />
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      selectSlot(index, j);
                    }}
                    style={[
                      styles.box,
                      {
                        backgroundColor: obj.isSelected ? darkGrey : white,
                        borderWidth: obj.isSelected ? 0 : 1,
                      },
                    ]}
                  >
                    <Image source={white_tick} style={styles.tick} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };
  
  const renderListCellFreshMeals = (item, index) => {
    
    const day = item.day.replace(/^0+/, "");
    const dateArray = item.combineDate.split(/(\s+)/);
    const dateString = dateArray[0] + " " + dateArray[2].replace(/^0+/, "");
    
    return (
      <View
        key={index}
        style={[
          styles.cell,
          {
            backgroundColor: item.isSelected ? slotGrey : white,
            borderTopWidth: index == 0 ? 1 : 0,
            marginBottom: index == 5 ? 30 : 0,
            height: item.isSelected ? "auto" : 72,
          },
        ]}
      >
        <TouchableOpacity
          disabled={index == 0 && (freshMeals ? true : false)}
          onPress={() => {
            selectDay(index);
          }}
        >
          <Text
            color={freshMeals && index == 0 ? addressGrey : accountSettingGray}
            regularPlus
            bold={item.isSelected ? true : false}
            style={styles.dayText}
          >
            {day}
          </Text>

          {freshMeals && index == 0 && <View style={styles.todayLine} />}

          <View style={styles.imageRow}>
            {freshMeals && index == 1 && !item.isSelected && (
              <Image style={styles.mealsIc} source={fresh_meals_ic} />
            )}

            {freshMeals && index == 0 ? (
              <Text color={addressGrey} smallRegular style={styles.dateText}>
                Fresh Meals cannot be ordered for the same day.
              </Text>
            ) : (
              <Text color={dateGrey} smallRegular style={styles.dateText}>
                {dateString}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {item.isSelected && (
          <View style={styles.slotContainer}>
            {item.slots.map((obj, j) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    selectSlot(index, j);
                  }}
                  key={j}
                  style={[styles.timeRow]}
                >
                  <View style={styles.smallTimeRow}>
                    <Text color={accountSettingGray} smallRegular>
                      {obj.name}
                    </Text>
                    {freshMeals && index == 1 && j == 0 && (
                      <Image style={styles.mealsIc} source={fresh_meals_ic} />
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      selectSlot(index, j);
                    }}
                    style={[
                      styles.box,
                      {
                        backgroundColor: obj.isSelected ? darkGrey : white,
                        borderWidth: obj.isSelected ? 0 : 1,
                      },
                    ]}
                  >
                    <Image source={white_tick} style={styles.tick} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderDaysList = () => {
    // console.log('daysList',daysList);
    // console.log('selectedSection',selectedSection);
    if (selectedSection == 'fresh_meals') {
      return (
        <View>{daysList.map((item, index) => renderListCellFreshMeals(item, index))}</View>
      );
    } else {
      return (
        <View>{daysList.map((item, index) => renderListCell(item, index))}</View>
      );
    }
  };
   
  return (
    <Modal
      testID={"modal"}
      isVisible={showModal}
      backdropColor={blackOpacity}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={() => {
        setShowPrivacyModal(false);
        //  setIsAnyPopupOpened(false)
      }}
      statusBarTranslucent
      useNativeDriverForBackdrop
      swipeDirection={["down"]}
    >
      <TouchableWithoutFeedback>
        <View style={[styles.container]}>
          <View style={[styles.body, { height: "92%" }]}>
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => setShowPrivacyModal()}
            >
              <Image
                source={appImages.close}
                style={styles.crossImg}
                resizeMode={"contain"}
              />
            </TouchableOpacity>

            <Text condensedBold largeRegularPlus style={styles.margin}>
              {heading}
            </Text>

            <ScrollView style={styles.scrollView}>
              {renderDaysList()}
            </ScrollView>

            {fromCart && isSingleDay && (
              <View style={styles.splitContainer}>
                <Text color={black} lineHeight={19}>
                  or
                </Text>
                <TouchableOpacity
                  style={styles.splitInner}
                  onPress={() => {
                    setShowPrivacyModal(false);
                    splitTheDelivery();
                  }}
                >
                  <Image source={split_img} style={styles.splitImg} />
                  <View>
                    <Text
                      color={accountSettingGray}
                      regularPlus
                      lineHeight={22}
                    >
                      Split to two deliveries
                    </Text>
                    <Text smallRegular color={dateGrey} lineHeight={18}>
                      Move Grocery items to another day.{" "}
                    </Text>
                    <Text tiny color={dateGrey} lineHeight={13}>
                      Delivery minimum & additional fee may apply.{" "}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TimeSlot;
