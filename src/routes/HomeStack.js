import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CardStyleInterpolators } from '@react-navigation/stack'
import FreshMeals from './../screens/FreshMeals'
import Home from './../screens/Home'
import Search from './../screens/Search'
import MyOrders from './../screens/MyOrders'
import Products from './../screens/Products'
import OrderDetails from './../screens/OrderDetails'
import PaleoWallet from './../screens/PaleoWallet'
import BuildYourOwnSalad from '../screens/BuildYourOwnSalad'
import BuildYourOwnPlate from '../screens/BuildYourOwnPlate'
const Stack = createNativeStackNavigator()

export default MarketStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        header: () => null,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="FreshMeals" component={FreshMeals} />
      <Stack.Screen name="BuildYourOwnSalad" component={BuildYourOwnSalad} />
      <Stack.Screen name="BuildYourOwnPlate" component={BuildYourOwnPlate} />
      <Stack.Screen name="PaleoWallet" component={PaleoWallet} />
    </Stack.Navigator>
  )
}
