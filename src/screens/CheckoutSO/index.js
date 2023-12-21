import React, { useState, useContext, useEffect, useCallback } from 'react'

import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import { My2c2p } from '../../helpers/my2c2p';

import * as momenttz from 'moment-timezone';
import analytics from '@react-native-firebase/analytics';

import { useFocusEffect } from '@react-navigation/native'
import styles from './Styles'
import { appColors, appImages } from '../../theme'
import DeliveryPopup from "../Cart/DeliveryPopup";
import TimeSlot from "../PickupTimeSlot";
import Services from '../../services'
import moment from "moment";
const { API } = Services

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
} = appColors

import AppContext from '../../provider';
import helpers from "../../helpers";
import { ChatUs } from '../../components/ChatUs';
// Clear whatever is not used from the helpers
const {
  exist_min_each_day,
  get_thumbnail,
  number_format,
  getCartType,
  groupBy2,
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

const Checkout = (props) => {
  const { navigation, route } = props
  const { sale_id } = route.params;
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
    setCartData,
    // Meal Cart
    mealsCartData,
    setMealsCartData,
  } = useContext(AppContext)

  const { accountInfo, token, user_id } = loginData;
  // console.log("loginData---Checkout", loginData);
  console.log("Checkout Screen Loaded");

  const backPress = () => {
    props.navigation.navigate('AccountStack', { screen: 'MyAccount'})
    // navigation.goBack()
  }

  const animatedRef = React.createRef()

  const [orderDetails, setOrderDetails] = useState(null);

  useFocusEffect(
    useCallback(() => {
      analytics().logEvent('checkout_success');
    }, [])
  );

  useFocusEffect(
    useCallback(() => {

      console.log('CURRENT SALE ID', route.params, sale_id);

      var order_id = sale_id
      var data, error = null

      API.execute("sale.order","read_path",[
            [order_id],
            [
              "date",
              "number",
              "amount_total",
              "ecom_state",
              "auto_cancel_time",
              "latest_cancel_time",

              "is_paid",
              'delivery_slot_id.name',
              'delivery_orders.time_delivered',
              'delivery_orders.state',
              'delivery_orders.slot_id.name',
              'delivery_orders.due_date',
              'delivery_date',
              'due_date',
              'ship_address_id.address',
              'invoices.number',

              "pay_method_id.name",
              "pay_method_id.type",
              "pay_method_id.instructions",

              "plr_pay_error",
              "plr_use_credit_amount",
              "plr_due_amount",
              "plr_pay_for",
              "plr_payment_amount",
              "plr_transfer_amount_rec",
              "plr_can_cancel",
              "plr_can_cancel_reason",
              "plr_can_edit",
              "plr_order_type",
              "plr_is_first_meal_order",
              "plr_is_first_grocery_order",

              "contact_id.card_tokens.mask_card",
              "contact_id.card_tokens.exp_month",
              "contact_id.card_tokens.exp_year",
              "contact_id.receivable_credit",

              "sale_plan_id",
              "sale_plan_id.name",
              "sale_plan_id.credit_amount",

              "max_payment_date",

              "amount_tax",

              // Newly added Total fields
              "amount_total_discount",
              "amount_subtotal",
              "plr_amount_ship",

              "voucher_id.code",

              "payment_qr",
              "payment_qr_date",

              "comments.message", // ?  not sure if this works

              "amount_total_discount_incl_tax",

              // Added for cards
              "card_token_id.mask_card",
              "card_token_id.exp_month",
              "card_token_id.exp_year",
              "card_token_id.token",
              "card_token_id.cvv",
            ]
          ],
          {},
          setIsAnyApiLoading,
          {token, user_id}
          ).then(data=>{
            console.log("data payment", data);
            setOrderDetails(data[0]);
      })

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [sale_id])
  );

  // END - // Functions used to order all the data in an array in case of a multiple delivery

  // Check if a combined delivery is single day or multiple days
  // IsSingleDay
  const isSingleDayDelivery = () => {

    var isSingleDay = orderDetails.delivery_orders.length;
    console.log('isSingleDay',isSingleDay, orderDetails.delivery_orders);
    return isSingleDay;

  }

  // Finished brining in functions from Cart Above

  // Updating Order Comment
  const setOrderComment = (text) => {
    var vals ={
      comments : text,
    }
  }

  // Render Delivery Time for 1 Delivery Address
  const renderTimings = () => {
    if (orderDetails.plr_order_type == "grocery") {
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
          >
            <View style={styles.timeRow}>
              <Image source={clock_ic} style={[
                styles.clockImg,
                { tintColor: green }
              ]}/>
              <Text textAlign="center" smallRegular color={accountSettingGray}>
                {moment(orderDetails.delivery_date).format("YYYY MMM Do")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    } else {
      return null;
    }
  }

  // Rendering a single address
  const renderAddress = () => {

    if (orderDetails.plr_order_type == "grocery") {
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
          >
            <View style={styles.timeRow}>
              <Image
                source={red_location_ic}
                style={[
                  styles.locationImg,
                  { tintColor:  green  },
                ]}
              />
                <Text smallRegular color={accountSettingGray} noOfLines={2} style={styles.flexText}>
                  {orderDetails.ship_address_id ? orderDetails.ship_address_id.address : '-'}
                </Text>
            </View>
          </TouchableOpacity>

          <Input
            placeholderTextColor={placeHolderGrey}
            placeholder={'Any extra details? E.g. leave at building lobby'}
            onEndEditing={e => setOrderComment(e.nativeEvent.text)}
            defaultValue={orderDetails.comments.message}
            inputViewStyle={styles.InputView}
            inputStyle={styles.Input}
            multiline={true}
          />
        </View>
      )
    } else {
      return null;
    }
  }


  // I think it's used for the multi day delivery scenario with different addressess and slots
  // currently seems to work with dummy data
  const renderAddresses = () => {

    return false;
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

    return false;

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

  const renderCartTotals = () => {

    var voucher = null;
    var voucher_error_message = null;
    /*
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
    */

    return (
     <View style={styles.cartMainContainer}>
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
                    color={textDarkGray}
                    style={styles.voucherMargin}
                  >
                    MAKE THIS RED {voucher_error_message}{' '}
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
          {/*
          <View style={styles.furstCartTextRow}>
            <Text lighHeight={17.2} extSmall color={textDarkGray}>
              Subtotal
            </Text>
            <Text color={textDarkGray} extSmall condensed>
              ฿{number_format((orderDetails.amount_subtotal - orderDetails.plr_amount_ship), "0,0")}
            </Text>
          </View>
          */}

          <View style={styles.furstCartTextRow}>
            <Text lighHeight={17.2} extSmall color={textDarkGray}>
              This order includes:
            </Text>
            <Text color={textDarkGray} extSmall condensed>
              {' '}
            </Text>
          </View>


           <View style={styles.cartTextRow}>
            <View style={styles.questionRow}>
              <Text lighHeight={17.2} color={textDarkGray} extSmall>
                VAT
              </Text>
            </View>
            <Text condensed color={textDarkGray} extSmall>
              ฿{number_format(orderDetails.amount_tax, "0,0")}
            </Text>
          </View>

          <View style={styles.cartTextRow}>
            <View style={styles.questionRow}>
              <Text lighHeight={17.2} color={textDarkGray} extSmall>
                Delivery
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsOpenDeliveryPopUp(true);
                  setIsAnyPopupOpened(true);
                }}
              >
                <Image
                  source={question_ic}
                  style={styles.delivertQuestionImg}
                />
              </TouchableOpacity>
            </View>
            <Text condensed color={textDarkGray} extSmall>
              ฿{number_format(orderDetails.plr_amount_ship, "0,0")}
            </Text>
          </View>
          {(orderDetails.amount_total_discount_incl_tax>0) &&
            <View style={styles.cartTextRow}>
              <Text lighHeight={17.2} color={textDarkGray} extSmall>
                Voucher
              </Text>
              <Text extSmall condensed color={textDarkGray}>
                -฿{number_format(orderDetails.amount_total_discount_incl_tax, "0,0")}
              </Text>
            </View>
          }

          {/*
          <View style={styles.cartTextRow}>
            <Text color={darkGray} extSmall lighHeight={17.2}>
              Total{' '}
            </Text>
            <Text condensed color={darkGray} extSmall>
              ฿{number_format(orderDetails.amount_total, "0,0")}
            </Text>
          </View>
          */}

          {(orderDetails.plr_use_credit_amount) &&
            <View style={styles.cartTextRow}>
              <Text color={textDarkGray} lighHeight={17.2} extSmall>
                Store credit applied
              </Text>
              <Text condensed color={textDarkGray} extSmall>
                -฿{number_format(orderDetails.plr_use_credit_amount, "0,0")}
              </Text>
            </View>
          }

          <View style={styles.cartTextRow}>
            <Text color={darkGray} bold extSmall>
              Amount to pay:
            </Text>
            <Text condensedBold color={darkGray} extSmall>
              ฿{number_format(orderDetails.plr_payment_amount, "0,0")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const getPaymentMethod = () => {
    var payment_method = null;
    if (orderDetails) {
      if (orderDetails.pay_method_id) {
        payment_method = orderDetails.pay_method_id.id;
      }
    }
    return payment_method;
  }

  const getCardToken = () => {
    var card_token = null;
    if (orderDetails) {
      if (orderDetails.card_token_id) {
        card_token = orderDetails.card_token_id;
      }
    }
    return card_token;
  }

  // PAYMENT METHODS
  // Cart Details at the bottom of the screen
  const renderCartDetails = () => {

    const imageStyles = [{ ...styles.cardImg }]

    // const cartType = getCartType(cartData, mealsCartData);

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

            var payment_method_title = card_token_id.mask_card; // This is just a sample, need card details from NF Credit / debit card
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
      } else  if (payment_method == 12) {
         var payment_method_title = 'Paleo Credit';
        var payment_method_image = instore_ic;
        var payment_method_code = '';
      }
    }

    var voucher = null;
    // Voucher details
    /*
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
    */

    console.log('payment_method',payment_method);

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
        </View>

        {/* Payments */}
        {/* Normal Payment methods or No Payment Method*/}
        <TouchableOpacity
          style={[styles.paymentRow]}
          onPress={() => {
            navigation.navigate('PaymentMethods', { flow:'saleOrderCheckout', soNumber: sale_id })
          }}
        >
          <View style={styles.timeRow}>
            {(payment_method!= null) ?
              (
                <React.Fragment>
                  <Image
                    source={payment_method_image}
                    style={[imageStyles]}
                  />
                  <View style={{ marginTop: payment_method == 17 ? -3 : 0, }}>
                    <Text color={accountSettingGray} smallRegular>
                      {payment_method_title + ' ' +  payment_method_code}
                    </Text>
                  </View>
                </React.Fragment>
              )
              :
              (
                <React.Fragment>
                  <View style={styles.timeRow}>
                    <Image source={wallet_red_ic} style={styles.cardImg} />
                    <Text color={darkGrey} smallRegular>
                      Select payment method
                    </Text>
                  </View>
                </React.Fragment>
              )
            }
          </View>
          <Image source={right_arrow} style={styles.arrowImg} />
        </TouchableOpacity>

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

    var payment_method = getPaymentMethod();
    console.log('payment_method',payment_method);

    var card_token_id = getCardToken();


    var plan_id = null;
    var redirect_to = 'success';

    // In order to only create SO's with QR for testing
    if ((payment_method == 15) || (payment_method == 8)) {

      var soNumber = sale_id;

      var x=1;
      if (x==1) {

        /*
        // This logic needs to be tied in somehow to the Credits ... leave it for later
        if (cartType=='grocery') {
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
        } else if (cartType == 'combined') {
          if ((mealsCartData.amount_total_combined -  mealsCartData.amount_credit_combined)<= 0) {
            redirect_to = 'success';
          } else {
            redirect_to = 'payment';
          }
        }
        */

        redirect_to = 'payment';

        if (redirect_to == 'success') {
          // Redirect to Success page as it was payed via credit


        } else if (redirect_to == 'payment') {
          // Depending on the payment method we redirect to various screens
          // QR Code scenario
          if (payment_method == 15) {

            await API.execute("sale.order","gen_qr_kbank",[[soNumber]],{},setIsAnyApiLoading,{token, user_id}).then(res=>{
              console.log('data.sale_id before redirect', soNumber);
              setIsPaymentProcessing(false);
              navigation.navigate('QRCode', {sale_id: soNumber});
            })

          // Paypal
          } else if (payment_method == 17) {
            setIsPaymentProcessing(false);
            alert('Payment method not implemented yet');
            // navigation.navigate('CheckoutSuccess', {sale_id: 190773});

          // 2c2p
          } else if(payment_method == 8) {

            if (card_token_id) {

              var vals = {
                card_token_id: card_token_id.id
              };

              await API.execute("sale.order","write",[[soNumber],vals],{},setIsAnyApiLoading,{token, user_id}).then(res=>{

              })

              // Ask to do it directly in netforce
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

              console.log('Done');

              let params = {
                  uniqueTransactionCode: payment_transaction.toString(),
                  desc: "Order "+soNumber,
                  amount: payment_amount,
                  currencyCode:"764",
                  storeCardUniqueID: card_token_id.token.toString(),
                  securityCode: card_token_id.cvv.toString(), // Testing only - Adjust with saved security code
              };

              console.log('2c2p params', params);

              let res = await My2c2p.payCreditCard(params);
              console.log("2c2p Response",res);
              let code=res.respCode;
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

    // Paypal
    } else if (payment_method == 17) {
      setIsPaymentProcessing(false);
      alert('Payment method not implemented yet');
      // navigation.navigate('CheckoutSuccess', {sale_id: 190773});

    // 2c2p
    } else if(payment_method == 8) {
      setIsPaymentProcessing(false);
      alert('Payment method not implemented yet');
      // navigation.navigate('CheckoutError', {sale_id:190767, transaction_id: 93522});

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
  const validateInput = () => {
    if (getPaymentMethod() != null) { // selectTimeSlot && selectedAddress &&
      return true
    }
    return false
  }

  const validation = validateInput()

  if (orderDetails) {

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
              condensedTitle={'Pay For ' + orderDetails.number}
            />
            <View style={styles.body}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {(isSingleDayDelivery() == 1 || isSingleDayDelivery() == 0) ?
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
                disabled={!validation}
                btnTitle={'Place order'}
                style={[
                  styles.checkoutBtn,
                  {
                    backgroundColor: !validation ? greenButtonOpacity : quantityGreen,
                  },
                ]}
              />
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
            </View>
          </>
        }
      </View>
    )

  } else {
    return null;
  }
}

export default Checkout