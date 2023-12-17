import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Routes
import MyOrders from './../screens/MyOrders'
import Market from './../screens/Market'
import { CardStyleInterpolators } from '@react-navigation/stack'
import Search from './../screens/Search'
import Products from './../screens/Products'
import ProductDetails from './../screens/ProductDetails'
import FreshMeals from './../screens/FreshMeals'
import BuildYourOwnSalad from './../screens/BuildYourOwnSalad'
import FreshMealsDetails from './../screens/FreshMealsDetails'
import BuildYourOwnPlate from './../screens/BuildYourOwnPlate'
import Influencers from '../screens/Influencers'
import InfluencerDetails from '../screens/Influencers/InfluencerDetails'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'

// const AnimatedStack = createSharedElementStackNavigator()

// export default MarketStack = () => {
//   return (
//     <AnimatedStack.Navigator
//       initialRouteName={'Market'}
//       screenOptions={{
//         header: () => null,
//         animation: 'none',
//       }}
//     >
//       <AnimatedStack.Screen name="Market" component={Market} />
//       <AnimatedStack.Screen name="Search" component={Search} />
//       <AnimatedStack.Screen name="Products" component={Products} />
//       <AnimatedStack.Screen name="ProductDetails" component={ProductDetails} />
//       <AnimatedStack.Screen name="FreshMeals" component={FreshMeals} />
//       <AnimatedStack.Screen
//         name="BuildYourOwnSalad"
//         component={BuildYourOwnSalad}
//       />

//       <AnimatedStack.Screen
//         name="FreshMealsDetails"
//         component={FreshMealsDetails}
//         sharedElements={(route, otherRoute, showing) => {
//           return ['123']
//         }}
//       />
//     </AnimatedStack.Navigator>
//   )
// }

const Stack = createNativeStackNavigator()

export default MarketStack = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={'Market'}
      screenOptions={{
        header: () => null,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="Market" component={Market} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="FreshMeals" component={FreshMeals} />
      <Stack.Screen name="BuildYourOwnSalad" component={BuildYourOwnSalad} />
      <Stack.Screen name="FreshMealsDetails" component={FreshMealsDetails} />
      <Stack.Screen name="BuildYourOwnPlate" component={BuildYourOwnPlate} />
      <Stack.Screen name="Influencers" component={Influencers} />
      <Stack.Screen name="InfluencerDetails" component={InfluencerDetails} />
    </Stack.Navigator>
  )
}
