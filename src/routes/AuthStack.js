import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CardStyleInterpolators } from "@react-navigation/stack";
// Routes
import Login from "./../screens/Login";
import Signup from "./../screens/Signup";
import ForgotPassword from "../screens/ForgotPassword";
import PostCode from "../screens/PostCode";
import AddAddressStepOne from "./../screens/AddAddressStepOne";
import Welcome from "../screens/Welcome";

import ReferralLanding from '../screens/ReferralLanding'

const Stack = createNativeStackNavigator();

export default AuthStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={"welcome"}
      screenOptions={{
        header: () => null,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="signUp" component={Signup} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="PostCode" component={PostCode} />
      <Stack.Screen name="AddAddressStepOne" component={AddAddressStepOne} />
      <Stack.Screen name="welcome" component={Welcome} />
      
      <Stack.Screen name="Referral" component={ReferralLanding} />
    </Stack.Navigator>
  );
};
