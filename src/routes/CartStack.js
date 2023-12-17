import React, { useContext, useState, useEffect, useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CardStyleInterpolators } from "@react-navigation/stack";
// Routes
import { useFocusEffect } from "@react-navigation/native";
import PaymentMethods from "./../screens/PaymentMethods";
import Cart from "./../screens/Cart";
import Checkout from "./../screens/Checkout";
import Chat from "./../screens/Chat";
import QRCode from "./../screens/QRCode/";
import AddNewAddress from './../screens/AddNewAddress'
import AddAddressStepOne from './../screens/AddAddressStepOne'
import AddAddressStepTwo from './../screens/AddAddressStepTwo'
import CheckoutSuccess from "./../screens/CheckoutSuccess/";
import CheckoutSuccessSurvey from "./../screens/CheckoutSuccessSurvey/";
import CheckoutSuccessThanks from "./../screens/CheckoutSuccessThanks/";
import CheckoutSuccessShare from "./../screens/CheckoutSuccessShare/";
import CheckoutSuccessInvite from "./../screens/CheckoutSuccessInvite/";
import CheckoutError from "./../screens/CheckoutError/";
import CheckoutSO from "./../screens/CheckoutSO/";

import StoreCreditPackages from './../screens/StoreCreditPackages'
import QRCodeTransaction from '../screens/QRCodeTransaction'
import AddCreditSuccess from '../screens/AddCreditSuccess'
import AddCreditError from '../screens/AddCreditError'

import AddCard from './../screens/AddCard'

import AppContext from "../provider";
const Stack = createNativeStackNavigator();

export default CartStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={"Cart"}
      screenOptions={{
        header: () => null,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="AddCard" component={AddCard} />
      
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="QRCode" component={QRCode} />
      
      <Stack.Screen name="AddNewAddress" component={AddNewAddress} />
      <Stack.Screen name="AddAddressStepOne" component={AddAddressStepOne} />
      <Stack.Screen name="AddAddressStepTwo" component={AddAddressStepTwo} />
      
      <Stack.Screen name="CheckoutSO" component={CheckoutSO} />
      
      <Stack.Screen name="CheckoutSuccess" component={CheckoutSuccess} />
      <Stack.Screen name="CheckoutSuccessSurvey" component={CheckoutSuccessSurvey} />
      <Stack.Screen name="CheckoutSuccessThanks" component={CheckoutSuccessThanks} />
      <Stack.Screen name="CheckoutSuccessShare" component={CheckoutSuccessShare} />
      <Stack.Screen name="CheckoutSuccessInvite" component={CheckoutSuccessInvite} />
      
      
      <Stack.Screen name="CheckoutError" component={CheckoutError} />
      
      <Stack.Screen name="StoreCreditPackages" component={StoreCreditPackages} />
      <Stack.Screen name="QRCodeTransaction" component={QRCodeTransaction} />
      <Stack.Screen name="AddCreditSuccess" component={AddCreditSuccess} />
      <Stack.Screen name="AddCreditError" component={AddCreditError} />
      
    </Stack.Navigator>
  );
};
