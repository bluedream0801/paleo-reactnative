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
  const { transaction_id, credit, flow } = route.params;
  const { setIsAnyPopupOpened,
   setIsAnyApiLoading,
   loginData,
   setLoginData} = useContext(AppContext)

  const { token, user_id } = loginData;

  const [orderDetails, setOrderDetails] = useState(null)
  const [showHelpPopup, setShowHelpPopup] = useState(false)

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
  
  const CheckTimer = useRef()
  
  useFocusEffect(
    useCallback(() => {
      
      CheckTimer.current = setInterval(() => {
        
        var trans_id = parseInt(transaction_id)
        var data, error = null
        
        API.execute("payment.transaction","read_path",[
          [trans_id],
          [
            "state",
          ]
        ],
        {},
        setIsAnyApiLoading,
        {token, user_id}
        ).then(data=>{
          data = data[0];
          console.log("data payment", trans_id, data);
          
          if (data.state == 'done') {
            console.log("Payment was done");
            if (flow == 'cartCheckoutAddCredit') {
              navigation.navigate('Checkout');
            } else {
              navigation.navigate('AddCreditSuccess', {transaction_id: trans_id});
            }
          } else if (data.state == 'in_progress') {
            console.log("Payment not yet done");
          } else {
            console.log("Error ?");
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

  const backPress = () => {
    if (CheckTimer.current) {
      clearInterval(CheckTimer.current);
    }
    // navigation.goBack()
    navigation.navigate('PaymentMethods', { flow:flow , credit: credit }) 
  }

  const onExpire = () => {
    console.log('onExpire');
    if (CheckTimer.current) {
      clearInterval(CheckTimer.current);
    }
    navigation.navigate('PaymentMethods', { flow:flow, credit: credit }) 
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
              {number_format(orderDetails.amount, "0,0")}{' '}
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

        <Image source={{uri:"https://backend.paleorobbie.com/static/db/plr/files/" + orderDetails.kbank_qr_payment_qr}}  style={styles.qrcodeImg} />

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
          Pay for ฿{number_format(credit, "0,0")}  credit{' '}
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
