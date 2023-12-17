import moment from "moment";
import { TIMEZONE, CUTOFF_TIME, THUMBNAIL_BASE_URL } from "../common/constants";
import { createDaysArray } from "../screens/PickupTimeSlot";
import { PLEASE_SELECT } from "../components/";
import { appColors } from "../theme";
// Implement when time
import * as momenttz from 'moment-timezone';
import { Platform, Vibration } from "react-native";
import * as Haptics from 'expo-haptics';

const validateEmail = (email) => {
  if (
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    return true;
  }

  return false;
};

const number_format = (number, format_type) => {
  if (format_type == "0,0") {
    var number = Math.round(number || 0);
    // number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    number = number.toLocaleString('en-US');
    return number;
  }
  if (format_type == "0.00") {
    var number = (number || 0).toFixed(2);
    return number;
  }
  if (format_type == "0") {
    var number = parseInt(number);
    return number;
  }
};

const rsplit = (str, sep, maxsplit) => {
  var split = str.split(sep);
  return maxsplit
    ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit))
    : split;
};

const get_thumbnail = (fname, size) => {
  if (!fname) return "/static/paleo_prod_default.png";
  let url = fname;
  if (size) {
    const res = rsplit(url, ",", 1);
    const imageName = res[0];
    const rand = res[1];
    url = imageName + "-resize-" + size + "," + rand;
  }

  if (url.startsWith("http")) return url;
  else return `${THUMBNAIL_BASE_URL}${url}`;
};

// Those 2 functions for time slots are similar in functionality. Should be merged in the future.
// This simply retrieves the first available day for the Mealplan in different formats - could use some cleanup
const getDefaultDateForFreshMeals = () => {

  var server_date = momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD");
  var server_hours = momenttz.tz('Asia/Bangkok').format("H");
  var week_day_name = moment(server_date).add(1,"days").format("ddd");

  var start_with_day = 1;
  if (week_day_name == 'Sun') {
    var start_with_day = 2;
  }

  var formattedTomorrow= moment(server_date).add(start_with_day,"days").format("YYYY-MM-DD");
  let tomorrow = moment(server_date).add(start_with_day,"days").format("DD,ddd,dddd,MM,MMMM,Do,MMM,YYYY,YYYY-MM-DD").toString().split(",");
  var pretty_date = "Tomorrow";
  // console.log('pretty_date',pretty_date);
  if (start_with_day == 2) {
    pretty_date = tomorrow[2];
  }
  // console.log('pretty_date',pretty_date);
  // console.log('formattedTomorrow1',formattedTomorrow);

  if (server_hours >= CUTOFF_TIME) {
    var week_day_name = moment(server_date).add(2,"days").format("ddd");
    if (week_day_name != 'Sun') {
      formattedTomorrow = moment(server_date).add(2,"days").format("YYYY-MM-DD");
      tomorrow = moment(server_date).add(2,"days").format("DD,ddd,dddd,MM,MMMM,Do,MMM,YYYY,YYYY-MM-DD").toString().split(",");
      pretty_date = tomorrow[2];
    } else {
      formattedTomorrow = moment(server_date).add(3,"days").format("YYYY-MM-DD");
      tomorrow = moment(server_date).add(3,"days").format("DD,ddd,dddd,MM,MMMM,Do,MMM,YYYY,YYYY-MM-DD").toString().split(",");
      pretty_date = tomorrow[2];
    }
  }
  // console.log('pretty_date',pretty_date);
  // console.log('formattedTomorrow2',formattedTomorrow);

  // Not sure if this is needed anymore but just leave it here
  var week_day_name = moment(formattedTomorrow).format("ddd");
  if (week_day_name == 'Sun') {
    formattedTomorrow = moment(server_date).add(2,"days").format("YYYY-MM-DD");
    tomorrow = moment(server_date).add(2,"days").format("DD,ddd,dddd,MM,MMMM,Do,MMM,YYYY,YYYY-MM-DD").toString().split(",");
    pretty_date = tomorrow[2];
  }
  // console.log('formattedTomorrow3',formattedTomorrow);
  // console.log('pretty_date',pretty_date);

  // console.log('default date',formattedTomorrow, pretty_date, start_with_day, server_date, tomorrow);

  return {
    pretty_date,
    tomorrow,
    formattedTomorrow,
  };
};

