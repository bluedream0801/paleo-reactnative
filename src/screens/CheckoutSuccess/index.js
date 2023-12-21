import React, { useState, useContext, useEffect, useCallback } from 'react'

import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  Animated,
} from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import styles from './Styles'
import { appColors, appImages } from '../../theme'
import AsyncStorage from "@react-native-async-storage/async-storage";

import TimeSlot from "../PickupTimeSlot";
import Services from '../../services'
import moment from "moment";
const { API } = Services
import InvoicePopup from '../OrderDetails/InvoicePopup'

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

import AppContext from '../../provider'
import helpers, { AppsFyler } from "../../helpers";
import { chatUs } from '../../helpers/contact'
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
} = appImages

const CheckoutSuccess = (props) => {
  const { navigation, route} = props;
  const { sale_id } = route.params;
  const { setIsAnyApiLoading,
    loginData,
    setLoginData,
    setRefId,
    refVoucher, 
    setRefVoucher} = useContext(AppContext)
   
  const { accountInfo, token, user_id } = loginData;
  
  const [orderDetails, setOrderDetails] = useState(null)
  
  const [showModal, setShowModal] = useState(false)
  const [invoiceURL, setInvoiceURL] = useState(null)
  
  useFocusEffect(
    useCallback(() => {
      
      console.log('CURRENT SALE ID', route.params, sale_id);
      
      var order_id = sale_id
      var data, error = null
      
      // Ask to do it directly in netforce
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
              "delivery_slot_id.name",
              "delivery_date",
              "due_date",
              "ship_address_id.address",
              "invoices.number",
              
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
              // "amount_ship",
              "amount_total",
              "voucher_id.code",
              
              "payment_qr",
              "payment_qr_date",
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
  
  useFocusEffect(
    useCallback(() => {
      if (orderDetails) {
        AppsFyler.logEvent('checked_out_success', {
          af_currency: 'THB',
          af_revenue: orderDetails.amount_total,
        });
      }
    }, [orderDetails])
  );
  
  useFocusEffect(
    useCallback(() => {
      getUserData();
      AsyncStorage.removeItem("referralId");
      AsyncStorage.removeItem("refVoucher");
      setRefVoucher(null);
      setRefId(null);
    }, [])
  );
  
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
  
  const downLoadInvoice = async () => {
    const openLink =
      'https://backend.paleorobbie.com/render_page_pdf?page_id=48&active_id=' +
      orderDetails.invoices[0].id +
      '&database=plr&user_id=' +
      user_id +
      '&company_id=1&token=' +
      token +
      '&lang=en_US&no_download=1'

    setInvoiceURL(openLink)
    setShowModal(true)
  }

  const backPress = () => {
    navigation.goBack()
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Home");
    }, 10000);

    return () => {
      clearTimeout(timer);
    }
  }, []);

  if (orderDetails) {
    console.log('orderDetails',orderDetails);
    
    var meal = false, grocery = false;
    if (orderDetails.plr_order_type == "meal") {
      meal = true;
    } else if (orderDetails.plr_order_type == "grocery") {
      grocery = true;
    } if (orderDetails.plr_order_type == "combined") {
      meal = true;
      grocery = true;
    }

    return (
      <View style={styles.container}>
        <MarketHeader
          searchEnabled={false}
          condensedTitle={`Order ${orderDetails.number}`}
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.successContainer}>
              <Image style={styles.forgotRestImg} source={forgot_reset} />

              <Text
                largeTitlePlus
                textAlign={'center'}
                color={black}
                condensedBold
                style={styles.success}
              >
                Success!
              </Text>
              <Text
                style={styles.successTitle}
                largeRegularBetween
                textAlign={'center'}
                color={black}
                condensedBold
                lineHeight={24}
              >
                We received your payment and{'\n'}your order is being processed.
              </Text>
              <View style={styles.line} />

              <View style={styles.fullWidth}>
                <View style={styles.containerRow}>
                  <View style={styles.minContainer}>
                    <Text small bold color={textDarkGray} lineHeight={16}>
                      ORDER TOTAL
                    </Text>
                    <Text
                      color={accountSettingGray}
                      lineHeight={18.32}
                      condensed
                      style={styles.marginSmall}
                      regular
                    >
                      ฿{number_format(orderDetails.amount_total, "0,0")}
                    </Text>
                  </View>

                  <View style={styles.shipping}>
                    <Text color={darkBlue} bold small>
                      {'DELIVERY SCHEDULED'}
                    </Text>
                  </View>
                </View>

                <View
                  style={[styles.containerRow, styles.topPadding, styles.widthRow]}
                >
                  <View style={styles.minContainer}>
                    <Text small bold color={textDarkGray} lineHeight={16}>
                      ORDER DATE
                    </Text>
                    <Text
                      color={accountSettingGray}
                      lineHeight={20}
                      condensed
                      style={styles.marginSmall}
                    >
                      {moment(orderDetails.date).format("YYYY MMM Do")}
                    </Text>
                  </View>
                  
                  {((grocery) && (orderDetails.plr_order_type != "combined")) &&
                    <View style={styles.minLeftContainer}>
                      <Text small bold color={textDarkGray} lineHeight={16}>
                        PLANNED DELIVERY
                      </Text>
                      <View style={styles.minWidh}>
                        <Text
                          color={accountSettingGray}
                          lineHeight={20}
                          style={styles.marginSmall}
                        >
                          {moment(orderDetails.delivery_date).format("YYYY MMM Do")}
                        </Text>
                      </View>
                    </View>
                  }

                  {(grocery && orderDetails.delivery_slot_id  && orderDetails.plr_order_type != "combined") &&
                    <View style={styles.minLeftContainer}>
                      <Text small bold color={textDarkGray} lineHeight={16}>
                        TIME SLOT
                      </Text>
                      <View style={styles.minWidh}>
                        <Text
                          color={accountSettingGray}
                          lineHeight={20}
                          style={styles.marginSmall}
                        >
                          {orderDetails.delivery_slot_id.name}
                        </Text>
                        {/*
                        <Text color={accountSettingGray} lineHeight={15} small>
                          9am to 7pm
                        </Text>
                        */}
                      </View>
                  </View>
                  }
                </View>

                {((grocery) && (orderDetails.plr_order_type != "combined")) &&
                  <>
                    <Text
                      small
                      bold
                      color={textDarkGray}
                      lineHeight={16}
                      style={styles.shippingAddress}
                    >
                      SHIPPING ADDRESS
                    </Text>
                    <View style={styles.minWidh}>
                      <Text
                        color={accountSettingGray}
                        lineHeight={20}
                        style={styles.marginSmall}
                      >
                        {orderDetails.ship_address_id ? orderDetails.ship_address_id.address : "Not exist"}
                      </Text>
                    </View>
                  </>
                }
              </View>
              <Button
                onPress={() => {
                  downLoadInvoice()
                }}
                style={styles.homeBtn}
                small
                btnTitle={'Download invoice'}
                textStyle={styles.text}
              />
            </View>
            
            <InvoicePopup
              showModal={showModal}
              orderDetails={orderDetails}
              invoiceURL={invoiceURL}
              token={token}
              user_id={user_id}
              setShowModal={() => {
                setShowModal(false)
              }}
            />
            
          </ScrollView>
        </View>
      </View>
      
    )
  
  } else {
    return null;
  }
}

export default CheckoutSuccess
