import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { appColors, appMetrics } from '../../theme'
import styles from './Styles'
import appImages from '../../theme/appImages'

const Header = (props) => {
  const insets = useSafeAreaInsets();
  const { bgColor } = props
  const compStyles = [{ ...styles.container }]
  const textStyles = [{ ...styles.title }]
  if (bgColor) {
    compStyles.push({ backgroundColor: bgColor })
    textStyles.push({ color: appColors.black })
  } else {
    compStyles.push({ backgroundColor: appColors.headerBgColor })
  }

  return (
    <View style={[...compStyles, { paddingTop: insets.top, height: appMetrics.headerHeight + insets.top }]}>
      {!props.hideBack &&
        <TouchableOpacity
          style={[styles.leftBtn, { top: insets.top }]}
          activeOpacity={0.7}
          onPress={props.backPress}
        >
          {!bgColor && (
            <Image
              source={appImages.back}
              style={{
                width: 25,
                height: 22,
              }}
              resizeMode={'contain'}
            />
          )}
        </TouchableOpacity>
      }

      <Text style={[textStyles]}>{props.title}</Text>
    </View>
  )
}

export default Header
