import React, { useState, useContext } from 'react'
import { Keyboard, TouchableWithoutFeedback, View, Image } from 'react-native'
import { appColors } from '../../theme'
import { Button, Header, Input, Text } from '../../components/'
import styles from './Styles'
import helpers from '../../helpers'
import AppContext from '../../provider'
const { validateEmail } = helpers
import Services from '../../services'
const { API } = Services
const { darkGrey } = appColors
const ForgotPassword = (props) => {
  const { navigation } = props

  const [showSuccessView, setShowSuccessView] = useState(false)
  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const { setIsApiLoaderShowing, setLoginData } = useContext(AppContext)

  // Sign up method
  const onSignup = () => {
    navigation.goBack()
  }

  const onRecoverPassword = () => {
    submitEmail()
    //setShowSuccessView(!showSuccessView)
  }

  const validateInputs = () => {
    let error = true

    if (email || email.trim().length > 0) {
      if (!validateEmail(email)) {
        error = false
        setErrorEmail(
          'Check again, you might have made a typo. eg:\nyou@paleo.com',
        )
      }
    } else {
      error = false
      setErrorEmail('Missing email.')
    }
    return error
  }

  const submitEmail = async (event) => {
    if (validateInputs()) {
      try {
        const res = await API.execute(
          'ecom2.interface',
          'checkEmail',
          [email],
          {},
          setIsApiLoaderShowing,
        )
        console.log('res--', res)
        if (res && res.message && res.message == 'Email Not Found') {
          const msg =
            'The email you entered has not been used on our new website yet. Did you use a different email with your or last order? Please return to the login and sign up as new to choose a password and validate your details; this only needs to be done once.'

          setErrorEmail(msg)
        } else {
          setShowSuccessView(true)
        }
      } catch (err) {
        setErrorEmail(err)
      }
    }
  }

  const renderForgotPasswordSuccess = () => {
    return (
      <View style={styles.successContainer}>
        <Image style={styles.forgotRestImg} source={appImages.forgot_reset} />
        <Text
          style={styles.successTitle}
          smallTitle
          textAlign={'center'}
          color={appColors.black}
          condensedBold
        >
          Password reset instructions have been sent to your email.
        </Text>
        <Text style={styles.emailText} textAlign={'center'} condensed>
          Please check your email.
        </Text>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1, backgroundColor: appColors.white }}
      onPress={() => Keyboard.dismiss()}
    >
      <View style={{ flex: 1, backgroundColor: appColors.white }}>
        <Header title={'Forgot password'} backPress={() => onSignup()} />

        {/* Body  */}
        {!showSuccessView && (
          <View style={styles.body}>
            <Input
              label={'Email'}
              placeholder={'Enter your email'}
              value={email}
              onChangeText={(text) => {
                setErrorEmail('')
                setEmail(text.replace(/\s/g, ''))
              }}
            />
            {errorEmail.length > 0 && (
              <Text color={darkGrey}>{errorEmail}</Text>
            )}
            <Button
              btnTitle={'Recover password'}
              onPress={() => onRecoverPassword()}
            />
          </View>
        )}
        {showSuccessView && renderForgotPasswordSuccess()}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ForgotPassword
