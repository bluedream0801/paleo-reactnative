import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Animated,
  LogBox,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  AppState,
  Text as RNText
} from "react-native";
import GestureRecognizer from 'react-native-swipe-gestures';
import NetInfo from "@react-native-community/netinfo";
import analytics from '@react-native-firebase/analytics';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAnimatedRef } from "react-native-reanimated";
import { Settings } from 'react-native-fbsdk-next';
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appsFlyer from 'react-native-appsflyer';
import VersionCheck from 'react-native-version-check';
import * as Updates from 'expo-updates';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';
import compareVersions from 'compare-versions';
import appColors from "./src/theme/appColors";
import { Loader } from "./src/components";
import MainStack from "./src/routes/MainStack";
import AppContext from "./src/provider";
const { white } = appColors;
import { DeliveryNotification, Text } from "./src/components";
import notifyStyles from "./src/screens/Market/Styles";
import Services from "./src/services";
const { API } = Services;
import helpers, { AppsFyler } from "./src/helpers";
const { groupBy2 } = helpers;
import appImages from "./src/theme/appImages";
import ProductsProvider from "./src/firebase/ProductsProvider";
import NavigationRefs from './src/routes/NavigationRefs';
import UpdatePopup from "./src/screens/Market/UpdatePopup";
import * as momenttz from 'moment-timezone';

const { getProductsGroupsData, getAllProductsData } = ProductsProvider

import * as Sentry from '@sentry/react-native';

if (!__DEV__) {
  Sentry.init({
    dsn: 'https://97a1587d77d14b8b94f6057c5fdc807b@o1310792.ingest.sentry.io/6558535'
  });
}

const { navigationRef } = NavigationRefs

// Ignore log notification by message:
LogBox.ignoreLogs(['expo-permissions is now deprecated','VirtualizedLists should never be nested inside plain ScrollViews with the same orientation']);

RNText.defaultProps = RNText.defaultProps || {}
RNText.defaultProps.allowFontScaling = false;

SplashScreen.preventAutoHideAsync().catch(err => {
  console.log(err);
  // do some staff in case of error
});

const disableDeepLinking = Device.brand === 'google' && Device.deviceYearClass === 2013;


// In order to avoid useless rerenders and lagging in certain situations we will try to use global React Native variables in order to store information that does not affect rerendering
// The old useState calls will be initially commented out and maybe removed later on
global.cartId = null;
global.mealsCartId = null;
global.freshMealsTimeSlotNew = null;

global.categoriesArray = null;
global.groceryProductsArray = null;
global.marketSectionCategoriesArray = null;

