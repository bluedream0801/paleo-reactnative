import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { Image, ScrollView, View, TouchableOpacity, Share, Alert } from "react-native";
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect } from '@react-navigation/native'
import * as CommonActions from "@react-navigation/routers/src/CommonActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Order from "./Order";
import styles from "./Style";
import { appColors, appImages } from "../../theme";
import { AccountHeader, Text, Button } from "../../components/";
import Services from "../../services";
import AppContext from "../../provider";
import { AppsFyler } from "../../helpers";

const { orderDarkGray, accountSettingGray } = appColors;
const myAccountDataArray = [
  {
    label: 'Account settings',
    screen: 'AccountSettings',
  },
  {
    label: 'Delivery addresses',
    screen: 'DeliveryAddresses',
  },
  {
    label: 'Paleo Wallet',
    screen: 'PaleoWallet',
  },
  {
    label: 'Saved credit / debit cards',
    screen: 'SavedCards'
  },
  {
    label: 'Container pickup',
    screen: 'ScheduleContainer'
  }
];
const { white, addressGrey } = appColors;
const { API } = Services;
const supportDataArray = [
  {
    label: 'How it works',
    screen: 'HowItWorks',
    eventName: 'account_click_howitworks',
  },
  {
    label: 'Delivery details',
    screen: 'DeliveryDetails',
    eventName: 'account_click_deliverydetails',
  },
  {
    label: 'Help center',
    screen: 'HelpCenter',
    eventName: 'account_click_help',
  }
];
const aboutDataArray = [
  {
    label: 'About us',
    screen: 'AboutUs',
    eventName: 'account_click_aboutus',
  },
  // Note: add "Buy a gift card" back after a launch
  // {
  //   label: 'Buy a gift card',
  //   screen: 'ReferAFriend'
  // }
];

