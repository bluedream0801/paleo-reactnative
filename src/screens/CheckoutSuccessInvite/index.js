import React, { useState, useContext, useEffect, useCallback } from "react";

import { View, Image, ScrollView, Share, Alert } from "react-native";
import styles from "./Styles2";
import { appColors, appImages } from "../../theme";

import analytics from '@react-native-firebase/analytics';
import { useFocusEffect } from '@react-navigation/native'
import AppContext from '../../provider'
import Services from '../../services'
const { API } = Services
import { AppsFyler } from "../../helpers";

import { MarketHeader, Text, Button } from "../../components/";

const { black } = appColors;

const { friend_man_img, success_ic } = appImages;

const Invite = (props) => {
  
  const { navigation, route} = props;
  const { sale_id } = route.params;
  
  const {
    setIsAnyApiLoading,
    setIsApiLoaderShowing,
    loginData,
    setLoginData
  } = useContext(AppContext)
  
  const [usersSharedVoucher, setUsersSharedVoucher] = useState(null);
  const [usersSharedVoucherError, setUsersSharedVoucherError] = useState(true);
  
  const { accountInfo, token, user_id } = loginData;
  var { first_name} = accountInfo.contact_id;
  
  const [orderDetails, setOrderDetails] = useState(null);
  
  useFocusEffect(
    useCallback(() => {
      
      console.log('CURRENT SALE ID', route.params, sale_id);
      
      var order_id = sale_id
      var data, error = null
      
      var vals = {
        plr_survey1_third_screen_shown: true,
      }
      
      API.execute("contact","write", [[accountInfo.contact_id.id],vals],{}, () => {},{token, user_id}).then(() => {
        getUserData()
      }).catch((err) => {
        console.log('err',err)
        alert(err)
      });
      
      // Ask to do it directly in netforce
      API.execute("sale.order","read_path",[
            [order_id],
            [
              "number",
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
      async function fetchData() {
        // Added for checking if the users receivable credit has changed
        if (loginData) {
          await getUsersShareVoucher();
        }

      }
      fetchData();
    }, [])
  );
  
  const getUserData = async () => {
    await API.user_load({ user_id: user_id }, () => {})
      .then((response) => {
        let previousData = Object.assign({}, loginData)
        setLoginData({ ...previousData, accountInfo: response[0] })
      })
      .catch((err) => {
        alert(err)
      })
  }
  
  const getUsersShareVoucher = async () => {
    if (loginData) {
      var voucher = await API.execute("ecom2.interface","get_share_voucher",[],{}, setIsApiLoaderShowing,{ token, user_id });
      console.log('voucher',voucher);
      if (voucher.code) {
        setUsersSharedVoucher(voucher.code)     
        setUsersSharedVoucherError(false);
      } else {
        setUsersSharedVoucherError(true);
      }
     } else {
      console.log('Not logged in. No Voucher Code.')
    }
  };
  
  const onSendInvite = async () => {
    if (loginData) {
      analytics().logEvent('account_click_sendinvite');
      const inviteLink = await AppsFyler.generateInviteLink(user_id, 'app_refer', 'ReferOneApp', {
        deep_link_value: 'referAFriend',
        deep_link_sub1: 'ios',
        // deep_link_sub2: accountInfo.contact_id.plr_my_refer_id,
        deep_link_sub2: usersSharedVoucher,
        deep_link_sub3: '',
        deep_link_sub10: 'ReferOneApp',
        // ref_id: accountInfo.contact_id.plr_my_refer_id,
        ref_id: usersSharedVoucher,
        invited: '',
        af_cp_lp: true,
      });
      try {
        const result = await Share.share({
          message: first_name + ' gave you ฿500 for your first order with Paleo Robbie. Just follow the link: ' + inviteLink  + ' or use the code ' + usersSharedVoucher + ' on checkout.'
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
      // Alert.alert('Coming soon to the app!', 'In the meantime, you can redeem the same offer by using our website.');
    } else {
      alert('You need to login before sending invites to your friends.')
    }
  }

  
  const renderShare = () => (
    <View style={styles.inviteContainer}>
      <View style={styles.inviteBody}>
        <Text smallRegular textAlign={"center"}>
          Do you have a friend that would like what we do? Help us grow & get
          some store credit by sharing your link ❤️
        </Text>
        <Image style={styles.inviteImg} source={friend_man_img} />

        <View style={styles.inviteCard}>
          <Text smallTitle condensedBold style={styles.inviteTitle}>
            Give ฿500, get ฿500.
          </Text>
          <Text smallRegular style={styles.inviteNote}>
            Invite your friends to give us a try with a ฿500 voucher. When they
            use it, you’ll get a ฿500 credit.
          </Text>
          <Button
            onPress={() => onSendInvite()}
            btnTitle="Send invite"
            small
            style={[styles.sendInviteBtn]}
            textStyle={[styles.sendInviteBtnText]}
          />
        </View>
        <Text small textAlign={"center"} style={styles.inviteBottomNote}>
          Minimum order ฿1,500 before discount. {"\n"}No family members or
          significant others at the same address, please! 🙂
        </Text>
        <Text small textAlign={"center"} style={styles.inviteTerms}>
          See full{" "}
          <Text small underlined onPress={() => alert("terms of service")}>
            terms of service.
          </Text>
        </Text>
      </View>
      <Button
        onPress={() => navigation.navigate("Home")}
        btnTitle="No thanks."
        style={[styles.inviteNoThanksBtn]}
      />
    </View>
  );

  var page_title = '';
  if (orderDetails) {
    page_title = 'Order ' + orderDetails.number;
  }
  
  return (
    <View style={styles.container}>
      <MarketHeader searchEnabled={false} condensedTitle={page_title} />
      <View style={styles.body}>
        <ScrollView>
          <View style={styles.successContainer}>
            <View style={styles.successBody}>
              <Image style={styles.successIC} source={success_ic} />
              <View style={styles.textBody}>
                <Text largeTitlePlus color={black} condensedBold>
                  Success!
                </Text>
                <Text
                  style={styles.successTitle}
                  largeRegularBetween
                  color={black}
                  condensedBold
                >
                  We received your payment and your order confirmation is{" "}
                  <Text underlined onPress={() => navigation.navigate('CheckoutSuccess', {sale_id: sale_id}) }>
                    here
                  </Text>
                  .
                </Text>
              </View>
            </View>
            <View style={styles.line} />

            {renderShare()}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Invite;