const App = () => {
  const animatedRef = useAnimatedRef();
  // Related to App states / notifications etc.
  const [isAppUpdating, setIsAppUpdating] = useState();
  const [isAppReady, setIsAppReady] = useState();
  const [isApiLoaderShowing, setIsApiLoaderShowing] = useState(false);
  const [isAnyApiLoading, setIsAnyApiLoading] = useState(false);
  const [isAnyPopupOpened, setIsAnyPopupOpened] = useState(false);
  const [barStyle, setBarStyle] = useState('dark-content');
  const [isNotificationShowing, setIsNotificationShowing] = useState(false);
  const [isAddToOrderPopup, setIsAddToOrderPopup] = useState(false);
  const [isAddressNotificationShowing, setIsAddressNotificationShowing] = useState(false);
  const [translateY, setTranslateY] = useState(new Animated.Value(0));
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [appState, setAppState] = useState(AppState.currentState);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [chatAvailabilityStatus, setChatAvailabilityStatus] = useState(null);

  // Related to Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Related to Content and Products
  const [productsRoutesData, setProductsRoutesData] = useState([]);
  const [homeDataObj, setHomeDataObj] = useState(null);

  // Related to Carts
  const [cartData, setCartData] = useState(null);
  const [mealsCartData, setMealsCartData] = useState(null);

  // Related to User information
  const [loginData, setLoginData] = useState(null);
  const [refId, setRefId] = useState(null); // useState('UXPJ') Use UXPJ for testing when creating a new account
  const [refVoucher, setRefVoucher] = useState(null);
  const [userDataArray, setUserDataArray] = useState({
                                                      productsWithNotifications:[],
                                                      productsFavorites:[]
                                                    });

  const appStateValue = useRef(AppState.currentState);

  // console.log('userDataArray',userDataArray);

  const linking = {
    prefixes: ['paleorobbie://', 'https://paleorobbie.onelink.me', 'https://click.paleorobbie.com'],

    async getInitialURL() {
      // As a fallback, you may want to do the default deep link handling
      const url = await Linking.getInitialURL();
      // Testing a ref id url
      // const url = 'https://paleorobbie.onelink.me/cFgG/w24gml94';
      // const url = 'https://paleorobbie.com/welcome?deep_link_sub1=ios&pid=af_app_invites&deep_link_sub2=UEQE&deep_link_sub3=Jon&shortlink=w24gml94&af_referrer_customer_id=12272&deep_link_value=referAFriend&af_channel=app_refer&af_siteid=1597443504&c=ReferOneApp&af_referrer_uid=1657457122851-7274085';

      console.log('Initial url', url);

      return url;
    },

    // Custom function to subscribe to incoming links
    subscribe(listener) {
      // Listen to incoming links from Appsflyer SDK
      const unsubscribeDeepLinkListener = appsFlyer.onDeepLink( async (res) => {
        console.log('DEEP LINK', res);

        if (res?.deepLinkStatus !== 'NOT_FOUND') {
          const DLValue = res?.data.deep_link_value;
          // Use campaign name for tracking going forward
          var campaignName = res?.data.deep_link_sub10; // Use deep_link_sub10 for the Campaign name as a general standard

          // This is an override if the user comes in via click on mobile web banner
          if (res?.data?.campaign) {
            if (res.data.campaign == 'af_banner_campaign') {
              campaignName = 'Mobile Web Banner';
            }
          }

          let url = DLValue;
          if (DLValue === 'freshmeal_specials') {
            url = 'freshmeals?fromHome=true';
          } else if (DLValue === 'freshmeal_byo') {
            url = 'freshmeals?BYO=true';
          } else if (DLValue === 'referAFriend') {
            url = 'referral/' + res?.data.deep_link_sub2;
            // url = 'referral/' + res?.data.ref_id;
          } else if (DLValue === 'maylist') {
            const listID = res?.data.deep_link_sub1 || '291';
            url = 'lists/' + listID;
          } else if (DLValue === 'ninalist') {
            const listID = res?.data.deep_link_sub1 || '307';
            url = 'lists/' + listID;
          } else if (DLValue === 'lists') {
            const listID = res?.data.deep_link_sub1;
            if (listID) {
              url = 'lists/' + listID;
            } else {
              url = 'lists';
            }
          } else if (DLValue === 'market') {
            const parentCategoryID = res?.data.deep_link_sub1;
            const subCategoryID = res?.data.deep_link_sub2;
            url = DLValue;
            if (parentCategoryID) {
              url += `/${parentCategoryID}`;
            }
            if (subCategoryID) {
              url += `/${subCategoryID}`;
            }
            url += `?deepLinkHash=${Date.now()}`;
          } else if (DLValue) {
            url = DLValue;
          } else {
            // consider it as a non-appsflyer deeplink and ignore
            return;
          }

          // var args = JSON.stringify(res);
          // alert(args);
          // alert(campaignName);

          await AsyncStorage.setItem('deeplink_value', campaignName || '');
          console.log('deeplink value: ', campaignName);
          listener('paleorobbie://' + url);
        }
      });

      // Listen to incoming links from deep linking
      Linking.addEventListener('url', ({ url }) => {
        listener(url);
      });

      return () => {
        // Clean up the event listeners
        unsubscribeDeepLinkListener();
      };
    },

    config: {
      screens: {
        TabNavigation: {
          screens: {
            HomeStack: {

            },
            MarketStack: {
              initialRouteName: 'Market',
              screens: {
                Market: 'market',
                FreshMeals: 'freshmeals',
                Products: 'market/:parentId/:subCategoryID',
                Influencers: 'lists',
                InfluencerDetails: 'lists/:influencerId'
              }
            },
            AccountStack: {
              screens: {
                MyAccount: 'my-account',
                MyOrders: 'my-orders',
                ChangePassword: 'change-password',
                AccountSettings: 'account-settings',
                OrderDetails: 'order-details',
                LinkedAccount: 'linked-account',
                Faq: 'faq',
                SavedCards: 'saved-cards',
                AddCard: 'add-card',
                ScheduleContainer: 'schedule-container',
                DeliveryAddresses: 'delivery-addresses',
                AddNewAddress: 'add-new-address',
                AddAddressStepOne: 'add-new-address-step1',
                AddAddressStepTwo: 'add-new-address-step2',
                HelpCenter: 'help-center',
                PaleoWallet: 'paleo-wallet',
                StoreCreditPackages: 'store-credit-packages',
                PaymentMethods: 'payment-methods',
                Chat: 'chat',
                HowItWorks: 'how-it-works',
                AboutUs: 'about-us',
                DeliveryDetails: 'delivery-details',
                QRCodeTransaction: 'qr-code-transaction',
                AddCreditSuccess: 'add-credit-success',
                AddCreditError: 'add-credit-error'
              }
            },
            Favorites: {

            },
            CartStack: {
              screens: {
                Cart: 'cart'
              }
            }
          }
        },
        Referral: 'referral/:refId'
      }
    },
  }

  const needToUpdate = async () => {
    const { ios, android } = await ProductsProvider.getAppVersions();
    const versionCode = Platform.OS === 'ios' ? ios : android;
    console.log('Version code', versionCode, Constants.nativeAppVersion);
    if (compareVersions(Constants.nativeAppVersion, versionCode) === -1) {
      return {
        isNeeded: true
      }
    } else {
      return {
        isNeeded: false
      }
    }
  }

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        alert('No internet! The app will not function normally without a connection to the internet.');
      }
    });
    return () => {
      unsubscribe();
    }
  }, []);

  // Product Listing Related functions
  const getSubcategoriesArray = (id, cateArray) => {
    let filtered = cateArray.filter((x) => x[1].parent_id == id);
    filtered.sort((a, b) => a[1].sequence_app - b[1].sequence_app);
    return filtered;
  };

  // Maybe combine the 2 functions bellow togheter in the future.
  const getProducts = async (parentId, subcategoriesItemIds) => {

    const updateArray = [];

    // Not sure if this is still necessary but leave it here in case there are issues
    // const ids = subcategoriesItemIds
      // .sort((a, b) => a.sequence - b.sequence)
      // .map((item) => item.product_id.toString());

    let remoteArray=[];

    subcategoriesItemIds.forEach((item) => {
      // console.log('item',item, item.product_id);
      let item_details = global.groceryProductsArray.find((x) => x.docId == item.product_id);
      // console.log('item_details',item_details);
      remoteArray.push(item_details)
    })


    for (let index = 0; index < remoteArray.length; index++) {
      updateArray.push({
        ...remoteArray[index],
        // recommendedItems: remoteArray[index].related_products.map(p => p.id),
        quantity: 0,
      });
    }

    const categoryData = { data: updateArray, pId: parentId };
    // console.log('categoryData',categoryData);
    return categoryData;
  };

  const getProductsWithSubcategories = async (parentId, subcategoriesIds) => {

    let productGroupArray = global.categoriesArray;
    let allCategories = Object.assign([], productGroupArray);
    
    var dataArray = [];
    if (parentId== 321) {
      // console.log('parentId',parentId);
    }
    
    let number_of_subcategories = subcategoriesIds.length;
    for (let j = 0 ; j< number_of_subcategories; j++) {
      // if (parentId== 321) {
        // console.log('subcategoriesIds[j][0]',subcategoriesIds[j][0]);
        // console.log('subcategoriesIds[j][1]',subcategoriesIds[j][1]);
      // }

      let subcategoriesItemIds = subcategoriesIds[j][1].items;
      let code = subcategoriesIds[j][1].code;

      let remoteArray=[];

      subcategoriesItemIds.forEach((item) => {
        // console.log('item',item, item.product_id);
        let item_details = global.groceryProductsArray.find((x) => x.docId == item.product_id);
        // console.log('item_details',item_details);
        remoteArray.push(item_details)
      })

      // Not sure if this is still necessary but leave it here in case there are issues
      // let prodIdsData = subcategoriesItemIds
      //  .sort((a, b) => a.sequence - b.sequence)
      //  .map((item) => item.product_id.toString());

      // remoteArray = remoteArray.sort((a, b) => {
        // return prodIdsData.indexOf(a.docId) - prodIdsData.indexOf(b.docId);
      // });

      
      // We now also check for subsubcategories and products in those sub subcategories
      var subsubcategoriesIds = getSubcategoriesArray(subcategoriesIds[j][0], allCategories);
      // if (parentId== 321) {
        // console.log('subsubcategoriesIds',subsubcategoriesIds);
      // }
      
      if (subsubcategoriesIds[0] && subsubcategoriesIds[0][1] && subsubcategoriesIds[0][1].items) {
        
        let number_of_subsubcategories = subsubcategoriesIds.length;
        for (let j = 0 ; j< number_of_subsubcategories; j++) {
          
          // console.log('subcategoriesIds[j][0]',subsubcategoriesIds[j][0]);
          // console.log('subcategoriesIds[j][1]',subsubcategoriesIds[j][1]);

          let subsubcategoriesItemIds = subsubcategoriesIds[j][1].items;
          let subcode = subsubcategoriesIds[j][1].code;

          // let remoteArray=[];
          // remoteArray.push(subcategoriesIds[j][1].name);
          // let subsubcategoryName = Object.assign([], subsubcategoriesIds[j][1].name);
          remoteArray.push(subsubcategoriesIds[j][1]);

          subsubcategoriesItemIds.forEach((item) => {
            // console.log('item',item, item.product_id);
            let item_details = global.groceryProductsArray.find((x) => x.docId == item.product_id);
            // console.log('item_details',item_details);
            // console.log('item_details',item_details);
            remoteArray.push(item_details)
          })
          
          // console.log('remoteArray',remoteArray);
        }        
      }
      
      var updateArray = [];
      for (let index = 0; index < remoteArray.length; index++) {
        updateArray.push({
          ...remoteArray[index],
          quantity: 0,
        });
      }
      
      // if (parentId== 321) { 
        // console.log('updateArray',updateArray);
      // }

      dataArray.push({ code: code, dataArray: updateArray });
      // if (parentId== 321) { 
        // console.log('dataArray',dataArray);
      // }

      // console.log('dataArray',dataArray);

    }
    

    let categoryData = {};
    categoryData = { data: dataArray, pId: parentId };
    // console.log('categoryData',categoryData);
    return categoryData;
  };

  const getMarketProductGroups = async () => {

    let productGroupArray = global.categoriesArray;
    let allCategories = Object.assign([], productGroupArray);

    let marketMainCategoriesArray = [];
    let freshMealsCategory = null;
    for (let index = 0; index < productGroupArray.length; index++) {
      // Get FreshMeals category (for image)
      if (productGroupArray[index][0] == "120") {
        freshMealsCategory = productGroupArray[index][1];
      }
      // Get only the main categories under Navbar
      if (productGroupArray[index][1].parent_id && productGroupArray[index][1].parent_id == "113") {
        marketMainCategoriesArray.push(productGroupArray[index]);
      }
    }

    // Get and set up the freshMealsCategory section first
    const FreshMealsItem = [
      "freshMeals",
      {
        code: " ",
        description: null,
        image: freshMealsCategory ? freshMealsCategory.image : "http",
        name: "Fresh Meals",
        parent_id: " ",
        products: [],
        sequence_app: 0,
      },
    ];
    marketMainCategoriesArray.unshift(FreshMealsItem);

    // This should be removed once we solve the orderBy issue in the firebase code
    marketMainCategoriesArray.sort(function (a, b) {
      return a[1].sequence_app - b[1].sequence_app;
    });

    // Saving the Market categories in a Global variable for usage in the Market section
    global.marketSectionCategoriesArray = marketMainCategoriesArray;
    
    console.log('marketSectionCategoriesArray',marketSectionCategoriesArray);

    console.log('productsRoutesData Initial Check',productsRoutesData);
    
    if (productsRoutesData.length == 0) {
      let dataProductsArray = [];
      for (let index = 1; index < marketMainCategoriesArray.length; index++) {
        if (marketMainCategoriesArray[index][1].touch !== "disabled") {
          // Gets Subcategories of the current Category
          const subcategoriesIds = getSubcategoriesArray(marketMainCategoriesArray[index][0], allCategories);
          // console.log('subcategoriesIdS',subcategoriesIdS);
          let arrayCats = {};
          // If we have categories and subcategories
          if (subcategoriesIds[0] && subcategoriesIds[0][1] && marketMainCategoriesArray[index][1].items.length == 0) { //  && subcategoriesIds[0][1].items
            arrayCats = getProductsWithSubcategories(marketMainCategoriesArray[index][0], subcategoriesIds);
            dataProductsArray.push(arrayCats);
          // Only categories
          } else if (marketMainCategoriesArray[index][1].items.length > 0) {
            arrayCats = getProducts(marketMainCategoriesArray[index][0], marketMainCategoriesArray[index][1].items);
            dataProductsArray.push(arrayCats);
          }
        }
      }
      Promise.all(dataProductsArray).then((content) => {
        console.log('productsRoutesData Check',content);
        setProductsRoutesData(content);
      });
    }

  };

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "FuturaPassata-Display": require("./assets/fonts/FuturaPassata-DISPLAY.ttf"),
          "GT-Walsheim-Pro-Regular-Regular": require("./assets/fonts/GT-Walsheim-Pro-Regular-Regular.ttf"),
          "GTWalsheim-Regular-Oblique": require("./assets/fonts/GT-Walsheim-Regular-Oblique.ttf"),
          "GT-Walsheim-Pro-Bold-Regular": require("./assets/fonts/GT-Walsheim-Pro-Bold-Regular.ttf"),
          "GT-Walsheim-Pro-Condensed-Regular": require("./assets/fonts/GT-Walsheim-Pro-Condensed-Regular.otf"),
          "GT-Walsheim-Pro-Condensed-Bold": require("./assets/fonts/GT-Walsheim-Pro-Condensed-Bold.ttf"),
          "GT-Walsheim-Pro-Medium-Regular": require("./assets/fonts/GT-Walsheim-Pro-Medium-Regular.ttf"),
        });
        
        console.log('Categories Loading Started', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
        const productsGroupsArray = await getProductsGroupsData(false);
        // console.log('Check Result',productsGroupsArray);
        global.categoriesArray = productsGroupsArray;
        console.log('Categories Loading End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));

        // Loading products here in order to make sure the query finishes (takes 4-5 seconds still)
        console.log('Products Loading Started', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
        const productsArray = await getAllProductsData();
        // console.log('Check Result',productsArray);
        global.groceryProductsArray = productsArray;
        console.log('Products Loading End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));

        console.log('Setting Up Market Categories and Routes Start', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));
        await getMarketProductGroups();
        console.log('Setting Up Market Categories and Routes End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'));

        const needUpdate = await needToUpdate();
        if (needUpdate.isNeeded) {
          setIsAppUpdating(false);
          setShowUpdateModal(true);
        } else {
          if (__DEV__) {
            setIsAppUpdating(false);
          } else {
            try {
              const update = await Updates.checkForUpdateAsync();
              if (update.isAvailable) {
                setIsAppUpdating(true);
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              } else {
                setIsAppUpdating(false);
              }
            } catch(ex) {
              setIsAppUpdating(false);
            }
          }
        }
      } catch(ex) {
        console.warn(e);
      } finally {
        console.log('app is ready');
      }
    }

    prepare();
  }, []);

  const checkClipboardForDeeplinks = async (delay) => {
    return new Promise((resolve) => {
      delay = delay || 0;
      setTimeout(async () => {
        // const clipboard = Platform.OS === 'android' ? DeprecatedClipboard : Clipboard;
        // const pastedString = await clipboard.getString();
        // if (pastedString.includes('cp_url=true')) {
        //   clipboard.setString('');
        //   appsFlyer.performOnAppAttribution(pastedString);
        // }
        resolve();
      }, delay);
    });
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appStateValue.current.match(/inactive|background/) && nextAppState === "active") { // inactive|
        checkClipboardForDeeplinks();
      }
      appStateValue.current = nextAppState;
    });
    return () => {
      subscription?.remove();
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppUpdating !== undefined) {
      await SplashScreen.hideAsync();
      setIsAppReady(true);

      if (isAppUpdating === false) {
        await AppsFyler.initSDK();
        AppsFyler.logEvent('new_app_session', {});
        await checkClipboardForDeeplinks(100);
      }
    }
  }, [isAppUpdating]);

  useEffect(() => {
    Settings.setAdvertiserTrackingEnabled(true);
  }, []);

  useEffect(() => {
    const unsubscribe = ProductsProvider.subscribeToChatAvailability((status) => {
      setChatAvailabilityStatus(status);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log('APP Use Effect 3 - Set Ref Id');

    // Alternative way in case the bottom one has issues
    /*
    async function checkRefId() {
      try {
        const test_value = await AsyncStorage.getItem('referralId');
        if (test_value !== null){
          console.log('test_value',test_value);
          alert('Done');

          // this.setState({ access_token: value });
        } else {
          console.log('test_value does not exist');
          alert('No test_value');
        }
      } catch (error) {
        console.log('Error');
        alert('Error');
      }
    }
    checkRefId();
    */

    AsyncStorage.getItem("referralId").then((value) => {
      // alert('value'+value);
      if (value) {
        // alert('value1'+value);
        setRefId(value);
      }
    });
  }, []);

  useEffect(() => {
    console.log('APP Use Effect 3 - Set Ref Voucher Id');
    AsyncStorage.getItem("refVoucher").then((value) => {
      // alert('value'+value);
      if (value) {
        // alert('value1'+value);
        setRefVoucher(value);
      }
    });
  }, []);
  
  /*
  useEffect(() => {
    console.log('APP Use Effect 3');
    AsyncStorage.getItem("cartId").then((value) => {
      if (value) {
        const localData = JSON.parse(value);
        global.cartId = localData;
      }
    });
  }, []);
  */

  useEffect(() => {
    console.log('APP Use Effect 1 x');
    if (loginData) {
      try {
        AsyncStorage.setItem("loginData", JSON.stringify(loginData));
      } catch (error) {
        console.error(error);
      }
    }
  }, [loginData]);

  useEffect(() => {
    console.log('APP Use Effect 2');
    AsyncStorage.getItem("loginData").then((value) => {
      if (value) {
        const localData = JSON.parse(value);
        console.log("login data in settings", localData);
        setLoginData(localData);
      }
    });
  }, []);

  const updateCartId = (id) => {
    global.cartId = id;
    /*
    try {
      AsyncStorage.setItem("cartId", JSON.stringify(id));
    } catch (error) {
      console.error(error);
    }
    */
  };

  useEffect(() => {
    if (isNotificationShowing && !isAddToOrderPopup && !isAddressNotificationShowing) {
      animatedRef.current
        .measure((x, y, width, height, pageX, pageY) => {
          translateY.setValue(height * -1);

          Animated.sequence([
            Animated.parallel([
              Animated.timing(opacity, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(translateY, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),

            Animated.delay(3000),

            Animated.parallel([
              Animated.timing(opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(translateY, {
                toValue: height * -1,
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),
          ]).start(() => setIsNotificationShowing(false));
        });
    } else {
      if (animatedRef.current) {
        animatedRef.current
          .measure((x, y, width, height, pageX, pageY) => {
            Animated.parallel([
              Animated.timing(opacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(translateY, {
                toValue: height * -1,
                duration: 1000,
                useNativeDriver: true,
              }),
            ]).start();
            // translateY.setValue(height * -1);
          });
      }
    }
  }, [animatedRef.current, isNotificationShowing, isAddToOrderPopup, isAddressNotificationShowing]);

  const addToCart = (obj, quantity, operation) => {
    const {
      docId,
      ecom_select_lot,
      sale_invoice_uom_id,
    } = obj;
    const id = parseInt(docId);
    // setTimeout(() => {
      // console.log("ADDED NOW", this.props)
      // if (!this.props.productId)
      // 	throw "Missing product ID";
      var value = quantity;

      if (loginData) {
        var { token, user_id } = loginData;
      } else {
        var user_id = null;
        var token = null;
      }

      var btnProperty = sale_invoice_uom_id && sale_invoice_uom_id.name == "KG" && ecom_select_lot  ? 3 : 2;
      console.log("value0", id, value, btnProperty, "grocery_cart", global.cartId);
      analytics().logEvent('add_to_cart');
      API.grocery_cart_set_qty_simple(
        id,
        value,
        btnProperty,
        updateCartId,
        setCartData,
        setMealsCartData,
        'grocery',
        setIsAnyApiLoading,
        { token, user_id },
        operation,
        (err) => {
          console.log("err--", err);
        }
      ).then(() => {

        if (mealsCartData?.lines?.length >0) {

          if (mealsCartData.lines[0].ship_address_id && mealsCartData.lines[0].delivery_date && mealsCartData.lines[0].delivery_slot_id) {

            var selected_address = mealsCartData.lines[0].ship_address_id.id;
            var selected_date = mealsCartData.lines[0].delivery_date;
            var selected_interval = mealsCartData.lines[0].delivery_slot_id.id;

            var number_of_meal_delivery_days = Object.keys(mealsCartData.ship_addresses_days).length;

            if (number_of_meal_delivery_days >0) {

              if (cartData) {
                var grocery_ship_address_id = cartData.ship_address_id? cartData.ship_address_id.id : null;
                var grocery_delivery_date = cartData.delivery_date || null;
                var grocery_delivery_slot_id = cartData.delivery_slot_id ? cartData.delivery_slot_id.id : null;
                console.log('Grocery delivery values', grocery_ship_address_id, grocery_delivery_date,grocery_delivery_slot_id);
              } else {
                var grocery_cart_id= global.cartId;
                console.log('Grocery Cart Id ', grocery_cart_id);
                // alert('Grocery Cart Id ' + grocery_cart_id);
                // We have to force the reading of the cart on the first add to cart because of the way the code is structured...
                // await NF.grocery_cart_load(undefined,'default');
                // var grocery_cart = NF.grocery_cart_get_data();
              }

              var update_vals = false;

              if (number_of_meal_delivery_days == 1) {
                var vals = {
                  ship_address_id: selected_address,
                  delivery_date: selected_date,
                  delivery_slot_id: selected_interval,
                }
                // Only update if needed
                // cartID is always present in the app
                // We need to check for null values as well in here
                if ((grocery_delivery_date == null || grocery_delivery_slot_id == null || grocery_ship_address_id == null) || (grocery_ship_address_id != selected_address) || (grocery_delivery_date != selected_date) || (grocery_delivery_slot_id != selected_interval)) {
                  update_vals = true;
                }
              }

              // We do not want to do this in the APP
              // PENDING FOR CONFIRMATION
              /*
              if (number_of_meal_delivery_days > 1) {
                // Only update if needed
                if ((grocery_delivery_date != null) && (grocery_delivery_slot_id !=null)) {
                  var vals = {
                    delivery_date: null,
                    delivery_slot_id: null,
                  }
                  update_vals = true;
                }
              }
              */

              if (update_vals) {
                API.grocery_cart_write(
                  vals,
                  setMealsCartData,
                  setCartData,
                  'combined',
                  'yes',
                  { token, user_id },
                  'grocery_slot_and_address_change_app'
                );
              }
            }


            // Leave it here until we confirm there are no bugs with the above.
            /*
            const data = groupBy2(mealsCartData.lines, "delivery_date");
            const dataLength = Object.keys(data).length;
            console.log('dataLength',dataLength);

            // When we add groceries the first time, if we only have 1 days worth of meals, then we automatically merge them with the meals, (irrespective of what the user chose as a delivery date/ or address)
            if (dataLength == 1) {
              console.log('dataLength 2',dataLength);
              var grocery_ship_address_id = cartData.ship_address_id? cartData.ship_address_id.id : null;
              var grocery_delivery_date = cartData.delivery_date || null;
              var grocery_delivery_slot_id = cartData.delivery_slot_id ? cartData.delivery_slot_id.id : null;

              console.log('Checking Values', grocery_delivery_date, grocery_delivery_slot_id, grocery_ship_address_id, mealsCartData.lines[0].delivery_date, mealsCartData.lines[0].delivery_slot_id.id, mealsCartData.lines[0].ship_address_id.id);

              if (mealsCartData.lines[0].ship_address_id && mealsCartData.lines[0].delivery_slot_id) {
                if ((grocery_delivery_date == null || grocery_delivery_slot_id == null || grocery_ship_address_id == null) || (grocery_delivery_date != mealsCartData.lines[0].delivery_date || grocery_delivery_slot_id != mealsCartData.lines[0].delivery_slot_id.id || grocery_ship_address_id != mealsCartData.lines[0].ship_address_id.id)) {
                  console.log('dataLength 3',dataLength);

                  const vals = {
                    delivery_date: mealsCartData.lines[0].delivery_date,
                    delivery_slot_id: mealsCartData.lines[0].delivery_slot_id.id,
                    ship_address_id: mealsCartData.lines[0].ship_address_id.id,
                  };

                  API.grocery_cart_write(
                    vals,
                    setMealsCartData,
                    setCartData,
                    { token, user_id },
                    'combined'
                  );
                }
              }
            }
            */

          }

        }

      });
    // }, 10);
  };
  
  useEffect(() => {
    getInitialUserData();
  }, [loginData]);

  const getInitialUserData = async () => {
    if (loginData) {
      const { token, user_id, accountInfo } = loginData;
      try {
        var res = await API.execute(
          "ecom2.interface",
          "search_notif_fav",
          [
            accountInfo.contact_id.id
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



      } catch (err) {
        console.log("err", err);
      }
    }
  };

  const getUserData = () => {
    const { token, user_id, accountInfo } = loginData;
    API.user_load({ user_id: user_id }, () => {})
      .then((response) => {
        let previousData = Object.assign({}, loginData)
        setLoginData({ ...previousData, accountInfo: response[0] })
      })
      .catch((err) => {
        alert(err)
      })
  }

  useEffect(() => {
    const checkPushBadgeCount = async () => {
      const badgeCount = await Notifications.getBadgeCountAsync();
      console.log('Badge count', badgeCount);
      await Notifications.setBadgeCountAsync(0);
    }
    checkPushBadgeCount();
  }, []);

  useEffect(() => {
    registerDeviceToken();
  }, [loginData]);

  useEffect(() => {
    const subscription = Notifications.addPushTokenListener(registerDeviceToken);
    return subscription.remove();
  }, []);

  const registerDeviceToken = async () => {
    if (loginData) {
      // alert('We have login data');

      const { token, user_id, accountInfo } = loginData;

      // Leave this here for later testing
      /*
      const optsx = {
        app_name: "paleo_robbie",
        device_name: 'test',
        token_native: 'test',
        token_type: 'test',
        os_name: 'test',
        os_version: 'test',
        api_level: 'test'
      };

      await API.registerDeviceToken('xxxx', optsx, { token, user_id }).then((data) => {
        console.log('data',data);
      });
      */

      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        console.log('Testing to see if this runs 3', finalStatus, existingStatus);
        // Added undetermined status in order to avoid alrets in dev. Might need to be removed live.
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        let vals = {};
        if (finalStatus !== 'granted' && finalStatus !== 'undetermined') {
          // Update flag in database for current user
          if (accountInfo && accountInfo.contact && accountInfo.contact.id) {
            vals['plr_notif_deliv_app'] = 0;
            await API.execute('contact', 'write', [[accountInfo?.contact?.id], vals], {}, () => {}, {
              token: token,
              user_id: user_id,
            })
            .then((data) => {
              // getUserData()
            })
            .catch((err) => {
              alert('Error: ' + err)
            })
          }
          return;
        }
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('notifs', {
            name: 'Driver Notifications',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'l2g_notif.wav'
          });
        }

        // register expo push token to netforce backend
        let experienceId = undefined;
        if (!Constants.manifest) {
          // Absence of the manifest means we're in bare workflow
          experienceId = '@jonv31/paleorobbie';
        }
        const devicePushToken = await Notifications.getDevicePushTokenAsync();
        const res = await Notifications.getExpoPushTokenAsync({
          experienceId,
          devicePushToken
        });
        let push_token = res.data;
        console.log('--> token', push_token);
        const opts = {
          app_name: "paleo_robbie",
          device_name: Constants.deviceName,
          token_native: "",
          token_type: "",
          os_name: Device.osName,
          os_version: Device.osVersion,
          api_level: Device.platformApiLevel
        };
        await API.registerDeviceToken(push_token, opts, { token, user_id });
        console.log('Successfully registered device token', push_token);

        // Update flag in database for current user
        if (accountInfo && accountInfo.contact && accountInfo.contact.id) {
          vals['plr_notif_deliv_app'] = 1;
          await API.execute('contact', 'write', [[accountInfo?.contact?.id], vals], {}, () => {}, {
            token: token,
            user_id: user_id,
          })
          .then((data) => {
            // getUserData()
          })
          .catch((err) => {
            alert('Error: ' + err)
          })
        }

        // register push token for AppsFlyer to measure app uninstalls
        if (Platform.OS === 'android') {
          AppsFyler.updateServerUninstallToken(devicePushToken.data);
          console.log('GOT native token', devicePushToken);
        }
      } catch (err) {
        console.log('Failed to register device: ' + err);
      }

    } else {
      // alert('We do not have login data');
    }
  }

  const renderNotificationLabel = () => {
    return (
      <View style={notifyStyles.labelContainer}>
        <Text small color={white} textAlign={"center"} lineHeight={16}>
          If you would like to cancel this and shop for a new order
        </Text>
        <View style={notifyStyles.underline}>
          <Text small color={white} textAlign={"center"}>
            click here.
          </Text>
        </View>
      </View>
    );
  };

  const renderDeliveryNotificationLabel = () => {
    return (
      <View style={notifyStyles.labelContainer}>
        <Text small color={white} textAlign={"center"} lineHeight={16}>
          Please
        </Text>
        <View style={notifyStyles.underlineAddress}>
          <Text small color={white} textAlign={"center"}>
            change your delivery address
          </Text>
        </View>
        <Text small color={white} textAlign={"center"} lineHeight={16}>
          to be able to order.
        </Text>
      </View>
    );
  };

  if (isAppUpdating === undefined) {
    return null;
  }

  const statusBarStyle = isNotificationShowing ? "light-content" : barStyle;
  const statusBarBgColor = isNotificationShowing
    ? appColors.notificationBack
    : barStyle === "light-content"
    ? appColors.headerBgColor
    : appColors.lightGrey;

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.container} >
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={statusBarBgColor}
        />

        <SafeAreaProvider>
          <AppContext.Provider
            value={{
              setIsPaymentProcessing,
              isPaymentProcessing,
              setIsAnyPopupOpened,
              isAnyPopupOpened,
              isNotificationShowing,
              setIsNotificationShowing,
              isAddToOrderPopup,
              setIsAddToOrderPopup,
              setIsAddressNotificationShowing,
              setSelectedPaymentMethod,
              selectedPaymentMethod,
              setIsApiLoaderShowing,
              isApiLoaderShowing,
              setLoginData,
              loginData,
              productsRoutesData,
              setProductsRoutesData,
              updateCartId,
              cartData,
              setCartData,
              mealsCartData,
              setMealsCartData,
              isAnyApiLoading,
              setIsAnyApiLoading,
              addToCart,
              chatAvailabilityStatus,
              homeDataObj,
              setHomeDataObj,
              setBarStyle,
              refId,
              setRefId,
              refVoucher,
              setRefVoucher,
              appState,
              setAppState,
              userDataArray,
              setUserDataArray
            }}
          >
            
            <Animated.View
              ref={animatedRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 8,
                opacity: opacity,
                transform: [
                  {
                    translateY: translateY,
                  },
                ],
              }}
            >
              <GestureRecognizer
                style={{flex: 1}}
                onSwipeUp={ () => setIsNotificationShowing(false) }
              >
                <TouchableOpacity>
                  <DeliveryNotification
                    title={
                      "We have updated the delivery slot you are currently shopping \n for to the next available one."
                    }
                    labelType="null"
                    label={null}
                    margin={3}
                  />
                </TouchableOpacity>
              </GestureRecognizer>
            </Animated.View>
            {isNotificationShowing && (
              <TouchableOpacity
                style={{
                  position: !isAddToOrderPopup && !isAddressNotificationShowing
                      ? "absolute"
                      : "relative",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 8,
                }}
                onPress={() => {
                  setIsNotificationShowing(false);
                }}
              >
                {isAddToOrderPopup && !isAddressNotificationShowing && (
                  <DeliveryNotification
                    heading="You are currently adding items to order SO-123456."
                    labelType="component"
                    label={renderNotificationLabel()}
                    margin={3}
                  />
                )}
                {isAddressNotificationShowing && (
                  <DeliveryNotification
                    margin={0}
                    heading="Fresh Meals cannot be delivered outside of Bangkok."
                    labelType="component"
                    label={renderDeliveryNotificationLabel()}
                  />
                )}
              </TouchableOpacity>
            )}

            {isAppUpdating === true ? (
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: appColors.darkRed}}>
                <Image source={appImages.splashLogo} style={styles.splashLogo}/>
                <View style={styles.updatingInfoWrapper}>
                  <Text largeRegularPlus color={appColors.white} style={styles.updatingText}>
                    Our app is updating to the latest version! Please wait a moment.
                  </Text>
                  <ActivityIndicator size="large" color={appColors.white} style={styles.updatingSpinner}/>
                </View>
              </View>
            ) : (
              !showUpdateModal ? <MainStack initialRoute={loginData ? 'TabNavigation': 'Auth' } linking={disableDeepLinking ? null : linking}/> : null
            )}
            <UpdatePopup
              showPrivacyModal={showUpdateModal}
              setShowPrivacyModal={() => {
                setShowUpdateModal(false);
              }}
            />
            <Loader />
          </AppContext.Provider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.darkRed
  },
  splashLogo: {
    width: 135,
    height: 126,
    resizeMode: 'contain',
  },
  updatingInfoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 268,
    display: 'flex',
    alignItems: 'center'
  },
  updatingText: {
    textAlign: 'center',
    padding: 16
  },
  updatingSpinner: {
    marginTop: 33
  }
});

export default App;
