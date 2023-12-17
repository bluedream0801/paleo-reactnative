import React, { useState, useEffect, useContext } from 'react'
import {
  Keyboard,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  View,
  Linking,
  Pressable,
} from 'react-native'
import AppContext from '../../provider'
import Services from '../../services'
const { API } = Services
import { appColors, appImages } from '../../theme'
const { lessDarkGray, orderDarkGray } = appColors
import { AccountHeader, Text } from '../../components/'
import styles from './Styles'
import { callUs, chatUs, emailUs } from '../../helpers/contact'
const { prepaid_ic, care_ic, large_cart_ic, meals_ic } = appImages
const HelpCenter = (props) => {
  const { navigation } = props
  const [questions, setQuestions] = useState([])

  const { setIsApiLoaderShowing } = useContext(AppContext)

  const onBackPress = () => {
    navigation.goBack()
  }

  const onChatNow = () => {
    chatUs();
  }

  const onEmailUs = () => {
    emailUs();
  }

  const onCallUs = () => {
    callUs();
  }

  useEffect(() => {
    getHelpData()
  }, [])

  const getHelpData = async () => {
    var cond = []
    var fields = ['question', 'answer', 'group', 'subgroup']
    var qa = await API.execute(
      'cms.faq',
      'search_read',
      [cond, fields],
      { order: 'sequence' },
      setIsApiLoaderShowing,
    )

    // Main Categories and Subcategories

    const mealsArray = []
    const groceryArray = []
    const prepaidPackagesArray = []
    const groceryDeliveryOutsideBangkokArray = []
    for (let index = 0; index < qa.length; index++) {
      if (qa[index].group == 'Grocery') {
        groceryArray.push({
          ...qa[index],
          isSelected: false,
        })
      }
      if (qa[index].group == 'Meals') {
        mealsArray.push({
          ...qa[index],
          isSelected: false,
        })
      }

      if (qa[index].group == 'Grocery delivery outside Bangkok') {
        groceryDeliveryOutsideBangkokArray.push({
          ...qa[index],
          isSelected: false,
        })
      }
      if (qa[index].group == 'Prepaid packages') {
        prepaidPackagesArray.push({
          ...qa[index],
          isSelected: false,
        })
      }
    }

    setQuestions([
      groceryArray,
      mealsArray,
      groceryDeliveryOutsideBangkokArray,
      prepaidPackagesArray,
    ])

    return {
      qa: qa,
      error: 'none',
    }
  }

  const renderContent = () => {
    return (
      <View style={styles.innerContainer}>
        <Text color={orderDarkGray} smallRegular>
          Contact us
        </Text>
        <View style={styles.optionsRow}>
          <Pressable
            style={styles.ImgContainer}
            onPress={onChatNow}
          >
            <Image source={appImages.chat_ic} style={styles.chatImg} />
            <Text extSmall color={lessDarkGray}>
              Chat now
            </Text>
          </Pressable>
          <View style={styles.vline}></View>
          <Pressable style={styles.borderImgContainer} onPress={onEmailUs}>
            <Image source={appImages.email_ic} style={styles.emailImg} />
            <Text extSmall color={lessDarkGray}>
              Email us
            </Text>
            <Text tiny color={lessDarkGray}>
              cx@paleorobbie.com
            </Text>
          </Pressable>
          <View style={styles.vline}></View>
          <Pressable style={styles.ImgContainer} onPress={onCallUs}>
            <Image source={appImages.phone_ic} style={styles.callImg} />
            <Text extSmall color={lessDarkGray}>
              Call us
            </Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const renderQuestionContent = () => {
    return (
      <View style={styles.innerBottomContainer}>
        <Text color={orderDarkGray} smallRegular>
          Frequently asked questions
        </Text>

        <View style={styles.bottomOptionsContainer}>
          <View style={styles.bottomOptionsRow}>
            <TouchableOpacity
              style={styles.centerImg}
              onPress={() => {
                navigation.navigate('Faq', {
                  dataArray: questions[0],
                  title: 'Grocery',
                })
              }}
            >
              <View style={styles.bottomImgContainer}>
                <Image source={large_cart_ic} style={styles.cartImg} />
              </View>
              <Text smallRegular color={lessDarkGray} textAlign={'center'}>
                Grocery
              </Text>
            </TouchableOpacity>
            <View style={styles.vertical} />
            <TouchableOpacity
              style={styles.centerImg}
              onPress={() => {
                navigation.navigate('Faq', {
                  dataArray: questions[1],
                  title: 'Meals',
                })
              }}
            >
              <View style={styles.bottomImgContainer}>
                <Image source={meals_ic} style={styles.mealsImg} />
              </View>
              <Text smallRegular color={lessDarkGray} textAlign={'center'}>
                Meals
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.horizontal} />
          <View style={[styles.bottomOptionsRow, { paddingBottom: 10 }]}>
            <TouchableOpacity
              style={styles.centerTuckImg}
              onPress={() => {
                navigation.navigate('Faq', {
                  dataArray: questions[2],
                  title: 'Delivery outside Bangkok',
                })
              }}
            >
              <View style={[styles.bottomImgContainer, styles.smallMargin]}>
                <Image
                  source={care_ic}
                  style={[styles.carImg, styles.smallMargin]}
                />
              </View>
              <Text smallRegular color={lessDarkGray} textAlign={'center'}>
                Grocery delivery{'\n'} outside Bangkok
              </Text>
            </TouchableOpacity>
            <View style={styles.vertical} />
            <TouchableOpacity
              style={styles.centerImg}
              onPress={() => {
                navigation.navigate('Faq', {
                  dataArray: questions[3],
                  title: 'Prepaid packages',
                })
              }}
            >
              <View style={styles.bottomImgContainer}>
                <Image source={prepaid_ic} style={styles.prepaidImg} />
              </View>
              <Text smallRegular color={lessDarkGray} textAlign={'center'}>
                Prepaid packages
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
          title={'Help center'}
          backArrow
          backPress={() => onBackPress()}
        />
        <View style={styles.body}>
          {renderContent()}
          {renderQuestionContent()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default HelpCenter