const getShortDayName = (day) => {
  if (day == "Tue") {
    return "Tues";
  }

  if (day == "Wed") {
    return "Weds";
  }

  if (day == "Thu") {
    return "Thurs";
  }

  return day;
};

const getCity = (addressArray) => {
  let city = "";
  for (let i = 0; i < addressArray.length; i++) {
    if (
      addressArray[i].types[0] &&
      "administrative_area_level_2" === addressArray[i].types[0]
    ) {
      city = addressArray[i].long_name;
      return city;
    }
  }
};

const getPostalCode = (addressArray) => {
  let postal_code = "";
  for (let i = 0; i < addressArray.length; i++) {
    if (
      addressArray[i].types[0] &&
      "postal_code" === addressArray[i].types[0]
    ) {
      postal_code = addressArray[i].long_name;
      return postal_code;
    }
  }
};

const getArea = (addressArray) => {
  let area = "";
  for (let i = 0; i < addressArray.length; i++) {
    if (addressArray[i].types[0]) {
      for (let j = 0; j < addressArray[i].types.length; j++) {
        if (
          "sublocality_level_1" === addressArray[i].types[j] ||
          "locality" === addressArray[i].types[j]
        ) {
          area = addressArray[i].long_name;
          return area;
        }
      }
    }
  }
};

const getState = (addressArray) => {
  let state = "";
  for (let i = 0; i < addressArray.length; i++) {
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_1" === addressArray[i].types[0]
      ) {
        state = addressArray[i].long_name;
        return state;
      }
    }
  }
};

const getStreetNumber = (addressArray) => {
  let state = "";
  for (let i = 0; i < addressArray.length; i++) {
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "street_number" === addressArray[i].types[0]
      ) {
        state = addressArray[i].long_name;
        return state;
      }
    }
  }
};

const getRoute = (addressArray) => {
  let state = "";
  for (let i = 0; i < addressArray.length; i++) {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0] && "route" === addressArray[i].types[0]) {
        state = addressArray[i].long_name;
        return state;
      }
    }
  }
};

const getSubLocalityLevel2 = (addressArray) => {
  let state = "";
  for (let i = 0; i < addressArray.length; i++) {
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "sublocality_level_2" === addressArray[i].types[0]
      ) {
        state = addressArray[i].long_name;
        return state;
      }
    }
  }
};

