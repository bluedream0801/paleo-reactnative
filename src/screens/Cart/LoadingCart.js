import React, {  } from 'react'
import {
  View,
  Image
} from 'react-native'
import { appColors, appImages } from '../../theme'
const { addressGrey} = appColors
import styles from './EmptyCartStyles'
import {
  Text,
} from '../../components/'
const { empty_cart } = appImages

const LoadingCart = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Image
          source={empty_cart}
          style={styles.cartImg}
        />
        <Text condensedBold  smallTitle color={addressGrey} lineHeight={31}>
          Preparing your cart.{"\n"}One moment please!
        </Text>
      </View>
    </View>
  )
}

export default LoadingCart
