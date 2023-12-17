import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appColors, appMetrics } from '../../theme'

import styles from './Styles'
import Text from '../Text'
import NavigationRefs from '../../routes/NavigationRefs'
const { white } = appColors
const { navigationRef } = NavigationRefs

const DeliveryNotification = (props) => {
  const { title, heading, label, labelStyle, margin } = props
  const routName = navigationRef.current
    ? navigationRef.current.getCurrentRoute().name
    : false

  const renderDetails = () => {
    let labelRender = null
    const labelType = typeof label
    if (label) {
      const isString = labelType === 'string'
      labelRender = isString ? (
        <Text color={PRIMARY} style={labelStyle}>
          {label}
        </Text>
      ) : (
        (labelRender = label)
      )
    }
    return labelRender
  }

  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + 8;

  return (
    <View style={[styles.container, { paddingTop: paddingTop , height: paddingTop + appMetrics.headerHeight }]}>
      {title && (
        <Text
          color={white}
          lineHeight={17.5}
          style={[styles.margin, { marginBottom: margin }]}
          textAlign={'center'}
          small
        >
          {title}
        </Text>
      )}

      {heading && (
        <Text
          bold
          small
          color={white}
          lineHeight={16.18}
          style={[styles.margin, { marginBottom: margin }]}
          textAlign={'center'}
        >
          {heading}
        </Text>
      )}
      {renderDetails()}
    </View>
  )
}

export default DeliveryNotification