const display_status = (
  status,
  plr_order_type,
  delivery_orders,
  order_date
) => {
  if (status == "canceled") {
    return "Canceled";
  }

  if (plr_order_type == "giftcard") {
    if (status == "wait_payment") {
      return "Waiting for Payment";
    }

    if (status == "done") {
      return "Voucher Sent";
    }
  }

  if (
    plr_order_type == "meal" ||
    plr_order_type == "grocery" ||
    plr_order_type == "combined"
  ) {
    if (status == "wait_payment") {
      return "Waiting for Payment";
    }

    // Only do this for new orders
    if (
      moment(order_date).isSameOrAfter(
        moment("2021-05-22").format("YYYY-MM-DD")
      )
    ) {
      var do_delivery_statuses = "";
      var count_delivery_orders = delivery_orders.length;

      if (count_delivery_orders > 0) {
        const deliveredOrders = delivery_orders.filter(order => order.state == 'delivered');
        if (deliveredOrders.length === count_delivery_orders) {
          do_delivery_statuses = 'Delivered';
        } else if (deliveredOrders.length) {
          do_delivery_statuses = 'Partially delivered';
        } else {
          if (count_delivery_orders > 1) {
            do_delivery_statuses = `${count_delivery_orders} deliveries`;
          } else {
            const orderState = delivery_orders[0].state;
            if (['wait_pack', 'start_pack', 'wait_deliver'].includes(orderState)) {
              do_delivery_statuses = 'Delivery scheduled';
            } else if (orderState == 'start_deliver') {
              do_delivery_statuses = 'Out for delivery';
            }
          }
        }

        // for (var i = 0; i < count_delivery_orders; i++) {
        //   if (delivery_orders[i].state == "wait_pack") {
        //     do_delivery_statuses = do_delivery_statuses + "Delivery scheduled";
        //   }
        //   if (delivery_orders[i].state == "start_pack") {
        //     do_delivery_statuses = do_delivery_statuses + "Delivery scheduled";
        //     //do_delivery_statuses = do_delivery_statuses + '<span class="status_wait_delivery">' + NF.translate("Packing Begun") +'</span><br/>';
        //   }
        //   if (delivery_orders[i].state == "wait_deliver") {
        //     do_delivery_statuses = do_delivery_statuses + "Delivery scheduled";
        //     //do_delivery_statuses = do_delivery_statuses + '<span class="status_wait_delivery">' + NF.translate("Awaiting Delivery") +'</span><br/>';
        //   }
        //   if (delivery_orders[i].state == "start_deliver") {
        //     do_delivery_statuses = do_delivery_statuses + "Out for delivery";
        //   }
        //   if (delivery_orders[i].state == "delivered") {
        //     if (delivery_orders[i].delivered_time != null) {
        //       var mom = moment(delivery_orders[i].delivered_time, "HH:mm:ss");
        //       do_delivery_statuses =
        //         do_delivery_statuses +
        //         moment(delivery_orders[i].time_delivered).format(
        //           "ddd, Do of MMMM"
        //         ) +
        //         " at " +
        //         mom.format("hh:mm A");
        //     } else {
        //       do_delivery_statuses = do_delivery_statuses + "Delivered";
        //     }
        //   }
        // }

        return do_delivery_statuses;
      }
    }

    // Fallback for very old orders
    if (status == "wait_delivery") {
      return "Delivery scheduled";
    }

    if (status == "wait_ship") {
      return "Awaiting Shipment";
    }

    if (status == "done") {
      return "Delivered";
    }
  }

  if (plr_order_type == "credit") {
    return "Payed";
  }

  if (plr_order_type == "pickup") {
    if (status == "wait_delivery") {
      return "Scheduled";
    }

    if (status == "wait_ship") {
      return "Scheduled";
    }

    if (status == "wait_packing") {
      return "Scheduled";
    }

    if (status == "done") {
      return "Shipped out";
    }

    return status;
  }

  if (status == "done") {
    return "Delivered";
  }

  return;
};

const getOrderColor = (orderStatus) => {
  orderStatus = (orderStatus || '').toLowerCase();
  if (orderStatus == "Delivered".toLowerCase()) {
    return {
      textColor: appColors.textGreen,
      bgColor: appColors.lightGreen,
    };
  }

  if (orderStatus == "Canceled".toLowerCase()) {
    return {
      textColor: appColors.sharpRed,
      bgColor: appColors.lightRed,
    };
  }

  if (orderStatus == "Waiting for Payment".toLowerCase()) {
    return {
      textColor: appColors.darkBlue,
      bgColor: appColors.lightBlue,
    };
  }

  if (orderStatus == "Partially delivered".toLowerCase()) {
    return {
      textColor: appColors.orange,
      bgColor: appColors.oragneOpacity
    }
  }

  return {
    textColor: appColors.darkBlue,
    bgColor: appColors.lightBlue,
  };
};

const getOrderDate = (date, format) => {
  if (!date) {
    return "";
  }
  let orderDate = moment(date).format(format || "MMMM Do, YYYY").toString();

  return orderDate ? orderDate : "";
};

const getOrderDay = (date) => {
  if (!date) {
    return "";
  }
  let orderDate = moment(date).format("ddd").toString();

  return orderDate ? orderDate : "";
}

