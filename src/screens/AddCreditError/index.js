import React, { useState, useContext, useCallback } from 'react'

import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import styles from './Styles'
import { appColors, appImages } from '../../theme'

import Services from '../../services'
const { API } = Services

import {
  Text,
  Button,
} from '../../components/'

const {
  black,
  lessDarkGray,
  accountSettingGray,
  sharpGreen,
  darkBlue,
} = appColors

import AppContext from '../../provider'
import helpers from "../../helpers";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  caveman_error,
} = appImages

const CheckoutError = (props) => {
  const { navigation, route} = props;
  const { transaction_id, credit, flow } = route.params;
  const { setIsAnyApiLoading,
   loginData} = useContext(AppContext)

  const { token, user_id } = loginData;

  const [orderDetails, setOrderDetails] = useState(null)

  useFocusEffect(
    useCallback(() => {

      console.log('CURRENT SALE ID', route.params, transaction_id);

      var trans_id = parseInt(transaction_id);

      // Ask to do it directly in netforce
      API.execute("payment.transaction","read_path",[
            [trans_id],
            [
              "error",
              // "amount_ship",
              "related_id",
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

  const backPress = () => {
    navigation.navigate('PaymentMethods', { flow:flow , credit: credit }) 
  }

  if (orderDetails) {

    console.log('orderDetails',orderDetails);
    const insets = useSafeAreaInsets();

    return (
      <ScrollView>
        <View style={[styles.successContainer, { paddingTop: insets.top}]}>
          <Image style={styles.forgotRestImg} source={caveman_error} />

          <Text
            style={styles.successTitle}
            largeRegularBetween
            textAlign={'center'}
            color={black}
            condensedBold
            lineHeight={24}
          >
            There was an error{'\n'}processing your payment.
          </Text>
          <View style={styles.line} />

          <View style={styles.fullWidth}>
            <Text color={accountSettingGray} lineHeight={20}>
              It seems there was some problem with your payment. Here are the
              details from the credit card processor for us to help figure out
              the issue.
            </Text>

            <View style={styles.blueLayout}>
              <View style={styles.minContainer}>
                <Text small bold color={darkBlue} lineHeight={16}>
                  TRANSACTION NUMBER
                </Text>
                <Text
                  color={accountSettingGray}
                  lineHeight={21.32}
                  regular
                  style={styles.errorInnerText}
                >
                  {orderDetails.id}
                </Text>
              </View>

              <View style={styles.minContainer}>
                <Text small bold color={darkBlue} lineHeight={16}>
                  ERROR MESSAGE
                </Text>
                <Text
                  color={accountSettingGray}
                  lineHeight={21.32}
                  regular
                  style={styles.errorInnerText}
                >
                  {orderDetails.error}
                </Text>
              </View>
            </View>
            <Text
              smallRegular
              condensedBold
              color={black}
              lineHeight={22}
              style={[styles.messageChat, styles.messageChatMargin]}
            >
              Feel like this should work?
            </Text>

            <Text
              smallRegular
              condensedBold
              color={black}
              lineHeight={22}
              style={styles.messageChat}
            >
              Screenshot this page and send to us in the chat below.
            </Text>
          </View>
          <ChatUs></ChatUs>
          <Button
            onPress={() => {
              backPress();
            }}
            style={styles.backBtn}
            btnTitle={'Go back to checkout to try again'}
            textStyle={styles.text}
          />
        </View>
      </ScrollView>
    )
  } else {
    return null
  }
}

export default CheckoutError
