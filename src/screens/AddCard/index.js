import React, { useState, useEffect, useContext } from 'react'
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Image,
  Animated,
  NativeModules,
} from 'react-native';
import { My2c2p } from '../../helpers/my2c2p';

import { appColors, appImages, appMetrics } from '../../theme'
const { IS_IOS } = appMetrics
import {
  Button,
  AccountHeader,
  Input,
  Text,
  PopupModal,
} from '../../components/'
import AppContext from '../../provider'
import MonthPicker from 'react-native-month-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import Moment from 'moment'
import { TextInputMask } from 'react-native-masked-text'
const { right_arrow, question_ic, visa_ic, master_card_ic, forgot_reset } = appImages
import styles from './Styles'
import _ from 'lodash'
import { TIMEZONE } from '../../common/constants';

import Services from '../../services'
const { API } = Services

const { orderDarkGray, black, buttonOpacity } = appColors
const PupupContent =
  'The CVV is a 3 or 4-digit code on the back of VISA and MasterCard credit cards and on the front of AMEX cards.'

const AddCard = (props) => {
  const { navigation } = props
  const { setIsAnyPopupOpened, loginData, setIsAnyApiLoading } = useContext(AppContext)
  const [expiryDate, setExpiryDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [holderName, setHolderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cvvCode, setCvvCode] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuccessView, setShowSuccessView] = useState(false)
  const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0))

  const { accountInfo, token, user_id } = loginData;

  const onChange = (selectedDate) => {
    // const currentDate = selectedDate || expiryDate
    // console.log('selectedDate', selectedDate)
    // setShowDatePicker(false)
    // setExpiryDate(currentDate)
  }
  const parseNumber = (number) => {
    const trimmedNumber = String(number).trim()
    let straightNumber = trimmedNumber.replace(/[^0-9]/g, '')
    console.log('straightNeeumber', straightNumber)
    return straightNumber
  }
  const onAddCard = async () => {
    // fadeIn()
    // let timer = setInterval(() => {
      // fadeOut()

      var tokens = expiryDate.split('/')
      if (tokens.length < 3) {
        var month = tokens[0];
        var year = '20'+tokens[1];
        console.log('month and year',month,year,tokens[1])
      }

      var cleanCardNumber = cardNumber.split(' ').join('')
      // var cleanCardNumber = cardNumber;
      console.log('cardNumber',cleanCardNumber)
      // Tokenize card
      let params={
        uniqueTransactionCode: Moment().unix().toString(),
        pan: cleanCardNumber.toString(), // cardNumber "4162026210486768"
        cardExpireMonth: month,
        cardExpireYear: year,
        cardHolderName: holderName,
      };
      console.log('params', params);

      try {
        var res = await My2c2p.tokenizeCreditCard(params);
      } catch (err) {
        alert("Error: "+err);
        return;
      }
      console.log("=> res",res);
      var card_token=res.storeCardUniqueID;

      if (res.respCode == '32') {

        alert('Card succesfully saved');
        // alert("token: "+card_token);

        var vals = {
          "contact_id": accountInfo.contact_id.id,
          "mask_card": res.pan,
          "name": holderName,
          "exp_month": month,
          "exp_year": year,
          "token_type": "2c2p",
          "token": card_token,
          "cvv": cvvCode,
        };

        // Create Card Token in netforce
        var card_token_id = await API.execute("card.token","create",[vals],{},setIsAnyApiLoading,{token, user_id});
        console.log('card_token_id',card_token_id);

        navigation.goBack()

      } else {
        alert(res.failReason || 'It seems there was an error with your card');
      }

      // clearInterval(timer)
    // }, 1500)

    Keyboard.dismiss()
  }

  const toggleDatepicker = () => {
    setShowDatePicker(!showDatePicker)
  }

  const formatCardValue = (value) => {
    if (value.length == 0) {
      setCardNumber(value)
      return
    }

    if (parseNumber(value)) {
      const data = value
        .replace(/\s?/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
      setCardNumber(data)
    }
  }

  const onFocus = () => {
    setIsFocused(!isFocused)
    ///setIsKeyBoardOpen(true)
  }

  const formatFunction = (cardExpiry = '') => {
    //expiryDate will be in the format MMYY, so don't make it smart just format according to these requirements, if the input has less than 2 character return it otherwise append `/` character between 2nd and 3rd letter of the input.
    if (cardExpiry.length < 2) {
      return cardExpiry
    } else {
      return cardExpiry.substr(0, 2) + '/' + (cardExpiry.substr(2) || '')
    }
  }

  const inputToValue = (inputText) => {
    //if the input has more than 5 characters don't set the state
    if (inputText.length < 6) {
      const tokens = inputText.split('/')
      // don't set the state if there is more than one "/" character in the given input
      if (tokens.length < 3) {
        const month = Number(tokens[1])
        const year = Number(tokens[2])

        console.log('6767', month, year)
        //don't set the state if the first two letter is not a valid month
        if (month >= 1 && month <= 12) {
          let cardExpiry = month + ''
          //I used lodash for padding the month and year with  zero
          if (month > 1 || tokens.length === 2) {
            // user entered 2 for the month so pad it automatically or entered "1/" convert it to 01 automatically
            cardExpiry = _.padStart(month, 2, '0')
          }
          //disregard changes for invalid years
          if (year > 1 && year <= 99) {
            cardExpiry += year
          }

          setExpiryDate(cardExpiry)
        }
      }
    }
  }

  const onBlur = () => {
    setIsFocused(!isFocused)
    //setIsKeyBoardOpen(false)
  }
  const formatDateValue = (value) => {
    let data = value

    if (value.length == 1) {
      if (Number(value) > 1) data = '0' + value + '/'
      else data = value
    }

    if (data.length == 2 && !expiryDate.includes('/')) {
      if (
        parseInt(data.substring(0, 2)) > 12 ||
        parseInt(data.substring(0, 2)) == 0
      ) {
        data = data[0]
      } else {
        data = value + '/'
      }
    }
    if (data.length == 3 && expiryDate.includes('/')) {
      data = data.substring(0, 2)
    }

    if (data.length == 4) {
      if (parseInt(data[3]) < 2) {
        data = data.substring(0, 3)
      }
    }

    setExpiryDate(data)
  }

  const formatCvvCode = (value) => {
    if (value.length == 0) {
      setCvvCode(value)
      return
    }

    if (parseNumber(value)) {
      setCvvCode(value)
    }
  }

  const validateInputs = () => {
    if (
      holderName.trim().length > 0 &&
      cardNumber.length == 19 &&
      cvvCode.length >= 3 &&
      expiryDate
    ) {
      return true
    }
    return false
  }
  const onBackPress = () => {
    navigation.goBack()
  }

  const onHideView = () => {
    setShowSuccessView(!showSuccessView)
    navigation.goBack()
  }
  const fadeIn = () => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
    setShowSuccessView(!showSuccessView)
  }

  const fadeOut = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => setShowSuccessView(false))
  }

  const renderSuccessView = () => {
    return (
      <Animated.View
        style={[
          styles.successContainer,
          {
            opacity: fadeAnimation,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={onHideView}>
          <View style={styles.successInner}>
            <Image style={styles.forgotRestImg} source={forgot_reset} />
            <Text
              style={styles.successTitle}
              largeTitle
              textAlign={'center'}
              color={black}
              condensedBold
            >
              Your new card has been{'\n'}added to your account.
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  }

  const renderContent = () => {
    const compStyles = [styles.maskedInput]
    if (isFocused) {
      compStyles.push({ borderColor: appColors.darkGrey })
    } else {
      compStyles.push({ borderColor: appColors.borderGrey })
    }

    var first_card_number = cardNumber.charAt(0);
    var card_image = '';
    if (first_card_number == 4 ) {
      card_image = visa_ic;
    } else if (first_card_number == 5 ) {
      card_image = master_card_ic;
    }

    return (
      <View style={styles.innerContainer}>
        <Input
          label={'Cardholder name'}
          onChangeText={(text) => setHolderName(text)}
          value={holderName}
        />
        <Input
          label={'Card number'}
          onChangeText={(text) => formatCardValue(text)}
          customStyles={{ container: styles.inputCustomStyles }}
          value={cardNumber}
          keyboardType={'phone-pad'}
          maxLength={19}
          imageSource={cardNumber.length == 19 ? card_image : false}
          iconStyle={styles.visaIcon}
        />



        <View style={styles.inputRow}>
          <TouchableOpacity disabled onPress={toggleDatepicker}>
            {/* <Input
              placeholder={''}
              label={'Expiration date'}
              customStyles={{ container: styles.smallInputCustomStyles }}
              onChangeText={(text) => inputToValue(text)}
              maxLength={5}
              value={formatFunction(expiryDate)}
              inputViewStyle={styles.inputViewStyle}
              keyboardType={'phone-pad'}
            /> */}
            <View style={styles.MaskedContainer}>
              <Text style={styles.label}>Expiration date</Text>

              <TextInputMask
                type={'custom'}
                options={{
                  mask: expiryDate.length == 5 ? '99 / 99' : '99/99',
                }}
                placeholder={'MM / YY'}
                label={'Expiration date'}
                style={compStyles}
                onChangeText={(text) => formatDateValue(text)}
                maxLength={7}
                value={expiryDate}
                onBlur={() => onBlur()}
                onFocus={() => onFocus()}
                keyboardType={'phone-pad'}
              />
            </View>
          </TouchableOpacity>

          <Input
            label={'CVV code'}
            onChangeText={(text) => formatCvvCode(text)}
            labelIcon={question_ic}
            value={cvvCode}
            keyboardType={'phone-pad'}
            maxLength={4}
            onLabelIconPress={() => {
              setShowModal(!showModal)
              setIsAnyPopupOpened(true)
            }}
            customStyles={{ container: styles.smallRightInputCustomStyles }}
          />
        </View>
      </View>
    )
  }

  const validation = validateInputs()
  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={() => Keyboard.dismiss()}
    >
      <View behavior={'padding'} style={styles.avodingView}>
        {showSuccessView && renderSuccessView()}
        <View style={styles.container}>
          <AccountHeader
            title={'Credit / debit card'}
            backArrow
            backPress={() => onBackPress()}
          />
          <View style={styles.subContainer}>
            <View style={styles.contentContainer}>
              <Text color={orderDarkGray} smallRegular style={styles.heading}>
                Add a new card {/* {Moment().unix()} */}
              </Text>
              <Text color={orderDarkGray} smallRegular style={styles.heading}>
                We accept Visa and Mastercard at this time.
                <Image style={[styles.smallCard]} source={visa_ic} />  
                <Image style={[styles.smallCard]} source={master_card_ic} />
              </Text>
              <View style={styles.body}>{renderContent()}</View>
            </View>

            <Button
              btnTitle={'Add new card'}
              onPress={() => onAddCard()}
              disabled={!validation}
              style={[
                styles.addBtn,
                { backgroundColor: validation ? black : buttonOpacity },
              ]}
            />
          </View>
        </View>
        {showModal && (
          <View style={styles.modalContain}>
            <PopupModal
              heading={'Where is my CVV code?'}
              content={PupupContent}
              showPrivacyModal={showModal}
              contentHeight={200}
              setShowPrivacyModal={() => {
                setShowModal(!showModal)
                setIsAnyPopupOpened(false)
              }}
            />
          </View>
        )}

        {showDatePicker && (
          <MonthPicker
            selectedDate={expiryDate || new Date()}
            onMonthChange={onChange}
            minDate={Moment().utcOffset(TIMEZONE)}
            containerStyle={styles.containerPickerStyle}
            maxDate={Moment().utcOffset(TIMEZONE).add(10, 'Y')}
            selectedMonthTextStyle={styles.selectedMonthTextStyle}
            swipable={true}
          />
          // <DateTimePicker
          //   display={'default'}
          //   testID="dateTimePicker"
          //   value={expiryDate ? expiryDate : new Date()}
          //   mode={'date'}
          //   onChange={onChange}
          //   display={IS_IOS ? 'spinner' : 'default'}
          //   minimumDate={new Date()}
          //   style={styles.datewPicker}
          //   customStyles={{
          //     btnConfirm: {
          //       paddingVertical: 0,
          //       borderWidth: 1,
          //       marginTop: 20,
          //     },
          //     btnCancel: {
          //       paddingVertical: 0,
          //       borderWidth: 1,
          //     },
          //   }}
          // />
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default AddCard