const getOrderDetailsDate = (date) => {
  if (!date) {
    return { day: "", orderDate: "" };
  }

  const timeDay = moment(date).format("ddd,DD MMMM").toString().split(",");

  return { day: getShortDayName(timeDay[0]), orderDate: timeDay[1] };
};

const getOrderDetailsDateTime = (date) => {
  if (!date) {
    return "";
  }

  let timeDay = moment(date).format("YYYY-M-dddd hh:mm:ss");

  let timeDay2 = moment(date, "YYYY-M-dddd hh:mm:ss")
    .format("hha, MMM Do")
    .toString();

  return timeDay2 ? timeDay2 : "";
};

const getOrderDetailsDateTimeSecondFormat = (date) => {
  if (!date) {
    return { day: "", orderDate: "", time: "" };
  }
  const timeDay = moment(date).format("ddd,DD MMMM").toString().split(",");
  let time = moment(date, "YYYY-M-dddd hh:mm:ss").format("hh:ma").toString();

  return {
    day: getShortDayName(timeDay[0]),
    orderDate: timeDay[1],
    time: time,
  };
};

const isShowOutOfStockBadge = (stock_qty_avail, ecom_no_order_unavail, sale_max_qty) => {
  // Ask about sold_out as an argument
  let max_qty = 999;
  if (ecom_no_order_unavail) {
    max_qty = stock_qty_avail;
  }

  if (sale_max_qty && sale_max_qty < max_qty) {
    max_qty = sale_max_qty;
  }

  if (max_qty<=0 && ecom_no_order_unavail) {  // || sold_out
    return true;
  } else {
    return false;
  }

};

const shortSlotName = (slotName) => {
  return slotName.replace('pm-', '-');
}

const checkoutDay = (delivery_date) => {
  if (delivery_date) {
    let date = moment(delivery_date).format("dddd");
    const formattedDay = checkForTodayTomorrow(delivery_date, null);
    if (formattedDay == "Today" || formattedDay == "Tomorrow") {
      date = formattedDay;
    }
    return date;
  } else {
    return "";
  }
};

const convertDeliveryDateToDisplayDate = (delivery_date, delivery_slot_name) => {
  if (delivery_date && delivery_slot_name) {
    let date = moment(delivery_date).format("Do");
    const dayIndex = moment(delivery_date).format("d");
    const days = ["Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"];
    date = `${days[dayIndex]} ${date}`;
    const formattedDay = checkForTodayTomorrow(delivery_date, null);
    if (formattedDay == "Today" || formattedDay == "Tomorrow") {
      date = formattedDay;
    }
    const dateString = `${date}, ${shortSlotName(delivery_slot_name)}`;
    return dateString;
  } else {
    return "";
  }
};

const scheduledDeliveryTime = (delivery_date, delivery_slot_name) => {
  if (delivery_date && delivery_slot_name) {
    let  date = moment(delivery_date).format("MMMM Do");
    const formattedDay = checkForTodayTomorrow(delivery_date, null);
    if (formattedDay == "Today" || formattedDay == "Tomorrow") {
      date = formattedDay;
    }
    const dateString = `${date}, ${shortSlotName(delivery_slot_name)}`;
    return dateString;
  } else {
    return "";
  }
};

const convertDeliveryDateToHomepageDisplayDate = (deliveryDate) => {
  let tomorrow = moment(deliveryDate).format("D,ddd,dddd,MM,MMMM,Do,MMMM").toString().split(",");
  const formattedDay = checkForTodayTomorrow(deliveryDate, tomorrow[2]);
  let date = getShortDayName(tomorrow[1]) + ", " + tomorrow[0] + " " + tomorrow[6];
  if (formattedDay == "Today" || formattedDay == "Tomorrow") {
    date = formattedDay;
  }
  return date;
};

