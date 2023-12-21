import React, { useState, useContext, useCallback, useRef } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert
} from 'react-native'

import { useFocusEffect } from '@react-navigation/native'
import { captureScreen } from 'react-native-view-shot'
import CameraRoll from "@react-native-community/cameraroll";
import Services from '../../services'
const { API } = Services

import moment from "moment";

import styles from './Styles'
import { appColors, appImages } from '../../theme'
import QRCodeHelpPopup from './QRCodeHelpPopup'
import Timer from './Timer'

import {
  MarketHeader,
  Text,
  Button,
} from '../../components/'
const {
  darkGray,
  green,
  accountSettingGray,
  addressGrey,
  darkGrey,
} = appColors

import helpers from "../../helpers";
// Clear whatever is not used from the helpers
const {
  number_format,
} = helpers;

import AppContext from '../../provider'

const {
  thai_payment_img,
  banks_img,
} = appImages

const QRCode = (props) => {
  const { navigation, route} = props;
  const { sale_id } = route.params;
  const { setIsAnyPopupOpened,
   setIsAnyApiLoading,
   loginData,
   setLoginData} = useContext(AppContext)

  const { accountInfo, token, user_id } = loginData;

  const [orderDetails, setOrderDetails] = useState(null)
  const [showHelpPopup, setShowHelpPopup] = useState(false)

  useFocusEffect(
    useCallback(() => {

      console.log('CURRENT SALE ID', route.params, sale_id);

      var order_id = sale_id

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
  
  const CheckTimer = useRef()
  
  useFocusEffect(
    useCallback(() => {
      
      CheckTimer.current = setInterval(() => {
        
        var order_id = parseInt(sale_id)
        var data, error = null
        
        API.execute("sale.order","read_path",[
          [order_id],
          [
            "ecom_state",
            "pay_method_id.name",
          ]
        ],
        {},
        setIsAnyApiLoading,
        {token, user_id}
        ).then(data=>{
          data = data[0];
          console.log("data payment", order_id, data);
          var payment_method = data.pay_method_id ? data.pay_method_id.id : null;
          
          // Actual Kbank QR code id which is set up once payment is done.
          if (payment_method == 15) {
            if (data.ecom_state == 'wait_ship' || data.ecom_state == 'wait_pack' || data.ecom_state == 'start_pack' || data.ecom_state == 'wait_deliver' || data.ecom_state == 'start_deliver' || data.ecom_state == 'delivered' || data.ecom_state == 'done') {
              console.log("Payment was done");
              CheckRedirectLogic();
              navigation.navigate('CheckoutSuccess', {sale_id: sale_id});
            }
          } else {
            console.log("Payment not yet done");
          }
        
        }).catch(err=>{
          console.log('Error',err)
        });
        
      }, 8000);

      return () => {
        if (CheckTimer.current) {
          clearInterval(CheckTimer.current);
        }
      }
    }, [])
  );
  
  const CheckRedirectLogic = () => {
    
    if ((accountInfo.contact_id.plr_survey1_completed == null || accountInfo.contact_id.plr_survey1_completed == false) && (accountInfo.contact_id.plr_survey1_denied == null || accountInfo.contact_id.plr_survey1_denied == false)) {
      var shown = accountInfo.contact_id.plr_survey1_first_screen_shown;
      if (shown < 3 || shown == null || shown == false ) {
        navigation.navigate('CheckoutSuccessSurvey', {sale_id: sale_id});
      } else if (accountInfo.contact_id.plr_survey1_second_screen_shown == null || accountInfo.contact_id.plr_survey1_second_screen_shown == false) {
        navigation.navigate('CheckoutSuccessShare', {sale_id: sale_id});
      } else if (accountInfo.contact_id.plr_survey1_third_screen_shown == null || accountInfo.contact_id.plr_survey1_third_screen_shown == false) {
        navigation.navigate('CheckoutSuccessInvite', {sale_id: sale_id});
      }
    } else {
      if (accountInfo.contact_id.plr_survey1_second_screen_shown == null || accountInfo.contact_id.plr_survey1_second_screen_shown == false) {
        navigation.navigate('CheckoutSuccessShare', {sale_id: sale_id});
      } else if (accountInfo.contact_id.plr_survey1_third_screen_shown == null || accountInfo.contact_id.plr_survey1_third_screen_shown == false) {
        navigation.navigate('CheckoutSuccessInvite', {sale_id: sale_id});
      }
    }
    
  }

  const backPress = () => {
    if (CheckTimer.current) {
      clearInterval(CheckTimer.current);
    }
    // navigation.goBack()
   navigation.navigate('CheckoutSO', { sale_id: sale_id }) 
  }

  const onExpire = () => {
    console.log('onExpire');
    if (CheckTimer.current) {
      clearInterval(CheckTimer.current);
    }
    navigation.navigate('CheckoutSO', { sale_id: sale_id }) 
  }

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  const takeScreenshot = async () => {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      // show alert message here
      Alert.alert('', 'This permission is so we can store the screenshot to your camera roll. You can also take the screenshot using your phone as you normally would.');
      return;
    }

    captureScreen({
      format: 'jpg',
      quality: 0.8,
    }).then(
      (uri) => {
        CameraRoll.save(uri, { type: 'photo' })
          .then(() => {
            // successfully saved a screenshot
            Alert.alert('Image saved', 'Now you can upload it into your mobile banking app.');
          })
          .catch(error => {
            alert(error);
          })
      },
      (error) => alert(error)
    );
  }
  
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

  const renderQrCodeTime = () => {
    return (
      <View>
        <View style={styles.qrcodeTime}>
          <Text regular color={darkGrey} lineHeight={24}>
            You have
            <Text regular condensedBold color={darkGrey} lineHeight={24}>
              {' '}
              ฿
            </Text>
            <Text regular bold color={darkGrey} lineHeight={24}>
              {number_format(orderDetails.plr_payment_amount, "0,0")}{' '}
            </Text>
            to pay
          </Text>
          <Text regular color={darkGrey} lineHeight={24}>
            QR code valid for
            <Text regular bold color={darkGrey} lineHeight={24}>
              {' '}
              <Timer time={600} onExpire={onExpire}/>
            </Text>
          </Text>
        </View>

        <Text extSmall color={addressGrey} lineHeight={17} textAlign={'center'}>
          This order will be automatically suspended / cancelled{'\n'}if not
          paid before {moment(orderDetails.max_payment_date).format("DD MMMM, HH:mm:ss")}
        </Text>
      </View>
    )
  }

  const renderQrcode = () => {
    return (
      <View>
        <Image source={thai_payment_img} style={styles.thaiImg} />

        <Image source={{uri:"https://backend.paleorobbie.com/static/db/plr/files/" + orderDetails.payment_qr}}  style={styles.qrcodeImg} />

        <Text small color={darkGray} textAlign="center">
          Robbie Market Co., Ltd. x
        </Text>

        <Text
          color={accountSettingGray}
          extSmall
          textAlign="center"
          style={styles.saveImgText}
          lineHeight={17}
        >
          Press “save image” below, or take a screenshot, and{'\n'}then upload
          it into the “Scan” feature of your{'\n'}mobile banking app.
          <TouchableOpacity
            style={styles.helpTouch}
            onPress={() => {
              setShowHelpPopup(!showHelpPopup)
              setIsAnyPopupOpened(true)
            }}
          >
            <Text color={green} extSmall textAlign="center">
              {' '}
              Need help?
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    )
  }

  const renderBanksImgages = () => {
    return (
      <View>
        <Image source={banks_img} style={styles.banksImg} />

        <Text small color={darkGray} textAlign="center">
          All banks in Thailand are accepted.
        </Text>
      </View>
    )
  }

  if (orderDetails) {
    console.log('orderDetails',orderDetails);

    return (
      <View style={styles.mainContainer}>
        <MarketHeader
          searchEnabled={false}
          backArrow
          backPress={() => backPress()}
          condensedTitle={'Pay by QR code | Mobile banking'}
        />
        <Text regular color={accountSettingGray} style={styles.orderText}>
          Order SO-{orderDetails.number}{' '}
        </Text>
        <View style={styles.body}>
          <ScrollView>
            {renderQrCodeTime()}
            {renderQrcode()}
            {renderBanksImgages()}
            <Button
              onPress={() => {
                takeScreenshot();
              }}
              style={styles.saveImg}
              btnTitle={'Save image'}
              textStyle={styles.text}
            />
          </ScrollView>
          {showHelpPopup && (
            <View style={styles.modalContain}>
              <QRCodeHelpPopup
                showPrivacyModal={showHelpPopup}
                setShowPrivacyModal={() => {
                  setShowHelpPopup(false)
                  setIsAnyPopupOpened(false)
                }}
              />
            </View>
          )}
        </View>
      </View>
    )
  } else {
    return null;
  }
}

export default QRCode
