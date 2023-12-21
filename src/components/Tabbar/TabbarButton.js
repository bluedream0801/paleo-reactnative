import React, { useState } from "react";
import { View, TouchableWithoutFeedback } from 'react-native'
import styles from './TabbarStyles'
import TabBarIcon from './TabBarIcon'
import { appColors } from '../../theme'
import Text from '../Text'
const {
  HOME_IC,
  HEART_IC,
  HEART_SELECTD,
  CART_IC,
  ACCOUNT_IC,
  MARKET_IC,
  MARKET_SELECTED,
  HOME_SELECTED,
  CART_SELECTED,
  ACCOUNT_SELECTED,
} = appImages
const { tabTextGrey, headerBgColor } = appColors

const TabbarButton = (props) => {
  const {
    accessibilityStates,
    accessibilityLabel,
    isFocused,
    label,
    onPress,
    cartItemsCount,
  } = props
  
  const [cartLoading, setCartIsLoading] = useState(false); // JSON.parse(JSON.stringify(timeSlots))
  
  const onPressTab = () => {
    onPress()
  }

  let icon = ''
  let tabLabel = ''

  if (label == 'HomeStack') {
    icon = isFocused ? HOME_SELECTED : HOME_IC
    tabLabel = 'Home'
  }
  if (label == 'MarketStack') {
    icon = isFocused ? MARKET_SELECTED : MARKET_IC
    tabLabel = 'Market'
  }
  if (label == 'AccountStack') {
    icon = isFocused ? ACCOUNT_SELECTED : ACCOUNT_IC
    tabLabel = 'Account'
  }
  if (label == 'Favorites') {
    icon = isFocused ? HEART_SELECTD : HEART_IC

    tabLabel = 'Favorites'
  }
  if (label == 'CartStack') {
    icon = isFocused ? CART_SELECTED : CART_IC
    // if (setCartIsLoading == false) {
      tabLabel = 'Cart'
    // } else {
      // tabLabel = 'Loading'
    // }
  }

  const tabStyles = [styles.tab]

  return (
    <TouchableWithoutFeedback
      accessibilityStates={accessibilityStates}
      accessibilityLabel={accessibilityLabel}
      onPress={() => onPressTab()}
      style={{ overflow: 'visible' }}
    >
      <View style={styles.tab}>
        <TabBarIcon
          cartItemsCount={cartItemsCount}
          label={label}
          Icon={icon}
          isFocused={isFocused}
        />

        <Text small style={{ color: isFocused ? headerBgColor : tabTextGrey }}>
          {tabLabel}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default TabbarButton
