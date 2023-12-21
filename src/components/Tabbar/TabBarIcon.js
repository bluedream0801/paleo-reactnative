import React from 'react'
import { View } from 'react-native'
import styles from './TabBarIconStyles'
import { appImages } from '../../theme'
import { appColors } from '../../theme'
const { CART_SELECTED, CART_IC } = appImages
const { white } = appColors
import Text from '../Text'

const TabBarIcon = (props) => {
  const { Icon, cartItemsCount } = props
  const imgContainerStyles = []

  return (
    <View style={styles.container}>
      <View style={imgContainerStyles}>
        {(Icon == CART_SELECTED || Icon == CART_IC) && cartItemsCount > 0 && (
          <View style={styles.cartItems}>
            <Text small color={white}>
              {cartItemsCount}
            </Text>
          </View>
        )}

        <Icon />
      </View>
    </View>
  )
}

export default TabBarIcon
