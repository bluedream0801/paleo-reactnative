import React, { useState, useContext } from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'
import AppContext from '../../provider'
import { appColors } from '../../theme'
import { Button, AccountHeader, Input, Text } from '../../components/'
import styles from './Styles'
import Services from '../../services'
const { API } = Services
const { darkGrey } = appColors

const ChangePassword = (props) => {
  const { navigation } = props
  const { setIsApiLoaderShowing, loginData } = useContext(AppContext)
  const { accountInfo, token, user_id } = loginData
  const {} = accountInfo.contact_id
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errorOldPassword, setErrorOldPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('')

  const onUpdatePassword = () => {
    Keyboard.dismiss()
    if (validateInputs()) {
      API.execute(
        'contact',
        'ecom_change_password',
        [oldPassword, password],
        {},
        setIsApiLoaderShowing,
        { token: token, user_id: user_id },
      )
        .then((data) => {
          if (data && data.message) {
            alert(data.message)
          } else {
            alert('Password updated')
            navigation.goBack()
          }
        })
        .catch((err) => {
          console.log('err', err)
          alert(err)
        })
    }
  }

  const toggleOldShowPassword = () => {
    setShowOldPassword(!showOldPassword)
  }
  const toggleNewShowPassword = () => {
    setShowNewPassword(!showNewPassword)
  }
  const toggleConfirmShowPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }
  const onBackPress = () => {
    navigation.goBack()
  }

  const validateInputs = () => {
    let error = true

    if (!oldPassword || oldPassword.trim().length == 0) {
      error = false
      setErrorOldPassword('Missing old password.')
    }

    if (!password || password.trim().length == 0) {
      error = false
      setErrorPassword('Missing password.')
    }

    if (!confirmPassword || confirmPassword.trim().length == 0) {
      error = false
      setErrorConfirmPassword('Missing confirm password.')
    }

    if (
      password &&
      password.trim().length >= 0 &&
      confirmPassword &&
      confirmPassword.trim().length >= 0
    ) {
      if (password !== confirmPassword) {
        error = false
        setErrorPassword('Password does not match.')
        setErrorConfirmPassword('Password does not match.')
      }
    }

    return error
  }

  const clearErrors = () => {
    setErrorOldPassword('')
    setErrorPassword('')
    setErrorConfirmPassword('')
  }

  const renderContent = () => {
    return (
      <View style={styles.innerContainer}>
        <Input
          label={'Old password'}
          secureTextEntry={!showOldPassword}
          password
          imageSource={!showOldPassword ? appImages.eye : appImages.full_eye}
          onPressIcon={toggleOldShowPassword}
          value={oldPassword}
          onChangeText={(text) => {
            setOldPassword(text)
            clearErrors()
          }}
        />
        {errorOldPassword.length > 0 && (
          <Text color={darkGrey}>{errorOldPassword}</Text>
        )}
        <Input
          label={'New password'}
          secureTextEntry={!showNewPassword}
          password
          imageSource={!showNewPassword ? appImages.eye : appImages.full_eye}
          onPressIcon={toggleNewShowPassword}
          customStyles={{ container: styles.inputCustomStyles }}
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            clearErrors()
          }}
        />
        {errorPassword.length > 0 && (
          <Text color={darkGrey}>{errorPassword}</Text>
        )}
        <Input
          label={'Confirm new password'}
          secureTextEntry={!showConfirmPassword}
          password
          imageSource={
            !showConfirmPassword ? appImages.eye : appImages.full_eye
          }
          onPressIcon={toggleConfirmShowPassword}
          customStyles={{ container: styles.inputCustomStyles }}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text)
            clearErrors()
          }}
        />
        {errorConfirmPassword.length > 0 && (
          <Text color={darkGrey}>{errorConfirmPassword}</Text>
        )}
        <Button
          btnTitle={'Update password'}
          onPress={() => onUpdatePassword()}
        />
      </View>
    )
  }
  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={() => Keyboard.dismiss()}
    >
      <View style={styles.container}>
        <AccountHeader
          title={'Change password'}
          backArrow
          backPress={() => onBackPress()}
        />

        {/* Body  */}
        <View style={styles.body}>{renderContent()}</View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ChangePassword
