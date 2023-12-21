import React from 'react';
import { Pressable, StyleSheet, View, Image } from 'react-native';
import { appColors, appImages } from '../../theme';
import Text from '../Text';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#05B34C',
    borderRadius: 10,
    height: 53,
    display: 'flex',
    flexDirection: 'row'
  },
  iconSpeechBubble: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 53
  },
  icon: {
    width: 53,
    height: 53,
    resizeMode: 'cover'
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#000000',
    opacity: 0.08
  },
  textWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  hover: {
    backgroundColor: '#000',
    opacity: 0.3,
    position: 'absolute',
    borderRadius: 10,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
})

const LINELoginButton = ({disabled, onPress, style, label}) => {
  const containerStyle = {
    'disabled': {
      backgroundColor: '#FFFFFF',
      borderColor: 'rgba(229, 229, 229, 0.6)',
      borderWidth: 1
    },
    'hover': {

    },
    'pressed': {

    }
  }
  const verticalLineStyle = {
    'disabled': {
      opacity: 0.6,
      backgroundColor: '#E5E5E5',
    }
  }
  return (
    <Pressable style={({pressed}) => [
      styles.container,
      disabled ? containerStyle.disabled : pressed ? containerStyle.pressed : null,
      style,
    ]} disabled={disabled} hitSlop={5.5}
    onPress={onPress}>
      {({pressed}) => (
        <>
          {pressed ? <View style={styles.hover}></View> : null}
          <View style={styles.iconSpeechBubble}>
            <Image style={styles.icon} source={disabled ? appImages.lineIconDisabled: appImages.lineIcon }/>
          </View>
          <View style={[styles.verticalLine, disabled ? verticalLineStyle.disabled : null]}></View>
          <View style={styles.textWrapper}>
            <Text color={disabled? appColors.lineTextDisabled : appColors.white} bold style={{fontSize: 15}}>{label || 'Log in'}</Text>
          </View>
        </>
      )}
    </Pressable>
  )
}

export default LINELoginButton;