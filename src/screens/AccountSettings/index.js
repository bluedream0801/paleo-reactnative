import React, { useState, useContext, useCallback } from 'react'
import { Image, ScrollView, View, TouchableOpacity, Switch, Alert } from 'react-native';
import Constants from 'expo-constants';

import styles from './Styles'
import { appColors, appImages } from '../../theme'
import { AccountHeader, Text } from '../../components/'
import AppContext from '../../provider'
import Services from '../../services'
const { API } = Services
const { lessDarkGray, darkGray, lightGrey, darkGrey } = appColors
const { right_arrow, iconInfo } = appImages
import * as CommonActions from "@react-navigation/routers/src/CommonActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCOUNT_TYPES } from '../../common/constants';
import { useFocusEffect } from '@react-navigation/native';
import LINE from '../../helpers/line';

const AccountSettings = (props) => {
  //states
  const { navigation } = props
  const { loginData, setLoginData,
    setCartData,
    setMealsCartData,
    setRefId,
    setRefVoucher,
  } = useContext(
    AppContext,
  )
  const { accountInfo, token, user_id } = loginData
  console.log('loginData--', loginData)
  const {
    id,
    plr_notif_deliv_sms,
    plr_notif_deliv_call,
    plr_notif_deliv_app,
    plr_notif_weekly_promo,
    line_user_id,
    line_friendship
  } = accountInfo.contact_id
  const [isEnabledEmail, setIsEnabledEmail] = useState(false)
  const [isEnabledApp, setIsEnabledApp] = useState(plr_notif_deliv_app)
  const [isEnabledSMS, setIsEnabledSMS] = useState(plr_notif_deliv_sms)
  const [isEnabledCall, setIsEnabledCall] = useState(plr_notif_deliv_call)
  const [hasFollowedLINEQA, setHasFollowedLINEQA] = useState()
  const [isEnabledWeeklyPromotions, setIsEnabledWeeklyPromotions] = useState(plr_notif_weekly_promo)

  const toggleAppSwitch = (name) => {
    var vals = {}
    setIsEnabledApp(!isEnabledApp)
    vals[name] = !isEnabledApp
    if (id) {
      API.execute('contact', 'write', [[id], vals], {}, () => {}, {
        token: token,
        user_id: user_id,
      })
      .then(() => {
        getUserData()
      })
      .catch((err) => {
        setIsEnabledApp(!isEnabledApp)
        alert('Error: ' + err)
      })
    }
  }

  const toggleSMSSwitch = (name) => {
    var vals = {}
    setIsEnabledSMS(!isEnabledSMS)
    vals[name] = !isEnabledSMS
    if (id) {
      API.execute('contact', 'write', [[id], vals], {}, () => {}, {
        token: token,
        user_id: user_id,
      })
        .then(() => {
          getUserData()
        })
        .catch((err) => {
          setIsEnabledSMS(!isEnabledSMS)
          alert('Error: ' + err)
        })
    }
  }

  useFocusEffect(
    useCallback(() => {
      async function checkLINEFriendshipStatus() {
        if (line_user_id) {
          const friendshipStatus = await LINE.hasFollowedLINEQA();
          console.log('Friendship', friendshipStatus);
          setHasFollowedLINEQA(friendshipStatus);
        }
      }
      checkLINEFriendshipStatus();
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

  const toggleCallSwitch = (name) => {
    var vals = {}
    setIsEnabledCall(!isEnabledCall)
    vals[name] = !isEnabledCall
    if (id) {
      API.execute('contact', 'write', [[id], vals], {}, () => {}, {
        token: token,
        user_id: user_id,
      })
        .then(() => {
          getUserData()
        })
        .catch((err) => {
          setIsEnabledCall(!isEnabledCall)

          alert('Error: ' + err)
        })
    }
  }

  const toggleWeeklyPromotionsSwitch = (name) => {
    var vals = {}
    setIsEnabledWeeklyPromotions(!isEnabledWeeklyPromotions)
    vals[name] = !isEnabledWeeklyPromotions
    if (id) {
      API.execute('contact', 'write', [[id], vals], {}, () => {}, {
        token: token,
        user_id: user_id,
      })
        .then((data) => {
          getUserData()
        })
        .catch((err) => {
          setIsEnabledWeeklyPromotions(!isEnabledWeeklyPromotions)

          alert('Error: ' + err)
        })
    }
  }

  const onBackPress = () => {
    navigation.goBack()
  }

  const onPressSettings = (code, showWarningIcon) => {
    switch (code) {
      case ACCOUNT_TYPES.LINE:
      case ACCOUNT_TYPES.EMAIL:
        navigation.navigate('LinkedAccount', { type: code, dontFollowQA: showWarningIcon });
        break;
      case 'password':
        navigation.navigate('ChangePassword');
        break;
    }
  }

  const onDeleteConfirm = async () => {
    alert('Account Deleted');
    if (id) {
      try {
        const opts = {
          app_name: "",
          device_name: ""
        };
        await API.unregisterDeviceToken(opts, { user_id });

        API.execute('contact', 'archive', [[id]], {}, () => {}, {token: token, user_id: user_id})

        AsyncStorage.removeItem("loginData");
        AsyncStorage.removeItem("cartId");
        AsyncStorage.removeItem("referralId");
        AsyncStorage.removeItem("refVoucher");
        AsyncStorage.clear();

        global.cartId = null;
        global.mealsCartId = null;
        setCartData(null);
        setMealsCartData(null);
        global.freshMealsTimeSlotNew = null;

        setRefId(null);
        setRefVoucher(null);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Auth" }],
          })
        );

        setLoginData(null);
      } catch(ex) {
        console.log('failed to logout', ex);
      }
    }
  }

  const onDeleteAccount = async () => {
    return Alert.alert(
      "Are you sure?",
      "Once you delete your account you will no longer have access to any of your information with us.",
      [
        {
          text: "Yes",
          onPress: () => {
            onDeleteConfirm();
          },
        },
        {
          text: "No",
        },
      ]
    );
  }

  const renderAccountSection = () => {
    const myAccountDataArray = [
      { label: 'Linked LINE account', code: ACCOUNT_TYPES.LINE, showWarningIcon: hasFollowedLINEQA === false },
      { label: 'Linked email address', code: ACCOUNT_TYPES.EMAIL },
      { label: 'Account password (email users)', code: 'password' }
    ];
    return (
      <View style={styles.orderSection}>
        <View style={styles.myDetailsList}>
          {myAccountDataArray.map((elem, i) => {
            return (
              <TouchableOpacity
                onPress={() => onPressSettings(elem.code, elem.showWarningIcon)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth:
                      myAccountDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <View style={styles.menuLabelContainer}>
                  <Text regular color={lessDarkGray}>
                    {elem.label}
                  </Text>
                  {elem.showWarningIcon && <Image source={iconInfo} resizeMode={"contain"} style={styles.warningIcon}></Image>}
                </View>
                <Image style={styles.arrow} source={right_arrow} />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderDeliveryNotificationSection = () => {
    return (
      <View style={styles.orderSection}>
        <View style={styles.orderSubSections}>
          <Text color={lessDarkGray} smallRegular>
            Delivery notifications
          </Text>
          <Text color={darkGray} style={styles.descText}>
            This is how you'll be notified each time we make a delivery to your
            address.
          </Text>
        </View>



        <View style={styles.myDetailsList}>

          {(line_user_id) &&
            <View style={[styles.myAccountCell]}>
              <Text regular color={appColors.lessDarkGray}>
                Receive notification from LINE
              </Text>
              <Switch
                style={[
                  styles.switchStyles,
                  { borderWidth: 1 },
                ]}
                trackColor={{ false: lightGrey, true: darkGrey }}
                thumbColor={lightGrey}
                ios_backgroundColor={lightGrey}
                value={true}
              />
            </View>
          }

          <View style={[styles.myAccountCell]}>
            <Text regular color={appColors.lessDarkGray}>
              Receive notification from app
            </Text>
            <Switch
              style={[
                styles.switchStyles,
                { borderWidth: isEnabledApp ? 1 : 0 },
              ]}
              trackColor={{ false: lightGrey, true: darkGrey }}
              thumbColor={lightGrey}
              ios_backgroundColor={lightGrey}
              onValueChange={(value) =>
                toggleAppSwitch('plr_notif_deliv_app', value)
              }
              value={isEnabledApp}
            />
          </View>

          <View style={[styles.myAccountCell]}>
            <Text regular color={appColors.lessDarkGray}>
              Receive notification by SMS
            </Text>
            <Switch
              style={[
                styles.switchStyles,
                { borderWidth: isEnabledSMS ? 1 : 0 },
              ]}
              trackColor={{ false: lightGrey, true: darkGrey }}
              thumbColor={lightGrey}
              ios_backgroundColor={lightGrey}
              onValueChange={(value) =>
                toggleSMSSwitch('plr_notif_deliv_sms', value)
              }
              value={isEnabledSMS}
            />
          </View>

          <View
            style={[
              styles.myAccountCell,
              {
                borderBottomWidth: 0,
              },
            ]}
          >
            <Text regular color={appColors.lessDarkGray}>
              Receive a phone call
            </Text>
            <Switch
              style={[
                styles.switchStyles,
                { borderWidth: isEnabledCall ? 1 : 0 },
              ]}
              trackColor={{ false: lightGrey, true: darkGrey }}
              thumbColor={lightGrey}
              ios_backgroundColor={lightGrey}
              onValueChange={() => toggleCallSwitch('plr_notif_deliv_call')}
              value={isEnabledCall}
            />
          </View>
        </View>
      </View>
    )
  }

  const renderDeleteAccount = () => {
    return (
      <View style={styles.orderSection}>
        <View style={styles.orderSubSections}>
          <Text color={lessDarkGray} smallRegular>
            Delete account
          </Text>
        </View>
        <View style={styles.myDetailsList}>
          <TouchableOpacity
            onPress={() => onDeleteAccount()}
            style={[
              styles.myAccountCell,
              {
                borderBottomWidth: 0
              },
            ]}
          >
            <Text regular color={lessDarkGray}>
              Delete my account
            </Text>
            <Image style={styles.arrow} source={right_arrow} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AccountHeader
        title={'Account settings'}
        backArrow
        backPress={() => onBackPress()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderAccountSection()}
        {renderDeliveryNotificationSection()}
        {renderDeleteAccount()}
        <View>
          <Text regular color={lessDarkGray} style={styles.appVersionText}>
            Your app version: {Constants.nativeAppVersion || ''}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default AccountSettings;
