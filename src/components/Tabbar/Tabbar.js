import React, { useContext } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles, { TABBAR_VERTICAL_PADDING } from "./TabbarStyles";
import TabbarButton from "./TabbarButton";
import NavigationRefs from "../../routes/NavigationRefs";
import AppContext from "../../provider";
const { navigationRef } = NavigationRefs;

import helpers from "../../helpers";
import { appMetrics } from "../../theme";
const { grocery_cart_total_qty, meal_cart_total_qty } = helpers;
const TabbarComponent = (props) => {
  const insets = useSafeAreaInsets();
  const {
    isPaymentProcessing,
    isAnyPopupOpened,
    cartData,
    mealsCartData,
    loginData,
  } = useContext(AppContext);
  const { state, descriptors, navigation } = props;
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  const routName = navigationRef.current
    ? navigationRef.current.getCurrentRoute().name
    : false;

  if (routName == "AddCard") {
    return null;
  }
  if (routName == "AddAddressStepOne") {
    return null;
  }

  if (routName == "AddNewAddress") {
    return null;
  }
  if (routName == "AddAddressStepTwo") {
    return null;
  }
  if (routName == "Chat") {
    return null;
  }
  if (routName == "PaymentMethods" && isPaymentProcessing) {
    return null;
  }
  if (routName == "Search") {
    //return null
  }
  if (routName == "ProductDetails") {
    return null;
  }
  if (routName == "BuildYourOwnSalad") {
    return null;
  }
  if (routName == "FreshMealsDetails") {
    return null;
  }

  if (routName == "BuildYourOwnPlate") {
    return null;
  }
  if (routName == "PaymentMethods") {
    return null;
  }

  if (routName == "Checkout" && !isPaymentProcessing) {
    return null;
  }

  if (routName == "QRCode") {
    return null;
  }

  const getCartItemsQuantity = () => {
    var quantity = 0;

    quantity += grocery_cart_total_qty(cartData);
    quantity += meal_cart_total_qty(mealsCartData);
    
    return quantity;
  };

  return (
    <View style={styles.mainContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          // if (loginData) {
            if (isFocused) {
              navigation.navigate(route.name, { screen: options.forceReset, params: {resetScrollPosition: Math.random() }} );
            } else {
              navigation.navigate({ name: route.name });
            }
          /*
          } else {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Auth',
                  params: {
                    screen: 'signUp'
                  }
                }
              ]
            });
          }
          */
        };

        return (
          <View style={[styles.container, { height: appMetrics.footerHeight + insets.bottom / 2, paddingBottom: TABBAR_VERTICAL_PADDING + insets.bottom / 2 }]} key={index}>
            <TabbarButton
              accessibilityStates={isFocused ? ["selected"] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={() => onPress()}
              label={label}
              navigation={navigation}
              isFocused={isFocused}
              cartItemsCount={getCartItemsQuantity()}
            />
            {isAnyPopupOpened && <View style={styles.overLay} />}
          </View>
        );
      })}
    </View>
  );
};

export default TabbarComponent;
