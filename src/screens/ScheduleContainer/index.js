import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native'
import {
  Button,
  AccountHeader,
  Input,
  Text,
  PopupModal,
} from '../../components/'
import moment from 'moment'
import styles from './Styles'
import TimeSlot from '../PickupTimeSlot'
import Services from '../../services'

const { API } = Services
import SelectAddress from '../SelectAddress'
import { appColors, appImages, appMetrics } from '../../theme'
import AppContext from '../../provider'
const { right_arrow } = appImages
const { IS_IOS } = appMetrics
const {
  orderDarkGray,
  black,
  darkGrey,
  darkGray,
  accountSettingGray,
  buttonOpacity,
} = appColors

import * as momenttz from 'moment-timezone';

const ScheduleContainer = (props) => {
  const { navigation } = props
  const { setIsAnyPopupOpened, setIsApiLoaderShowing, loginData, cartData } = useContext(
    AppContext,
  )
  const [showModal, setShowModal] = useState(false)
  const [showSuccessView, setShowSuccessView] = useState(false)
  const [selectTimeSlot, setSelectTimeSlot] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [comments, setComments] = useState(false)
  const [addressArray, setAddressArray] = useState(false)
  const [orderID, setOrderID] = useState('')
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [timeSlots, setTimeSlots] = useState(null)



  const { token, user_id } = loginData
  const onBackPress = () => {
    navigation.goBack()
  }

  useEffect(() => {
    load_addresses()
  }, [])

  const load_addresses = () => {
    API.execute(
      'ecom2.cart',
      'plr_get_pickup_addresses',
      [],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id },
    )
      .then((res) => {
        console.log('address', res)
        const data = []
        for (let index = 0; index < res.length; index++) {
          data.push({
            ...res[index],
            address: res[index].name,
            postal_code: '',
          })
        }
        setAddressArray(data)

        load_slots()
      })
      .catch((err) => {
        alert(err)
      })
  }

  const load_slots = () => {
    API.execute(
      'ecom2.cart',
      'plr_get_pickup_slots',
      [],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id },
    )
      .then((res) => {
        console.log('slots', res)
        const data = []
        
        var today = moment(momenttz.tz('Asia/Bangkok').format("YYYY-MM-DD")).format('D, MMM');
        
        for (let index = 0; index < res.length; index++) {
          const slotsData = []
          for (let i = 0; i < res[index].slots.length; i++) {
            slotsData.push({
              ...res[index].slots[i],
              isSelected: false,
            })
          }
          const dateFormate = 'DD,ddd,dddd,MM,MMMM,ddd,Do'
          const timeDay = moment(res[index].date)
            .format(dateFormate)
            .toString()
            .split(',')
            
          var week_day = moment(res[index].date).format("dddd")
          var date_week_day = moment(res[index].date).format('D, MMM');
          
          if ((week_day == 'Friday' || week_day == 'Saturday') && (today!=date_week_day)) {
            data.push({
              ...res[index],
              isSelected: false,
              slots: slotsData,
              shortDate: timeDay[6],
              shortDay: timeDay[1],
              day: timeDay[2],
              combineDate: timeDay[4] + ' ' + timeDay[0],
              completeDate: moment(res[index].date).format('YYYY-MM-DD'),
            })
          }
        }
        setTimeSlots(data)
      })
      .catch((err) => {
        alert(err)
      })
  }

  const onRequestSent = () => {
    console.log('selectTimeSlot',selectTimeSlot)
    var vals = {
      address_id: selectedAddress.id,
      date: selectTimeSlot.completeDate,
      slot_id: selectTimeSlot.slotId,
      comment: comments,
    }
    
    console.log('Request',vals);
    
    API.execute(
      'ecom2.cart',
      'plr_request_pickup',
      [vals],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id },
    )
      .then((res) => {
        setOrderID(res.order_id)
        setShowSuccessView(!showSuccessView)
      })
      .catch((err) => {
        alert(err)
      })
  }

  const renderButtonContent = () => {
    return (
      <View>
        <Text color={orderDarkGray} smallRegular style={styles.heading}>
          How many containers do you want to return? Please leave the details below.
        </Text>
        <View style={styles.whiteContainer}>
          <View style={styles.greyContainer}>
            <Input
              value={comments}
              onChangeText={(text) => {
                setComments(text)
              }}
              multiline
              placeholder={
                'E.g. 3 tupperware containers will be left in building lobby'
              }
              inputStyle={styles.inputStyle}
              customStyles={{
                container: styles.customStyles,
              }}
              inputViewStyle={styles.inputViewStyle}
            />
          </View>
        </View>

        <Text smallRegular color={orderDarkGray} style={styles.heading}>
          Pickup time slot
        </Text>
        <View style={styles.selectDayContainer}>
          <TouchableOpacity
            style={[styles.myAccountCell]}
            onPress={() => {
              setShowModal(!showModal)
              //  setIsAnyPopupOpened(true)
            }}
          >
            {selectTimeSlot ? (
              <Text color={accountSettingGray} regular>
                {selectTimeSlot.day + ', ' + selectTimeSlot.time}
              </Text>
            ) : (
              <Text color={darkGrey} regular>
                Select day and time
              </Text>
            )}
            <Image style={styles.arrow} source={right_arrow} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderPickup = () => {
    return (
      <View style={styles.pickupContainer}>
        <Text smallRegular color={orderDarkGray} style={styles.pickupText}>
          Pickup address
        </Text>
        <View style={styles.myDetailsList}>
          <TouchableOpacity
            style={[styles.myAccountCell]}
            onPress={() => {
              setShowAddressModal(true)
            }}
          >
            {selectedAddress ? (
              <Text regular color={accountSettingGray}>
                {selectedAddress.address}
              </Text>
            ) : (
              <Text regular color={darkGrey}>
                Select address
              </Text>
            )}

            <Image style={styles.arrow} source={right_arrow} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const validateInputs = () => {
    let validate = false
    if (selectedAddress && selectTimeSlot) {
      validate = true
    }

    return validate
  }
  const validation = validateInputs()
  const renderContent = () => {
    return (
      <View style={styles.contentMargin}>
        <View style={styles.innerOfferContainer}>
          <Text color={darkGray} lineHeight={20}>
            Help us reduce single-use plastic! We can take your plastic Meals
            containers back on your next delivery, or, we also offer free
            scheduled pickups on Fridays and Saturdays.{'\n'} {'\n'}
            Please schedule your free pickup below:
          </Text>
        </View>
        {renderPickup()}
        {renderButtonContent()}
        <Button
          btnTitle={'Request pickup'}
          style={[
            styles.requestBtn,
            { backgroundColor: validation ? black : buttonOpacity },
          ]}
          onPress={() => onRequestSent()}
          disabled={!validation}
        />
      </View>
    )
  }

  const renderSuccessView = () => {
    return (
      <View style={styles.successContainer}>
        <Image style={styles.forgotRestImg} source={appImages.forgot_reset} />
        <Text
          style={styles.successTitle}
          largeRegularPlus
          textAlign={'center'}
          color={black}
          bold
        >
          Pickup successfully scheduled
        </Text>
        <View style={styles.line} />
        <View style={styles.containerRow}>
          <View style={styles.minContainer}>
            <Text small bold color={orderDarkGray}>
              PICKUP ADDRESS
            </Text>
            <Text color={accountSettingGray} lineHeight={20}>
              {selectedAddress.address}
            </Text>
          </View>
          <View style={styles.minLeftContainer}>
            <Text small bold color={orderDarkGray}>
              PICKUP TIME
            </Text>
            <View style={styles.minWidh}>
              <Text color={accountSettingGray} lineHeight={20}>
                {selectTimeSlot.day},
              </Text>
              <Text color={accountSettingGray} lineHeight={20}>
                {selectTimeSlot.time}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bottmSuccess}>
          <Text small bold color={orderDarkGray}>
            CONTAINERS TO RETURN
          </Text>
          <Text color={accountSettingGray} lineHeight={20}>
            {comments}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
    {console.log("addressArray---",addressArray)}
      <AccountHeader
        title={'Schedule container pickup'}
        backArrow
        backPress={() => onBackPress()}
      />
      {showSuccessView && renderSuccessView()}
      {!showSuccessView && (
        <View style={{ flex: 1 }}>
          <ScrollView>
            <KeyboardAvoidingView
              behavior={IS_IOS ? 'position' : 'padding'}
              style={styles.avodingView}
              keyboardVerticalOffset={IS_IOS ? 20 : 0}
            >
              <View style={styles.body}>{renderContent()}</View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      )}
      {showModal && (
        <TimeSlot
          timeSlots={timeSlots}
          heading={'Select time slot'}
          showModal={showModal}
          setSelectTimeSlot={(obj) => setSelectTimeSlot(obj)}
          setShowPrivacyModal={() => {
            setShowModal(false)
            // setTimeout(() => {
            //    setIsAnyPopupOpened(false)
            // }, 250)
          }}
        />
      )}
      <SelectAddress
        navigation={navigation}
        flow={'container'}
        deliveryDate={null}
        cartData={cartData}
        cartType={'container'}
        addressArray={addressArray}
        heading={'Select address'}
        showAddressModal={showAddressModal}
        setSelectedAddress={(obj) => setSelectedAddress(obj)}
        setShowAddressModal={() => {
          setShowAddressModal(false)

          // setTimeout(() => {
          //   setShowAddressModalConatiner(false)
          //    setIsAnyPopupOpened(false)
          // }, 250)
        }}
      />
    </View>
  )
}

export default ScheduleContainer
