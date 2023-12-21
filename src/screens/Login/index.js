import React, { useState, useContext, useEffect } from "react";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StatusBar,
} from "react-native";
import analytics from '@react-native-firebase/analytics';
import * as CommonActions from "@react-navigation/routers/src/CommonActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppContext from "../../provider";
import { appColors, appImages } from "../../theme";
import { Button, Header, Input, Text, LINELoginButton } from "../../components/";
import styles from "./Styles";
import Services from "../../services";
import helpers, { AppsFyler } from "../../helpers";
import LINE from "../../helpers/line";
const { eye, full_eye } = appImages;
const { validateEmail, getCartType } = helpers;
const { darkGrey, orderDarkGray } = appColors;
const { API } = Services;

const Login = (props) => {
  const { navigation } = props;
  //states
  const [showPassword, setShowPassword] = useState(false);
  const {
    setIsApiLoaderShowing,
    setLoginData,
    loginData,
    updateCartId,
    cartData,
    mealsCartData,
    setMealsCartData,
    setCartData,
    // setRefVoucher,
    userDataArray,
    setUserDataArray
  } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("loginData");
      if (value && value !== null) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "TabNavigation" }],
          })
        );
      }
    } catch (e) {
      console.log("error---", e);
    }
  };

  const onSignup = () => {
    navigation.navigate('signUp');
  };

  const getDefaultAddress = (loginDetails) => {

    var addresses = loginDetails.contact_id.addresses;
    var default_address_id = loginDetails.contact_id.default_address_id;
    console.log('Default User Address Details',addresses,default_address_id)

    if (addresses.length > 1) {
      let defaultObj = null;
      if (default_address_id && default_address_id.id) {
        const otherAddresses = addresses.filter((x) => {
          if (x.id == default_address_id.id) {
            defaultObj = x;
          }
          return x.id !== default_address_id.id;
        });

        return defaultObj;
      } else {
        return getOrderHistory();
      }
    } else {
      if (addresses.length == 1) {
        return addresses[0];
      }
    }
  };

  const processLoginResult = async (data) => {
    if (data.user_id) {
      analytics().logEvent('click_login');
      const { user_id } = data;
      
      /*
      if (data.voucher) {
        await AsyncStorage.setItem('refVoucher', data.voucher);
        setRefVoucher(data.voucher);
      }
      */

      await API.user_load({ user_id: user_id }, setIsApiLoaderShowing)
        .then(async (response) => {
          clearInputs();

          AppsFyler.logEvent('login', {});

          var token = data.token;
          var user_id = data.user_id;
          API.execute("ecom2.interface", "contact_tracking", ["open_app"], {}, setIsApiLoaderShowing, { token, user_id });

          setLoginData({ accountInfo: response[0], ...data });
          console.log("loginlogin", data, response[0]);

          // Zone Checkup
          var selected_address = "";
          var user_zone_id = "";

          var loginDetails = response[0];

          // Scenarios
          // If user has addresses under his account then we use the normal flow
          if (loginDetails) {
            if(loginDetails.contact_id.addresses.length>0) {
              // Normal flow
              const defaultAddress = getDefaultAddress(loginDetails);
              if (defaultAddress) {
                const { zone_id, id } = defaultAddress;
                selected_address = id;
                user_zone_id = zone_id;
              }

            } else if (loginDetails.contact_id.zone_id!==null){
              // Zone_id flow
              selected_address = null;
              user_zone_id = loginDetails.contact_id.zone_id;
            }
          } else {
            selected_address = null;
            // We assume they are in Bangkok
            user_zone_id = 31;
          }
          
          // Review Later
          /*
          if (loginDetails) {
            if (loginDetails.plr_last_sale_id) {
              if (loginDetails.plr_last_sale_id.pay_method_id) {
                if (loginDetails.plr_last_sale_id.pay_method_id.id) {
                  
                }
              }
            }
          }
          */

          console.log('Checking 2', selected_address, user_zone_id);

          // Reset values for Guest users that might Log in with BKK values on their cart but have their default values as outside of BKK.
          if (user_zone_id == 32 || user_zone_id == 34) {
            var cartType = getCartType(cartData, mealsCartData);
            console.log('cartType',cartType);
            if (cartType!== null) {
              // If the user has a mealcart, we need to remove all his items (reset the cart)
              if (cartType == 'meal' || cartType == 'combined') {

                await API.execute("ecom2.cart", "empty_cart", [[global.mealsCartId]], {}, () => {}, { token, user_id });

                global.mealsCartId = null;
                setMealsCartData(null);
                global.freshMealsTimeSlotNew = null;

              }

              // If the user has a grocery cart, we need to reset his timeslot
              var vals={
                ship_address_id: null,
                delivery_slot_id: null, // Slots should be reset based on address for grocery cart
                delivery_date:null,
              }

              var load_cart = 'yes';
              await API.grocery_cart_write(
                vals,
                setMealsCartData,
                setCartData,
                cartType,
                load_cart,
                { token, user_id },
                'grocery_slot_and_address_change_app'
              );
            }
          }

          let {
            latest_draft_grocery_cart,
            latest_draft_mealplan_cart,
            latest_completed_grocery_cart,
            latest_completed_mealplan_cart,
          } = data;
          // Review latest cart draft logic
          if (!global.cartId) {
            latest_draft_grocery_cart = latest_draft_grocery_cart || [];
            latest_completed_grocery_cart = latest_completed_grocery_cart || [];
            if ((latest_draft_grocery_cart[0] > latest_completed_grocery_cart[0]) || (latest_draft_grocery_cart[0] && (typeof latest_completed_grocery_cart[0]=='undefined'))) {
              updateCartId(latest_draft_grocery_cart[0]);
            } else {
              await API.create_grocery_cart({token, user_id}).then((res) => {
                updateCartId(res);
              });
            }
          }

          if (!global.mealsCartId) {
            latest_draft_mealplan_cart = latest_draft_mealplan_cart || [];
            latest_completed_mealplan_cart = latest_completed_mealplan_cart || [];
            if ((latest_draft_mealplan_cart[0] > latest_completed_mealplan_cart[0]) || ((latest_draft_mealplan_cart[0]) && (typeof latest_completed_mealplan_cart[0]=='undefined'))) {
              global.mealsCartId = latest_draft_mealplan_cart[0];
            } else {
              // We don't need to auto create a mealplan cart
              /*
              API.create_meal_cart().then((res) => {
                // global.mealsCartId = res;
              });
              */
            }
          }

          var res = await API.execute(
            "ecom2.interface",
            "search_notif_fav",
            [
              loginDetails.contact_id.id
            ],
            {},
            setIsApiLoaderShowing,
            { token, user_id }
          );

          var products_notifications = [];
          var products_favorites = [];

          if (res.products_notifications.length >0) {
            console.log('TEST Products with Notifications',res.products_notifications);
            products_notifications = res.products_notifications;
          }
          if (res.products_favorites.length >0) {
            console.log('TEST Products Favorites',res.products_favorites);
            products_favorites = res.products_favorites;
          }

          setUserDataArray({
                            productsWithNotifications: products_notifications,
                            productsFavorites: products_favorites
                          });

          // If the user doesn't have any addresses and no default zone set up under his account, then we take him through the postcode flow
          console.log('Addresses Check', response[0].contact_id.addresses);
          var addresses = response[0].contact_id.addresses;
          console.log('Address Check Condition', addresses.length, response[0].contact_id.zone_id);
          if(response[0].contact_id.zone_id == null && addresses.length==0
          || (user_zone_id=='' || user_zone_id==null) ) {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: "PostCode" }],
              })
            )
          // Normal flow
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: "TabNavigation" }],
              })
            )
          }

        })
        .catch((err) => {
          alert(err);
        });
    } else {
      alert(data.message);
    }
  }

  const onLogin = async () => {
    //   setIsNotificationShowing(!isNotificationShowing)
    // props.navigation.navigate('TabNavigation')
    Keyboard.dismiss();
    if (validateInputs()) {
      
      if (validateEmail(email)) {
        var params = [email.toLowerCase(), password];
      } else {
        var params = [email, password];
      }

      var send_grocery_cart_id = null;
      if ( cartData && cartData.lines && cartData.lines.length > 0) {
          send_grocery_cart_id = parseInt(global.cartId);
      } else {
        global.cartId = null;
      }

      var ctx={
        grocery_cart_id: send_grocery_cart_id,
        meal_cart_id: parseInt(global.mealsCartId),
      };

      try {
        setIsApiLoaderShowing(true);
        const data = await API.execute("ecom2.interface", "login", params, {context:ctx}, setIsApiLoaderShowing);
        await processLoginResult(data);
        setIsApiLoaderShowing(false);
      } catch(err) {
        setIsApiLoaderShowing(false);
        alert(err);
      }
    }
  };

  const onLoginWithLINE = async () => {
    try {
      setIsApiLoaderShowing(true);
      const data = await LINE.loginWitthLINE_v2(cartData, setIsApiLoaderShowing);
      await processLoginResult(data);
      setIsApiLoaderShowing(false);
    } catch (ex) {
      setIsApiLoaderShowing(false);
      alert(ex);
    }
  }

  const onForgotPassword = () => {
    props.navigation.navigate("ForgotPassword");
  };

  const onContinueAsGuest = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "TabNavigation" }],
      })
    )
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateInputs = () => {
    let error = true;
    
    if (email || email.trim().length > 0) {
      /*
      if (!validateEmail(email)) {
        error = false;
        setErrorEmail(
          "Check again, you might have made a typo. eg:\nyou@paleo.com"
        );
      }
      */
    } else {
      error = false;
      setErrorEmail("Missing email.");
    }

    if (!password || password.trim().length == 0) {
      error = false;
      setErrorPassword("Missing password.");
    }

    return error;
  };

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const clearErrors = () => {
    setErrorEmail("");
    setErrorPassword("");
  };

  const onGoToRefferal = () => {
    props.navigation.navigate("Referral");
  };

  const onGoToLists = () => {
    /*
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Market" }],
      })
    )
    */


   // navigation.navigate('MarketStack', { screen: 'Influencers', params: { sale_id: parseInt(1) }})

    // navigation.navigate('CartStack', { screen: 'Cart'})

    /*
    navigation.navigate("Market", {
      screen: 'Influencers'
    });
    */

    /*
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: "MarketStack" },
        ],
      })
    );
    */

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "TabNavigation",
                   params: { screen: 'MarketStack', params: {screen: 'Influencers'} }
                }],
      })
    )

    /*
    navigation.reset({
      index: 0,
      routes: [{ name: "MarketStack" }],
    });
    navigation.navigate("Market");
    */

    /*
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "PostCode" }],
      })
    )
    */

    /*
     navigation.navigate('CartStack', { screen: 'CheckoutSO', params: { sale_id: parseInt(soNumber) }})
    */
  };

  const onGoToMarket = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "TabNavigation",
                   params: { screen: 'MarketStack', params: {exampleParam: 'example'} }
                }],
      })
    )
  };

  const onGoToMay = () => {
    props.navigation.navigate("Referral");
  };

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1, backgroundColor: appColors.white }}
      onPress={() => Keyboard.dismiss()}
    >
      <View style={{ flex: 1, backgroundColor: appColors.white }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={appColors.headerBgColor}
        />
        <Header
          title={"Welcome back! Let's login."}
          backPress={() => navigation.pop()}
        />

        {/* Body  */}
        <View style={styles.body}>
          <View style={styles.lineSignupContainer}>
            <Text color={orderDarkGray}>
              Login with LINE:
            </Text>
            <LINELoginButton style={styles.lineSignupButton} onPress={onLoginWithLINE}></LINELoginButton>
            <Text color={orderDarkGray} style={styles.separator}>
              - or -
            </Text>
          </View>
          <Input
            label={"Email"}
            placeholder={"Enter your email"}
            value={email}
            autoCapitalize="none"
            onChangeText={(text) => {
              setEmail(text);
              clearErrors();
            }}
          />
          {errorEmail.length > 0 && <Text color={darkGrey}>{errorEmail}</Text>}
          <Input
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearErrors();
            }}
            label={"Password"}
            // placeholder={'Enter your password'}
            secureTextEntry={!showPassword}
            password={true}
            imageSource={!showPassword ? eye : full_eye}
            onPressIcon={toggleShowPassword}
            customStyles={{
              container: {
                marginTop: 20,
              },
            }}
          />
          {errorPassword.length > 0 && (
            <Text color={darkGrey}>{errorPassword}</Text>
          )}
          <Button
            btnTitle={"Log in"}
            onPress={() => {
              onLogin();
            }}
          />

          {/*
          <Button
            btnTitle={"Go to refferal"}
            onPress={() => {
              onGoToRefferal();
            }}
          />

          <Button
            btnTitle={"Go to lists"}
            onPress={() => {
              onGoToLists();
            }}
          />

          <Button
            btnTitle={"Go to May"}
            onPress={() => {
              onGoToMay();
            }}
          />

          <Button
            btnTitle={"Go to Market"}
            onPress={() => {
              onGoToMarket();
            }}
          />
          */}

          {/*
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onContinueAsGuest()}
          >
            <Text style={styles.forgotText}>or continue as a Guest</Text>
          </TouchableOpacity>
          */}

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onForgotPassword()}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Footer  */}
        <TouchableOpacity
          style={styles.footer}
          activeOpacity={0.8}
          onPress={() => onSignup()}
        >
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={{ color: appColors.green }} onPress={() => onSignup()}>
              Sign up
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
