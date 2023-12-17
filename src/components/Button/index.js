import React, { useState } from 'react'
import { Text, Pressable } from 'react-native'

import styles from './Styles'
const Button = (props) => {
  const { onPress, style, textStyle, small, type, disabled = false } = props

  const [selected, setSelected] = useState(!!props.selected);

  const compStyles = [{ ...styles.btnContainer }]
  const textStyles = [{ ...styles.btnText }]

  if (small) {
    compStyles.push(styles.smallBtn)
  }
  if (selected) {
    compStyles.push(styles.btnSelected);
  }
  if (disabled) {
    compStyles.push(styles.btnDisabled)
  }
  textStyles.push(textStyle)
  compStyles.push(style)

  const onPressButton = () => {
    if (type === 'toggleButton') {
      setSelected(!selected);
    }
    if (onPress) {
      onPress(!selected);
    }
  }

  return (
    <Pressable
      onPress={onPressButton}
      style={compStyles}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[textStyles]}>{props.btnTitle}</Text>
    </Pressable>
  )
}

export default Button
