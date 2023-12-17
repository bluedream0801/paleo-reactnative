import React from 'react'
import 'react-native-gesture-handler'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TabBar from '../components/Tabbar'
const { TabbarComponent } = TabBar

import Favorites from './../screens/Favorites'
import AccountStack from './AccountStack'
import MarketStack from './MarketStack'
import CartStack from './CartStack'
import HomeStack from './HomeStack'

const Tab = createBottomTabNavigator()

export default function TabNavigation({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => null,
        animation: 'none'
      }}
      initialRouteName={'MyAccount'}
      tabBar={(props) => <TabbarComponent {...props} />}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{forceReset: 'Home'}}/>
      <Tab.Screen name="MarketStack" component={MarketStack} options={{forceReset: 'Market'}}/>
      <Tab.Screen name="AccountStack" component={AccountStack} options={{forceReset: 'MyAccount', unmountOnBlur: true}}/>
      <Tab.Screen name="Favorites" component={Favorites}/>
      <Tab.Screen name="CartStack" component={CartStack} options={{forceReset: 'Cart', unmountOnBlur: true}} />
    </Tab.Navigator>
  )
}
