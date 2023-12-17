import React, { useState, useContext, useCallback } from 'react'

import {
  View,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import { My2c2p } from '../../helpers/my2c2p';

import * as momenttz from 'moment-timezone';

import { useFocusEffect } from '@react-navigation/native'

import styles from './Styles'
import AppContext from '../../provider'
import { AccountHeader, Text, Button } from '../../components'
import { appFonts, appColors, appImages } from '../../theme'

import CVVPopup from './VoucherPopup'

import Services from '../../services'
const { API } = Services

const {
  accountSettingGray,
  orderDarkGray,
  buttonOpacity,
  black,
  textDarkGray,
} = appColors

import helpers from "../../helpers";
// Clear whatever is not used from the helpers
const {
  getCartType,
  number_format,
  formatCreditCardNumber,
} = helpers;

const {
  right_arrow,
  master_card_ic,
  visa_ic,
  delete_ic,
  circle_animation,
  express_ic,
  paypal_logo,
  small_qrcode_ic,
  forgot_reset,
  close,
  tick_ic,
  instore_ic,
} = appImages

const CardsArray = [
  {
    titleText: '5577 55 ** **** 2912',
    smallText: 'Mastercard',
    smallTitle: 'Mastercard',
    image: master_card_ic,
    isSelected: false,
    code: '2912',
    pay_method_id: 8,
    cvv: null,
  },
]

const OtherMethodsArray = [
  {
    titleText: 'Credit / debit card',
    smallText: 'Tap to add card details',
    smallTitle: 'Credit / debit card',
    image: master_card_ic,
    cardRow: true,
    isSelected: false,
    code: '',
    pay_method_id: 8,
    cvv: null,
  },
  {
    titleText: 'Pay by QR code',
    smallText: 'Mobile banking app',
    smallTitle: 'Thai QR code',
    image: small_qrcode_ic,
    cardRow: false,
    isSelected: false,
    code: '',
    pay_method_id: 15,
    cvv: null,
  },
  {
    titleText: 'Paypal',
    smallText: 'Accepts most cards, no Paypal account needed',
    smallTitle: 'Paypal',
    image: paypal_logo,
    cardRow: false,
    isSelected: false,
    code: '',
    pay_method_id: 17,
    cvv: null,
  },
]
// 13 amex

const PaymentMethods = (props) => {
  const { navigation, route } = props
  const { flow } = route.params
  const [cardDataArray, updateCardDataArray] = useState(CardsArray)

  const [cardDetails, setCardsDetails] = useState(null)

  const [otherMethodsDataArry, updateOtherMethodsDataArry] = useState(
    OtherMethodsArray,
  )
  const [isSuccessVisisble, setIsSuccessVisisble] = useState(false)


  const [isCvvConfirmPopUpOpen, setIsCvvConfirmPopUpOpen] = useState(false)

  const {
    setIsPaymentProcessing,
    isPaymentProcessing,
    setSelectedPaymentMethod,
    selectedPaymentMethod,

    loginData,

    // Cart Related Context
    // Grocery Cart
    cartData,
    setCartData,
    // Meal Cart
    mealsCartData,
    setMealsCartData,
    setIsAnyApiLoading,

    setIsAnyPopupOpened,
    setIsApiLoaderShowing,
    setLoginData,
  } = useContext(AppContext)

  const { accountInfo, token, user_id } = loginData;
  const { first_name, receivable_credit } = accountInfo.contact_id;
  console.log("loginData---Payment Methods", loginData);

  useFocusEffect(
    useCallback(() => {

      API.execute("contact","read_path",[
          [accountInfo.contact_id.id],
          [
            "card_tokens.token",
            "card_tokens.mask_card",
            "card_tokens.exp_month",
            "card_tokens.exp_year",
            "card_tokens.cvv",
          ]
        ],
        {},
        setIsAnyApiLoading,
        {token, user_id}
        ).then(data=>{
          console.log("data cards", data);

          var cardsList = data[0];

          var card_line = {};
          var cardsArray = [];

          cardsList.card_tokens.forEach((card) => {

            var first_card_number = card.mask_card.charAt(0);
            var card_type = '';
            var card_image = '';
            if (first_card_number == 4 ) {
              card_type = 'Visa';
              card_image = visa_ic;
            } else if (first_card_number == 5 ) {
              card_type = 'Mastercard';
              card_image = master_card_ic;
            }
            card_line =
            {
              titleText: card.mask_card,
              smallText: card_type,
              smallTitle: card_type,
              image: card_image,
              isSelected: false,
              code: '2912',
              pay_method_id: 8,
              card_id : card.id,
              token : card.token,
              cvv: card.cvv,
            }
            cardsArray.push(card_line);
          });
          console.log('cardsArray',cardsArray);
          updateCardDataArray(cardsArray);
          // setCardsDetails(data[0]);
      })

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        // Added for checking if the users receivable credit has changed
        if (loginData) {
          var users_receivabile_credit = await getUsersReceivableCredit();
          if (users_receivabile_credit && users_receivabile_credit[0]) {
            console.log('Credits comparison',users_receivabile_credit[0].contact_id.receivable_credit,receivable_credit)
            if (users_receivabile_credit[0].contact_id.receivable_credit != receivable_credit) {
              await getUserData();
            } else {
              console.log('User credit has not changed');
            }
          }
        }

      }
      fetchData();
    }, [])
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

  const onBackPress = () => {
    navigation.goBack()
  }

  // Review Card Related Functions later
  const onPressSavedCard = (index) => {
    const array = Object.assign([], cardDataArray)
    for (let i = 0; i < cardDataArray.length; i++) {
      if (index == i) cardDataArray[i].isSelected = !cardDataArray[i].isSelected
      else {
        cardDataArray[i].isSelected = false
      }
      setSelectedPaymentMethod(cardDataArray[index])
    }

    updateCardDataArray(array)
    const secondArray = Object.assign([], otherMethodsDataArry)
    for (let i = 0; i < otherMethodsDataArry.length; i++) {
      otherMethodsDataArry[i].isSelected = false
    }
    updateOtherMethodsDataArry(secondArray)
  }

  const onPressOtherCard = (index) => {
    if (index == 0) return // need to navigate and add cards

    console.log('otherMethodsDataArry[index]',otherMethodsDataArry[index])
    if (otherMethodsDataArry[index].pay_method_id == 17) {
      alert('Payment method not yet available in the app. If you want to use Paypal, please log in into the web');
      return false;
    }

    const array = Object.assign([], otherMethodsDataArry)
    for (let i = 0; i < otherMethodsDataArry.length; i++) {
      if (index == i) {
        otherMethodsDataArry[i].isSelected = !otherMethodsDataArry[i].isSelected
      } else {
        otherMethodsDataArry[i].isSelected = false
      }
      setSelectedPaymentMethod(otherMethodsDataArry[index])
    }

    updateOtherMethodsDataArry(array)

    const secondArray = Object.assign([], cardDataArray)
    for (let i = 0; i < cardDataArray.length; i++) {
      cardDataArray[i].isSelected = false
    }
    updateCardDataArray(secondArray)
  }

  const onPlaceOrder = async () => {
    if (flow == 'cartCheckout' || flow=='saleOrderCheckout') {
      await setSelectedPayment(selectedPaymentMethod.pay_method_id, selectedPaymentMethod.cvv);
    } else {
      console.log('selectedPaymentMethod.pay_method_id',selectedPaymentMethod.pay_method_id);
      await processCreditPayment(selectedPaymentMethod.pay_method_id, selectedPaymentMethod.cvv);
    }
  }

  const validateInputs = () => {
    let validate = false
    for (let i = 0; i < otherMethodsDataArry.length; i++) {
      if (otherMethodsDataArry[i].isSelected) {
        validate = true
      }
    }
    for (let i = 0; i < cardDataArray.length; i++) {
      if (cardDataArray[i].isSelected) {
        validate = true
      }
    }

    return validate
  }

  /*
  const renderCard = (obj, i) => {

    var first_card_number = obj.mask_card.charAt(0);
    var card_type = '';
    var card_image = '';
    if (first_card_number == 4 ) {
      card_type = 'Visa';
      card_image = visa_ic;
    } else if (first_card_number == 5 ) {
      card_type = 'Mastercard';
      card_image = master_card_ic;
    }

    return (
      <TouchableOpacity
        onPress={() => onPressSavedCard(i)}
        style={[
          styles.cardCell,
          {
            borderBottomWidth: cardDataArray.length == i + 1 ? 0 : 1,
          },
        ]}
        key={i}
      >
        <View style={styles.smallRow}>
          <Image style={[styles.card]} source={obj.image} />
          <View>
            <Text bold small color={accountSettingGray}>
              {obj.mask_card}
            </Text>
            <Text tiny color={accountSettingGray} style={styles.textMargin}>
              {card_type}
            </Text>
          </View>
        </View>
        {!obj.isSelected && (
          <TouchableOpacity
            onPress={() => onPressSavedCard(i)}
            style={styles.circle}
          ></TouchableOpacity>
        )}
        {obj.isSelected && (
          <TouchableOpacity
            onPress={() => onPressSavedCard(i)}
            style={styles.coloredCircle}
          ></TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }
  */

  const renderCard = (obj, i) => {
    return (
      <TouchableOpacity
        onPress={() => onPressSavedCard(i)}
        style={[
          styles.cardCell,
          {
            borderBottomWidth: cardDataArray.length == i + 1 ? 0 : 1,
          },
        ]}
        key={i}
      >
        <View style={styles.smallRow}>
          <Image style={[styles.card]} source={obj.image} />
          <View>
            <Text bold small color={accountSettingGray}>
              {formatCreditCardNumber(obj.titleText)}
            </Text>
            <Text tiny color={accountSettingGray} style={styles.textMargin}>
              {obj.smallText}  - CVV: {(obj.cvv) && <>{obj.cvv}</>}
            </Text>
          </View>
        </View>
        {!obj.isSelected && (
          <TouchableOpacity
            onPress={() => onPressSavedCard(i)}
            style={styles.circle}
          ></TouchableOpacity>
        )}
        {obj.isSelected && (
          <TouchableOpacity
            onPress={() => onPressSavedCard(i)}
            style={styles.coloredCircle}
          ></TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }

  // Updating Order Comment
  const setSelectedPayment = async (payment_method, cvv) => {
    console.log('set payment_method',payment_method, selectedPaymentMethod.pay_method_id, cvv);
    // Popup for confirming cvv
    if (payment_method == 8 && cvv == null) {

      setIsCvvConfirmPopUpOpen(true)
      setIsAnyPopupOpened(true)

    // Normal flow
    } else {
      
      if (payment_method == 8) {
        var vals ={
          pay_method_id : payment_method,
          card_token_id : selectedPaymentMethod.card_id,
        }
      } else {
        var vals ={
          pay_method_id : payment_method,
        }
      }

      if (flow=='cartCheckout') {
        const cartType = getCartType(cartData, mealsCartData);
        if (cartType == 'grocery') {
          console.log('Setting Payment Method on Cart',global.cartId,payment_method,cartType);
          await API.grocery_cart_write(
            vals,
            setMealsCartData,
            setCartData,
            cartType,
            'no',
            { token, user_id },
            'change_payment'
          );
        } else {
          await API.meal_cart_write(
            vals,
            setMealsCartData,
            setCartData,
            cartType,
            'no',
            { token, user_id },
            'change_payment'
          );
          await API.grocery_cart_write(
            vals,
            setMealsCartData,
            setCartData,
            cartType,
            'no',
            { token, user_id },
            'change_payment'
          );
        }

      }

       // Need to add option for saving card id to sale order before processing
      if (flow=='saleOrderCheckout') {

        await API.execute("sale.order","write",[[route.params.soNumber],vals],{},setIsAnyApiLoading,{token, user_id}).then(res=>{

        })

        // await API.execute("sale.order","save_pay_method",[[route.params.soNumber],payment_method],{},setIsAnyApiLoading,{token, user_id}).then(res=>{

        // })
      }

      navigation.goBack()

    }

  }

  const processCreditPayment = async (payment_method, cvv) => {
    var credit = route.params.credit;
    console.log('Processing Credit with payment method',payment_method, credit);

    console.log('set payment_method',payment_method, selectedPaymentMethod, selectedPaymentMethod.pay_method_id, cvv);

    // Popup for confirming cvv
    if (payment_method == 8 && cvv == null) {

      setIsCvvConfirmPopUpOpen(true)
      setIsAnyPopupOpened(true)

    // Normal flow
    } else {
      
      setIsPaymentProcessing(true)

      // Implement the payment flows for credit
      if (payment_method == 15) {

        var ctx = {
          contact_id: accountInfo.contact_id.id,
          amount: credit,
          currency_id: 3,
        };

        API.execute("payment.method","start_payment",[[15]],{context:ctx},setIsAnyApiLoading,{token, user_id}).then(data=>{
          console.log('Kbank QR data',data)
          // Send those arguments to teh Qr code page
          console.log('Kbank QR data Fields',data.transaction_id, data.payment_qr_txn, data.payment_qr, data.payment_qr_date);
          // alert('QR code details have been generated. Transaction id:' + data.transaction_id);
          // Redirect to Kbank QR based on transaction
          setIsPaymentProcessing(false);
          navigation.navigate('QRCodeTransaction', {transaction_id: data.transaction_id, credit:credit, payment_qr:data.payment_qr, flow:flow});

        }).catch(err=>{
          console.log("Error: ",err);
        });

      // Paypal
      } else if (payment_method == 17) {
        setIsPaymentProcessing(false);
        alert('Payment method not implemented yet');
        // navigation.navigate('AddCreditSuccess', {transaction_id: 94003, flow:flow}); // Testing for now

      // 2c2p
      } else if(payment_method == 8) {
        // setIsPaymentProcessing(false);
        // alert('Payment method not implemented yet');
        // navigation.navigate('AddCreditError', {transaction_id: 93852, credit:credit, flow:flow}); // Testing for now

        var card_token_id = selectedPaymentMethod.card_id;

        if (card_token_id) {

          var payment_amount = credit;

          var vals = {
            "type": "2c2p",
            "pay_method_id": payment_method,
            "amount": payment_amount,
            "fee_amount": 0, // Ask about it
            "currency_id": 3,
            "contact_id": accountInfo.contact_id.id,
            // "related_id": null,
            "card_token_id": card_token_id,
            "2c2p_enc_card": '',
            "2c2p_mask_card": selectedPaymentMethod.card_id,
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

          let params={
              uniqueTransactionCode: payment_transaction.toString(),
              desc: "Credit for "+accountInfo.contact_id.id,
              amount: payment_amount,
              currencyCode:"764",
              storeCardUniqueID: selectedPaymentMethod.token.toString(),
              securityCode: selectedPaymentMethod.cvv.toString(), // Testing only - Adjust with saved security code
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
            if (flow == 'cartCheckoutAddCredit') {
              navigation.navigate('Checkout');
            } else {
              navigation.navigate('PaleoWallet');
            }
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
            navigation.navigate('AddCreditError', {flow:flow, transaction_id: payment_transaction, credit:credit});
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

  const onPressNewCard = () => {
    navigation.navigate('AddCard');
    // , flow:flow
    /*
    if (flow == 'cartCheckout' || flow=='saleOrderCheckout') {
      navigation.navigate('AddCard', flow:flow);
    } else {
      navigation.navigate('AddCard', flow:flow, credit:credit);
    }
    */
  }

  const renderPaymentMethod = (obj, i) => {
    const imgStyles = [styles.smalpeCard]
    if (i > 0) {
      imgStyles.push(styles.cardImg)
    }
    return (
      <TouchableOpacity
        style={[styles.cardCell]}
        key={i}
        onPress={() => {
          if (obj.cardRow) {
            onPressNewCard()
          } else {
            onPressOtherCard(i)
          }
        }}
      >
        <View style={styles.smallRow}>
          <Image style={[imgStyles]} source={obj.image} />
          <View>
            <Text bold small color={accountSettingGray}>
              {obj.titleText}
            </Text>
            <Text tiny color={accountSettingGray} style={styles.textMargin}>
              {obj.smallText}
            </Text>
          </View>
        </View>
        {obj.cardRow && (
          <View style={styles.smallRow}>
            <View style={styles.cardsRow}>
              <Image style={[styles.smallCard]} source={visa_ic} />
              <Image style={[styles.smallCard]} source={master_card_ic} />
              <Image style={[styles.smallCard]} source={express_ic} />
            </View>
            <Image style={[styles.arrow]} source={right_arrow} />
          </View>
        )}

        {!obj.cardRow && !obj.isSelected && (
          <TouchableOpacity
            onPress={() => onPressOtherCard(i)}
            style={styles.circle}
          ></TouchableOpacity>
        )}
        {!obj.cardRow && obj.isSelected && (
          <TouchableOpacity
            onPress={() => onPressOtherCard(i)}
            style={styles.coloredCircle}
          ></TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }

  const renderPaymentMethods = () => {
    return (
      <View style={styles.newCard}>
        <Text smallRegular color={orderDarkGray} style={styles.smallHeading}>
          Other methods
        </Text>

        {otherMethodsDataArry.map((item, index) =>
          renderPaymentMethod(item, index),
        )}
      </View>
    )
  }
  const validation = validateInputs()

  const renderInStoreCard = () => {
    return (
      <TouchableOpacity
        onPress={async () => {
          if (flow == 'cartCheckout') {
            navigation.navigate('StoreCreditPackages', {flow:'cartCheckoutAddCredit' })
          }
          if (flow == 'cartCheckoutSO') {
          }
        }}
        style={[
          styles.cardCell,
          {
            borderBottomWidth: 1,
          },
        ]}
      >
        <View style={styles.smallRow}>
          <Image style={[styles.inStorecard]} source={instore_ic} />
          <View>
            <Text bold small color={accountSettingGray}>
              Paleo Wallet
            </Text>
            <Text tiny color={accountSettingGray} style={styles.textMargin}>
              Current balance: {" "}฿{receivable_credit ? receivable_credit : 0}
            </Text>
          </View>
        </View>
        <Text small color={black}>
          Add credit
        </Text>
      </TouchableOpacity>
    )
  }

  const renderInStoreCredit = () => {
    return (
      <View style={styles.storeSection}>
        <Text
          color={orderDarkGray}
          smallRegular
          lineHeight={18.53}
          style={styles.storeText}
        >
          In-store credit
        </Text>
        {renderInStoreCard()}
        <View style={styles.storeInner}>
          <Text minSmall color={textDarkGray} bold lineHeight={14.77}>
            Recommended for regular customers. Why?
          </Text>
          <View style={styles.tickRow}>
            <Image source={tick_ic} style={styles.tick} />
            <Text small color={accountSettingGray} lineHeight={25.88}>
              Makes checkout instant - no waiting for card processing
            </Text>
          </View>
          <View style={styles.tickRow}>
            <Image source={tick_ic} style={[styles.tick, styles.tickDown]} />
            <Text small color={accountSettingGray} lineHeight={15.88} style={{flex: 1}}>
              Save on your shopping! Bonus credit (2-2.5%) given for the top two
              package levels
            </Text>
          </View>
        </View>
      </View>
    )
  }

  /*
  const renderCardList = () => {
    return (
      <View style={styles.cardList}>
        <ScrollView>
          <Text smallRegular color={orderDarkGray} style={styles.smallHeading}>
            Saved cards
          </Text>

          {(cardDetails !== null) &&
            <>
              {cardDetails.card_tokens.map((item, index) => renderCard(item, index))}
            </>
          }

          {(cardDetails !== null) &&
            <>
              {cardDetails.card_tokens.map((item, index) => renderCard(item, index))}
            </>
          }

          {renderPaymentMethods()}
          {(flow == 'cartCheckout') && renderInStoreCredit()}
        </ScrollView>
        <Button
          btnTitle={(flow == 'cartCheckout' || flow=='saleOrderCheckout') ? 'Confirm payment method' : 'Place order'}
          onPress={() => onPlaceOrder()}
          disabled={!validation}
          style={[
            styles.orderBtn,
            { backgroundColor: validation ? black : buttonOpacity },
          ]}
        />
      </View>
    )
  }
  */

  const renderCardList = () => {
    return (
      <View style={styles.cardList}>
        <ScrollView>
          <Text smallRegular color={orderDarkGray} style={styles.smallHeading}>
            Saved cards
          </Text>
          {cardDataArray.map((item, index) => renderCard(item, index))}
          {renderPaymentMethods()}
          {(flow == 'cartCheckout') && renderInStoreCredit()}
        </ScrollView>
        <Button
          btnTitle={(flow == 'cartCheckout' || flow=='saleOrderCheckout') ? 'Confirm payment method' : 'Place order'}
          onPress={() => onPlaceOrder()}
          disabled={!validation}
          style={[
            styles.orderBtn,
            { backgroundColor: validation ? black : buttonOpacity },
          ]}
        />
      </View>
    )
  }

  const renderProcessingView = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.processingContainer}
        onPress={() => {
          setIsPaymentProcessing(false)
          setIsSuccessVisisble(true)
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

  var pageTitle = 'Select payment method';
  if (route.params.credit) {
    var credit = route.params.credit;
    console.log('credit', credit);
    pageTitle = 'Pay for ฿'+ number_format(credit, "0,0") +' credit';
  }

  console.log('flow',flow);
  console.log('route.params',route.params);

  return (
    <View style={styles.container}>
      {!isPaymentProcessing &&
        <View style={{ flex: 1 }}>
          <AccountHeader
            title={pageTitle}
            backArrow
            backPress={() => onBackPress()}
          />
          <View style={{ flex: 1 }}>
            {renderCardList()}
          </View>
        </View>
      }

      {(isPaymentProcessing) &&
        renderProcessingView()
      }

      {isCvvConfirmPopUpOpen && (
        <View style={styles.modalContain}>
          <CVVPopup
            showPrivacyModal={isCvvConfirmPopUpOpen}
            contentHeight={301}
            contentStyle={styles.contentStyle}
            confirmCardId={selectedPaymentMethod.card_id}
            setShowPrivacyModal={(cvv) => {
              setIsCvvConfirmPopUpOpen(false)
              setIsAnyPopupOpened(false)
              if (cvv && cvv!==null) {
                if (flow == 'cartCheckout' || flow=='saleOrderCheckout') {
                  setSelectedPayment(selectedPaymentMethod.pay_method_id, cvv)
                } else {
                  processCreditPayment(selectedPaymentMethod.pay_method_id, cvv);
                }

              }
            }}
          />
        </View>
      )}
    </View>
  )
}

export default PaymentMethods
