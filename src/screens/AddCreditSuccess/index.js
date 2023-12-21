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
import helpers from "../../helpers";
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
  close,
} = appImages

const CheckoutSuccess = (props) => {
  const { navigation, route} = props;
  const { transaction_id, credit } = route.params;
  const { setIsAnyApiLoading,
    loginData,
    setLoginData} = useContext(AppContext)
   
  const { accountInfo, token, user_id } = loginData;
  
  const [orderDetails, setOrderDetails] = useState(null)
  
  const [showModal, setShowModal] = useState(false)
  const [invoiceURL, setInvoiceURL] = useState(null)
  
  useFocusEffect(
    useCallback(() => {
      
      console.log('CURRENT SALE ID', route.params, transaction_id);
      
      var trans_id = parseInt(transaction_id);

      // Ask to do it directly in netforce
      API.execute("payment.transaction","read_path",[
            [trans_id],
            [
              "error",
              "amount",
              "state", // in_progress / done
              "kbank_qr_payment_qr",
              "start_time",
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
    }, [transaction_id])
  );
  
  useFocusEffect(
    useCallback(() => {
      getUserData();
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

  const onBackPress = () => {
    navigation.navigate("PaleoWallet");
  }
  
  if (orderDetails) {
    console.log('orderDetails',orderDetails);

    return (
      <View>
        <AccountHeader
          title={'Payment received'}
          backPress={() => onBackPress}
          crossBtn={close}
        />
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
            We received your payment and your Paleo Credit has been added to your
            account.
          </Text>
          <View style={styles.line} />
          <View style={styles.containerRow}>
            <View style={styles.minContainer}>
              <Text small bold color={textDarkGray}>
                ORDER TOTAL
              </Text>
              <Text
                color={accountSettingGray}
                lineHeight={20}
                condensed
                style={styles.marginSmall}
              >
                ฿{number_format(orderDetails.amount, "0,0")}
              </Text>
            </View>
            <View style={styles.minLeftContainer}>
              <Text small bold color={textDarkGray}>
                ORDER DATE
              </Text>
              <View style={styles.minWidh}>
                <Text
                  color={accountSettingGray}
                  lineHeight={20}
                  style={styles.marginSmall}
                >
                  {moment(orderDetails.start_time).format("YYYY MMM Do")}
                </Text>
              </View>
            </View>
          </View>
          <Button
            onPress={() => {
              onBackPress;
            }}
            style={styles.homeBtn}
            small
            btnTitle={'Back to home'}
            textStyle={styles.text}
          />
        </View>
      </View>
    )
  
  } else {
    return null;
  }
}

export default CheckoutSuccess