const displayDateWithTodayTomorrow = (delivery_date, delivery_slot_id) => {
  if (delivery_date && delivery_slot_id) {
    const day = moment(delivery_date).format("dddd");
    const dateString = day + ", " + delivery_slot_id.name;
    return dateString;
  } else {
    return "";
  }
};

const exist_min_each_day = (cartData) => {
  var exist_min = true;
  var cartItems = cartData;
  // console.log('cartItems',cartItems);

  if (cartItems) { //  && cartItems.length > 0
    let order_by_date={}
    cartItems.lines.forEach((l) => {
      let order = order_by_date[l.delivery_date]
      if (!order) {
        order = {lines:[]}
        order_by_date[l.delivery_date] = order
      }
      order.lines.push(l)
    })
    let delivery_dates = Object.keys(order_by_date)
    delivery_dates.sort()
    delivery_dates.map( d => {
      var total_per_day=0;
      let order=order_by_date[d]
      order.lines.map((item,i) => {
        if(d==item.delivery_date){
          total_per_day+=item.unit_price*item.qty;
        }
      })
      // console.log('total_per_day 1',parseInt(total_per_day));
      if(parseInt(total_per_day) < 249){
        exist_min = false;
      }
      // console.log('total_per_day 2',exist_min,parseInt(total_per_day));
    })
  }
  return exist_min;
};

const exist_min_each_day_combined = (cartData, deliveryDate) => {
  var exist_min = true;
  var cartItems = cartData;
  // console.log('cartItems',cartItems);

  if (cartItems) { //  && cartItems.length > 0
    let order_by_date={}
    cartItems.lines.forEach((l) => {
      let order = order_by_date[l.delivery_date]
      if (!order) {
        order = {lines:[]}
        order_by_date[l.delivery_date] = order
      }
      order.lines.push(l)
    })
    let delivery_dates = Object.keys(order_by_date)
    delivery_dates.sort()
    delivery_dates.map( d => {
      // console.log('deliveryDate == d',deliveryDate, d)
      if (deliveryDate == d) {
        var total_per_day=0;
        let order=order_by_date[d]
        order.lines.map((item,i) => {
          if(d==item.delivery_date){
            total_per_day+=item.unit_price*item.qty;
          }
        })
        // console.log('total_per_day 1',parseInt(total_per_day));
        if(parseInt(total_per_day) < 249){
          exist_min = false;
        }
        // console.log('total_per_day 2',exist_min,parseInt(total_per_day));
      }
    })
  }
  return exist_min;
};

const exist_min_each_day_no_combined = (cartData, deliveryDate) => {
  var exist_min = true;
  var cartItems = cartData;
  // console.log('cartItems',cartItems);

  if (cartItems) { //  && cartItems.length > 0
    let order_by_date={}
    cartItems.lines.forEach((l) => {
      let order = order_by_date[l.delivery_date]
      if (!order) {
        order = {lines:[]}
        order_by_date[l.delivery_date] = order
      }
      order.lines.push(l)
    })
    let delivery_dates = Object.keys(order_by_date)
    delivery_dates.sort()
    delivery_dates.map( d => {
      // console.log('deliveryDate == d',deliveryDate, d)
      if (deliveryDate != d) {
        var total_per_day=0;
        let order=order_by_date[d]
        order.lines.map((item,i) => {
          if(d==item.delivery_date){
            total_per_day+=item.unit_price*item.qty;
          }
        })
        // console.log('total_per_day 1',parseInt(total_per_day));
        if(parseInt(total_per_day) < 249){
          exist_min = false;
        }
        // console.log('total_per_day 2',exist_min,parseInt(total_per_day));
      }
    })
  }
  return exist_min;
};

// Not used anywhere
const checkCurrentTime = () => {
  if (momenttz.tz('Asia/Bangkok').hour() > CUTOFF_TIME) {
    return false;
  }
  return true;
};