const MyAccount = (props) => {
  //states
  const { navigation, route } = props;
  const {
    setIsApiLoaderShowing,
    isApiLoaderShowing,
    loginData,
    setLoginData,
    setCartData,
    setMealsCartData,
    setRefId,
    setRefVoucher,
    userDataArray,
    setUserDataArray
  } = useContext(AppContext);


  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
    var { first_name, receivable_credit } = accountInfo.contact_id;
  } else {
    var user_id = null;
    var token = null;
  }

  const [orderHistory, setOrderHistory] = useState([]);
  const [usersSharedVoucher, setUsersSharedVoucher] = useState(null);
  const [usersSharedVoucherError, setUsersSharedVoucherError] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [route.params?.resetScrollPosition]);

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
          await getUsersShareVoucher();
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

  const onViewAllOrder = () => {
    if (loginData) {
      analytics().logEvent('account_click_vieworders');
      navigation.navigate("MyOrders");
    } else {
      alert('You need to login in order to access this section.')
    }
  };

  const onPressLogin = () => {
    navigation.navigate("Auth", {
      screen: 'login'
    });
  };

  const onPressCreateAccount = () => {
    navigation.navigate("Auth", {
      screen: 'signUp'
    });
  };

  const onPressSettings = (index) => {
    if (myAccountDataArray[index].screen) {
      if (loginData) {
        navigation.navigate(myAccountDataArray[index].screen);
      } else {
        alert('You need to login in order to access this section.')
      }
    }
  };
  const onPressAbout = (index) => {
    const item = aboutDataArray[index];
    if (item.screen) {
      analytics().logEvent(item.eventName);
      navigation.navigate(item.screen);
    }
  };

  const onPressSupport = (index) => {
    const item = supportDataArray[index];
    if (item.screen) {
      analytics().logEvent(item.eventName);
      navigation.navigate(item.screen);
    }
  };

  const onViewOrderDetails = (obj) => {
    navigation.navigate("OrderDetails", { orderObj: obj });
  };

  const clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };

  const onLogout = async () => {
    // remove device token from BE
    try {
      const opts = {
        app_name: "",
        device_name: ""
      };
      await API.unregisterDeviceToken(opts, { user_id });
      AsyncStorage.removeItem("loginData");
      AsyncStorage.removeItem("cartId");
      AsyncStorage.removeItem("referralId");
      AsyncStorage.removeItem("refVoucher");

      clearAsyncStorage();

      global.cartId = null;
      global.mealsCartId = null;
      setCartData(null);
      setMealsCartData(null);
      global.freshMealsTimeSlotNew = null;

      setRefId(null);
      setRefVoucher(null);
      
      setUserDataArray({  
                        productsWithNotifications: [], 
                        productsFavorites: []
                      });
      
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
  };

  useEffect(() => {
    if (loginData) {
      getOrderHistory();
    }
  }, []);

  const getOrderHistory = async () => {
    // setIsApiLoaderShowing(true);
    try {
      var res = await API.execute(
        "sale.order",
        "search_read_path",
        [
          [["contact_id", "=", accountInfo.contact_id.id]],
          [
            "date",
            "number",
            "amount_total",
            "plr_use_credit_amount",
            "ecom_state",
            "plr_order_type",
            "due_date",
            "delivery_orders.state",
            "delivery_orders.delivered_time",
            "delivery_orders.time_delivered",
          ],
        ],
        {
          order: "date desc, number desc",
          limit: 3,
        },
        () => {}
      );
      setOrderHistory(res);
      // setIsApiLoaderShowing(false);
    } catch (err) {
      // setIsApiLoaderShowing(false);
      console.log("err", err);
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

  const renderDetailsSection = () => {
    if (loginData) {
      return (
        <View style={styles.detailsSection}>
          <Text largeRegular color={appColors.lessDarkGray} condensedBold>
            {"Hello, " + first_name + "."}
          </Text>
          <View style={styles.innerDetail}>
            <Text bold color={appColors.textDarkGray} small lineHeight={16.11}>
              PALEO CREDIT BALANCE:
            </Text>
            <Text
              lineHeight={21.5}
              color={appColors.darkGray}
              regular
              condensedBold
            >
              ฿{receivable_credit ? receivable_credit : 0}
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const renderLastOrdersSection = () => {
    return (
      <View style={styles.orderSection}>
        <View style={styles.orderSubSections}>
          <Text
            smallRegular
            color={orderDarkGray}
            lineHeight={18.5}
          >
            Latest orders
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onViewAllOrder()}
          >
            <Text color={appColors.green} smallRegular lineHeight={18.5}>
              View all orders
            </Text>
          </TouchableOpacity>
        </View>

        {!isApiLoaderShowing && (
          <View style={styles.ordeList}>
            {orderHistory &&
              orderHistory.map((obj, i) => {
                if (i > 2) {
                  return null;
                }
                return (
                  <Order
                    key={i}
                    orderObj={obj}
                    onViewOrderDetails={onViewOrderDetails}
                    isLastObj={orderHistory.length == i + 1}
                  />
                );
              })}

            {!isApiLoaderShowing && orderHistory.length == 0 && (
              <Text
                largeRegularPlus
                color={addressGrey}
                textAlign={"center"}
                style={styles.noOrder}
              >
                You have no recent orders.
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderAccountSection = () => {
    return (
      <View style={styles.orderSection}>
        <View style={styles.orderSubSections} lineHeight={18.5}>
          <Text smallRegular color={orderDarkGray}>
            My account
          </Text>
        </View>
        <View style={styles.myDetailsList}>
          {myAccountDataArray.map((obj, i) => {
            return (
              <TouchableOpacity
                onPress={() => onPressSettings(i)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth:
                      myAccountDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <Text color={accountSettingGray} regular lineHeight={21}>
                  {obj.label}
                </Text>
                <Image style={styles.arrow} source={appImages.right_arrow} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderSupportSection = () => {
    return (
      <View style={styles.orderSection}>
        <View style={styles.orderSubSections}>
          <Text smallRegular color={orderDarkGray}>
            Support
          </Text>
        </View>
        <View style={styles.myDetailsList}>
          {supportDataArray.map((obj, i) => {
            return (
              <TouchableOpacity
                onPress={() => onPressSupport(i)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth: supportDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <Text regular color={accountSettingGray}>
                  {obj.label}
                </Text>
                <Image style={styles.arrow} source={appImages.right_arrow} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderLoginSection = () => {
    if (loginData == null) {
      return (
        <View style={styles.orderSection}>
          <View style={styles.orderSubSections}>
            <Text smallRegular color={orderDarkGray}>
              Login or create account
            </Text>
          </View>
          <View style={styles.myDetailsList}>
            <TouchableOpacity
              onPress={() => onPressLogin()}
              style={[
                styles.myAccountCell,
                {
                  borderBottomWidth: 1,
                },
              ]}
            >
              <Text regular color={accountSettingGray}>
                Login
              </Text>
              <Image style={styles.arrow} source={appImages.right_arrow} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressCreateAccount()}
              style={[
                styles.myAccountCell,
                {
                  borderBottomWidth: 0,
                },
              ]}
            >
              <Text regular color={accountSettingGray}>
                Create account
              </Text>
              <Image style={styles.arrow} source={appImages.right_arrow} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  const renderAboutSection = () => {
    const listStyle = [styles.myDetailsList];
    if (!loginData) {
      listStyle.push({marginBottom: 15});
    }

    return (
      <View style={styles.orderSection}>
        <View style={styles.orderSubSections}>
          <Text smallRegular color={orderDarkGray}>
            About Paleo Robbie
          </Text>
        </View>
        <View style={listStyle}>
          {aboutDataArray.map((obj, i) => {
            return (
              <TouchableOpacity
                onPress={() => onPressAbout(i)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth: aboutDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <Text regular color={accountSettingGray}>
                  {obj.label}
                </Text>
                <Image style={styles.arrow} source={appImages.right_arrow} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderLogoutSection = () => {
    if (loginData) {
      return (
        <View style={styles.logOutSection}>
          <View style={styles.myDetailsList}>
            <TouchableOpacity
              style={styles.logoutCell}
              onPress={() => {
                onLogout();
              }}
            >
              <Text regular color={accountSettingGray}>
                Log out
              </Text>
              <Image style={styles.arrow} source={appImages.right_arrow} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null
    }
  };

  const renderReferFriend = () => {
    if (usersSharedVoucherError) {
      return (
        <View style={styles.friend}>
          <Image source={appImages.friend_man_img} style={styles.friendManImg} />
          <View style={styles.friendContainer}>
            <Text condensedBold largeRegularPlus color={white}>
              Give ฿500, get ฿500.
            </Text>
            <Text
              textAlign="center"
              extSmall
              color={white}
              style={styles.friendDescription}
              lineHeight={17}
            >
              Invite your friends to give us a try with a{" "}
              <Text textAlign="center" extSmall condensed color={white}>
                ฿500{" "}
              </Text>
              voucher.{"\n"}When they use it, you’ll get a{" "}
              <Text textAlign="center" extSmall condensed color={white}>
                ฿500
              </Text>{" "}
              credit.
              {"\n"}{"\n"} You will be able to refer a friend after you complete your first order.
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.friend}>
          <Image source={appImages.friend_man_img} style={styles.friendManImg} />
          <View style={styles.friendContainer}>
            <Text condensedBold largeRegularPlus color={white}>
              Give ฿500, get ฿500.
            </Text>
            <Text
              textAlign="center"
              extSmall
              color={white}
              style={styles.friendDescription}
              lineHeight={17}
            >
              Invite your friends to give us a try with a{" "}
              <Text textAlign="center" extSmall condensed color={white}>
                ฿500{" "}
              </Text>
              voucher.{"\n"}When they use it, you’ll get a{" "}
              <Text textAlign="center" extSmall condensed color={white}>
                ฿500
              </Text>{" "}
              credit.
            </Text>
            <Text RegularPlus color={white}>  
              Your code: 
            </Text>
            <Text condensedBold RegularPlus color={white}>  
              {usersSharedVoucher}
            </Text>
            <Button
              small
              style={styles.sendBtn}
              textStyle={styles.textStyles}
              btnTitle="Send invite"
              onPress={() => onSendInvite()}
            ></Button>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <AccountHeader title={"My account"} />
      <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
        {renderDetailsSection()}
        {renderLoginSection()}
        {renderLastOrdersSection()}
        {renderReferFriend()}
        {renderAccountSection()}
        {renderSupportSection()}
        {renderAboutSection()}
        {renderLogoutSection()}
      </ScrollView>
    </View>
  );
};

export default MyAccount;
