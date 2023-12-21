import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import analytics from '@react-native-firebase/analytics';
// Stacks
import AuthStack from './AuthStack'
import ReferralLanding from '../screens/ReferralLanding'
import { CardStyleInterpolators } from '@react-navigation/stack'
import TabNavigation from './TabNavigation'
import NavigationRefs from './NavigationRefs'
const { navigationRef, routeNameRef } = NavigationRefs

const Stack = createNativeStackNavigator()

export default MainStack = (props) => {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={async (states) => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name
        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName
      }}
      linking={props.linking}
    >
      <Stack.Navigator
        screenOptions={{
          header: () => null,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
        initialRouteName={props.initialRoute || 'Auth'}
      >
        <Stack.Screen name="Referral" component={ReferralLanding} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="TabNavigation" component={TabNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