const getDisabledItems = (cartData, cartType) => {
  if (!cartData) {
    return { disabledItems: [], items: [] };
  }
  const cartLinesArray = cartData.lines;

  // Review this logic later
  if (cartType == "grocery") {
    const disabledItemsArray = [];
    const availableItems = [];
    for (let index = 0; index < cartLinesArray.length; index++) {
      if (cartLinesArray[index].error == 'Item can not be delivered to your shipping address.') {
        // We also have the error Item can not be ordered any more because it is past cut-off time. ... what should we do
        disabledItemsArray.push(cartLinesArray[index]);
      } else {
        availableItems.push(cartLinesArray[index]);
      }
    }
    return { disabledItems: disabledItemsArray, items: availableItems };
  // For meals
  } else {
    return { disabledItems: [], items: cartLinesArray };
  }

};

const grocery_cart_total_qty = (cartData) => {
  var cart = cartData;
  if (!cart) return 0;
  var qty = 0;
  cart.lines.forEach((line) => {
    qty += line.qty;
  });
  return qty;
};

const meal_cart_total_qty = (cartData) => {
  var cart = cartData;
  if (!cart) return 0;
  var qty = 0;
  cart.lines.forEach((line) => {
    qty += line.qty;
  });
  return qty;
};

const should_meal_be_removed = (meal_date) => {
  const now = momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD");
  const hour = momenttz.tz('Asia/Bangkok').hour();

  if (moment(meal_date).isSameOrBefore(moment(now).format("YYYY-MM-DD"))) {
    console.log("Remove Meal because it is in the past");
    // Meal should be removed if it is in the past
    return true;
  }

  if (hour >= CUTOFF_TIME &&  moment(meal_date).isSameOrBefore(moment(now).add(1, "days").format("YYYY-MM-DD"))) {
    console.log("Remove Meal because it is past due time");
    // Meal should be removed if it is in the future but is past due time
    return true;
  }
  return false;
};

const check_exist_only_water = (GroceryCart) => {
	var exist_only_water = true;
	GroceryCart.lines.map( l => {
		if(l.product_id.id!=11374 && l.product_id.id!=11383 && l.product_id.id!=16393){
			exist_only_water = false;
		}
	})
	return exist_only_water;
}

const checkForTodayTomorrow = (date, day) => {
  const now = momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD");
  if (moment(date).isSame(moment(now).format("YYYY-MM-DD"), "day")) {
    return "Today";
  }
  if ( moment(date).isSame(moment(now).add(1, "days").format("YYYY-MM-DD"), "day")) {
    return "Tomorrow";
  }
  return moment(date).format("dddd");
};

const getCartType = (groceryCartData, mealCartData) => {
  var cartType = null;
  if ( groceryCartData && groceryCartData.lines && groceryCartData.lines.length > 0) {
    cartType = "grocery";
  }
  if (mealCartData && mealCartData.lines && mealCartData.lines.length > 0) {
    if (cartType !== null) {
      cartType = "combined";
    } else {
      cartType = "meal";
    }
  }
  /*
  if (cartType == null) {
    cartType = "grocery";
  }
  */
  return cartType;
};

// Also called groupByDeliveryDate before
const groupBy2 = (xs, prop) => {
  var grouped = {};
  for (var i = 0; i < xs.length; i++) {
    var p = xs[i][prop];
    if (!grouped[p]) {
      grouped[p] = [];
    }
    grouped[p].push(xs[i]);
  }
  return grouped;
};

const formatCreditCardNumber = (cardNumber) => {
  const subNumbers = cardNumber.match(/.{1,4}/g);
  return subNumbers.join(' ');
}

const getSlotsForDelivery = (cartData, mealsCartData) => {

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

  } else {

    data = createDaysArray();

  }

  return data;

};

