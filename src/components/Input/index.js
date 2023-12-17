import React, { useState, useContext } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { appColors } from '../../theme'
import styles from './Styles'

const Input = (props) => {
  const {
    onPressIcon,
    iconStyle,
    labelIcon,
    iconContainerStyle,
    editable = true,
    onChangeText,
    keyboardType,
    maxLength,
    inputStyle,
    value,
    inputViewStyle,
    label,
    onLabelIconPress,
    multiline = false,
    leftIcon,
    leftIconStyle,
    autoCorrect,
    autoFocus,
    password,
    imageSource,
    autoCapitalize = 'sentences',
    placeholderColor = appColors.placeholderColor,
  } = props

  const [isFocused, setIsFocused] = useState(false)

  const onFocus = () => {
    setIsFocused(!isFocused)
  }

  const onBlur = () => {
    setIsFocused(!isFocused)
  }

  const handleOnChangeText = (value) => {
    if (onChangeText) onChangeText(value)
  }
  const compStyles = [styles.inputView]
  compStyles.push(inputViewStyle)

  if (isFocused) {
    compStyles.push({ borderColor: appColors.darkGrey })
  } else {
    compStyles.push({ borderColor: appColors.borderGrey })
  }
  const iconContainerStyles = [styles.passwordView]
  iconContainerStyles.push(iconContainerStyle)

  const iconStyles = [styles.passwordImg]
  iconStyles.push(iconStyle)
  const inputStyles = [styles.input]
  inputStyles.push(inputStyle)

  return (
    <View style={[styles.container, props?.customStyles?.container]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {labelIcon && (
            <TouchableOpacity onPress={onLabelIconPress}>
              <Image
                source={labelIcon}
                style={styles.labelIconStyle}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={[compStyles]}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[leftIconStyle]}
            resizeMode={'contain'}
          />
        )}
        <TextInput
          autoCapitalize={autoCapitalize}
          editable={editable}
          autoCorrect={autoCorrect}
          style={[inputStyles]}
          placeholder={props.placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType={keyboardType}
          {...props}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          onChangeText={handleOnChangeText}
          value={value}
          autoFocus={autoFocus}
          maxLength={maxLength}
          multiline={multiline}
        />
        {(password || imageSource) && (
          <TouchableOpacity onPress={onPressIcon} style={[iconContainerStyles]}>
            <Image
              source={imageSource}
              style={[iconStyles]}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default Input
