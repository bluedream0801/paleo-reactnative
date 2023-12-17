import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CardStyleInterpolators } from '@react-navigation/stack'
// Routes
import MyOrders from './../screens/MyOrders'
import MyAccount from './../screens/Account'
import ChangePassword from './../screens/ChangePassword'
import AccountSettings from './../screens/AccountSettings'
import OrderDetails from './../screens/OrderDetails'
import LinkedAccount from '../screens/LinkedAccount'
import Faq from './../screens/Faq'
import SavedCards from './../screens/SavedCards'
import AddCard from './../screens/AddCard'
import ReferAFriend from './../screens/ReferAFriend'
import ScheduleContainer from './../screens/ScheduleContainer'
import DeliveryAddresses from './../screens/DeliveryAddresses'
import AddNewAddress from './../screens/AddNewAddress'
import AddAddressStepOne from './../screens/AddAddressStepOne'
import AddAddressStepTwo from './../screens/AddAddressStepTwo'
import HelpCenter from './../screens/HelpCenter'
import PaleoWallet from './../screens/PaleoWallet'
import StoreCreditPackages from './../screens/StoreCreditPackages'
import PaymentMethods from './../screens/PaymentMethods'
import Chat from './../screens/Chat'
import HowItWorks from '../screens/HowItWorks'
import AboutUs from '../screens/AboutUs'
import DeliveryDetails from '../screens/DeliveryDetails'
import QRCodeTransaction from '../screens/QRCodeTransaction'
import AddCreditSuccess from '../screens/AddCreditSuccess'
import AddCreditError from '../screens/AddCreditError'

const Stack = createNativeStackNavigator()

export default AccountStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={'MyAccount'}
      screenOptions={{
        header: () => null,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="MyAccount" component={MyAccount} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="AccountSettings" component={AccountSettings} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="LinkedAccount" component={LinkedAccount} />
      <Stack.Screen name="Faq" component={Faq} />
      <Stack.Screen name="SavedCards" component={SavedCards} />
      <Stack.Screen name="AddCard" component={AddCard} />
      <Stack.Screen name="ReferAFriend" component={ReferAFriend} />
      <Stack.Screen name="ScheduleContainer" component={ScheduleContainer} />
      <Stack.Screen name="DeliveryAddresses" component={DeliveryAddresses} initialParams={{ isEdit: false }}/>
      <Stack.Screen name="AddNewAddress" component={AddNewAddress} />
      <Stack.Screen name="AddAddressStepOne" component={AddAddressStepOne} />
      <Stack.Screen name="AddAddressStepTwo" component={AddAddressStepTwo} />
      <Stack.Screen name="HelpCenter" component={HelpCenter} />
      <Stack.Screen name="PaleoWallet" component={PaleoWallet} />
      <Stack.Screen name="StoreCreditPackages" component={StoreCreditPackages} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="HowItWorks" component={HowItWorks} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="DeliveryDetails" component={DeliveryDetails} />
      <Stack.Screen name="QRCodeTransaction" component={QRCodeTransaction} />
      <Stack.Screen name="AddCreditSuccess" component={AddCreditSuccess} />
      <Stack.Screen name="AddCreditError" component={AddCreditError} />
    </Stack.Navigator>
  )
}