const getTimeSlotForDeliveryDisplay = (cartData, mealsCartData) => {

  // console.log('GETTING TIME SLOT');

  var dateString = PLEASE_SELECT;

  // Reviewed Logic
  var cartType = getCartType(cartData, mealsCartData);

  // If we have a grocery cart only (then it manages the grocery cart date)  (or a combined 1 day worth of meals / or 1 days worth of meals)
   // If we have 1 days worth of meals, then it manages the meals date
  if (cartData && (cartType=='grocery' || cartType=='combined')) {
    // If we have a grocery cart with a date/slot on them
    if (cartData.delivery_date && cartData.delivery_slot_id) {

      // console.log('Display Scenario 1');
      let deliveryDate = cartData.delivery_date;
      let deliverySlotId = cartData.delivery_slot_id.name;

      dateString = convertDeliveryDateToDisplayDate(deliveryDate, deliverySlotId)

    }

  } else if (cartType=='meal') {

    // console.log('Display Scenario 2');

    let deliveryDate = "";
    let deliverySlotId = "";

    const multiDeliveries = groupBy2( mealsCartData ? mealsCartData.lines : [], "delivery_date");
    const multiDeliveriesLength = Object.keys(multiDeliveries).length;

    if (multiDeliveriesLength == 1) {

      deliveryDate = mealsCartData.lines[0].delivery_date;
      deliverySlotId = mealsCartData.lines[0].delivery_slot_id.name;

      dateString = convertDeliveryDateToDisplayDate(deliveryDate, deliverySlotId)

    } else if (cartData) {

      if (cartData.delivery_date && cartData.delivery_slot_id) {

        // console.log('Display Scenario 3');
        let deliveryDate = cartData.delivery_date;
        dateString = convertDeliveryDateToHomepageDisplayDate(deliveryDate);

      }

    }

  }   else if (cartData) {

    if (cartData.delivery_date && cartData.delivery_slot_id) {

      // console.log('Display Scenario 4');
      let deliveryDate = cartData.delivery_date;
      let deliverySlotId = cartData.delivery_slot_id.name;

      dateString = convertDeliveryDateToDisplayDate(deliveryDate, deliverySlotId)

    }

  }
  console.log('TimeSlot for Delivery',dateString)
  return dateString;

};

const isSingleDayDelivery = (cartData, mealsCartData) => {

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


const onchange_time_slot = (cartData, mealsCartData, setMealsCartData, setCartData, date, slotId, token, user_id, API) => {

  console.log('TIMESLOT CHANGED');

  var cartType = getCartType(cartData, mealsCartData);
  if (cartType == null) {
    cartType = "grocery";
  }
  var isSingleDay = isSingleDayDelivery(cartData, mealsCartData);

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

const hapticFeedback = (isLight = true) => {
  if (Platform.OS === 'android') {
    Vibration.vibrate(isLight ? 10 : 20);
  } else {
    Haptics.impactAsync(isLight ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
  }
};

export default {
  validateEmail,
  number_format,
  get_thumbnail,
  getDefaultDateForFreshMeals,
  getShortDayName,
  getCity,
  getPostalCode,
  getArea,
  getState,
  getStreetNumber,
  getRoute,
  getSubLocalityLevel2,
  display_status,
  getOrderColor,
  getOrderDate,
  getOrderDay,
  getOrderDetailsDate,
  getOrderDetailsDateTime,
  getOrderDetailsDateTimeSecondFormat,
  isShowOutOfStockBadge,
  convertDeliveryDateToDisplayDate,
  scheduledDeliveryTime,
  exist_min_each_day,
  exist_min_each_day_combined,
  exist_min_each_day_no_combined,
  checkCurrentTime,
  getDisabledItems,
  grocery_cart_total_qty,
  meal_cart_total_qty,
  should_meal_be_removed,
  checkForTodayTomorrow,
  getCartType,
  groupBy2,
  convertDeliveryDateToHomepageDisplayDate,
  shortSlotName,
  checkoutDay,
  check_exist_only_water,
  formatCreditCardNumber,
  getSlotsForDelivery,
  getTimeSlotForDeliveryDisplay,
  isSingleDayDelivery,
  onchange_time_slot,
  hapticFeedback,
};

export * from './appsflyer';
export * from './paypal';