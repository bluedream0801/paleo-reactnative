import React, { useState } from 'react'
import { Image, ScrollView, View, TouchableOpacity, Switch } from 'react-native'
import styles from './Styles'
import { appColors, appImages } from '../../theme'
import { AccountHeader, Text } from '../../components/'
const { accountSettingGray, orderDarkGray } = appColors
const { right_arrow } = appImages

const Faq = (props) => {
  //states
  const { navigation, route } = props
  const { dataArray, title } = route.params
  const [faqsDataArray, updateFaqsArray] = useState(dataArray)

  const ordering = faqsDataArray.filter((x) => x.subgroup == 'Ordering')
  const payment = faqsDataArray.filter((x) => x.subgroup == 'Payment')
  const mealPreparation = faqsDataArray.filter(
    (x) => x.subgroup == 'Meal preparation',
  )
  const others = faqsDataArray.filter((x) => x.subgroup == 'Other')
  const delivery = faqsDataArray.filter((x) => x.subgroup == 'Delivery')
  const general = faqsDataArray.filter((x) => x.subgroup == null)
  const onBackPress = () => {
    navigation.goBack()
  }
  const onPressFaq = (index) => {
    const array = Object.assign([], faqsDataArray)
    for (let i = 0; i < faqsDataArray.length; i++) {
      if (index == i)
        faqsDataArray[index].isSelected = !faqsDataArray[index].isSelected
    }
    updateFaqsArray(array)
  }

  const renderAnswer = (ans) => {
    return (
      <View style={styles.ansContainer}>
        <Text color={accountSettingGray} extSmall textAlign="left">
          {ans}
        </Text>
      </View>
    )
  }

  const renderOrderingSection = () => {
    return (
      <View style={styles.orderSection}>
        <Text color={orderDarkGray} smallRegular style={styles.text}>
          Ordering
        </Text>
        <View style={styles.myDetailsList}>
          {faqsDataArray.map((obj, i) => {
            if (obj.subgroup !== 'Ordering') {
              return null
            }
            return (
              <TouchableOpacity
                onPress={() => onPressFaq(i)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth: faqsDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <View style={styles.faqCellInner}>
                  <Text
                    smallRegular
                    numberOfLines={2}
                    color={accountSettingGray}
                    style={{ flex: 1 }}
                    bold={obj.isSelected ? true : false}
                  >
                    {obj.question}
                  </Text>
                  <Image
                    style={[
                      styles.arrow,
                      {
                        transform: [
                          { rotate: obj.isSelected ? '90deg' : '0deg' },
                        ],
                      },
                    ]}
                    source={right_arrow}
                  />
                </View>
                {obj.isSelected && renderAnswer(obj.answer)}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderPaymentSection = () => {
    return (
      <View style={styles.orderSection}>
        <Text color={orderDarkGray} smallRegular style={styles.text}>
          Payment
        </Text>
        <View style={styles.myDetailsList}>
          {faqsDataArray.map((obj, i) => {
            if (obj.subgroup !== 'Payment') {
              return null
            }

            return (
              <TouchableOpacity
                onPress={() => onPressFaq(i)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth: faqsDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <View style={styles.faqCellInner}>
                  <Text
                    smallRegular
                    numberOfLines={2}
                    color={accountSettingGray}
                    style={{ flex: 1 }}
                    bold={obj.isSelected ? true : false}
                  >
                    {obj.question}
                  </Text>
                  <Image
                    style={[
                      styles.arrow,
                      {
                        transform: [
                          { rotate: obj.isSelected ? '90deg' : '0deg' },
                        ],
                      },
                    ]}
                    source={right_arrow}
                  />
                </View>
                {obj.isSelected && renderAnswer(obj.answer)}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderMealPreparationSection = () => {
    return (
      <View style={styles.orderSection}>
        <Text color={orderDarkGray} smallRegular style={styles.text}>
          Meal Preparation
        </Text>
        <View style={styles.myDetailsList}>
          {faqsDataArray.map((obj, i) => {
            if (obj.subgroup !== 'Meal preparation') {
              return null
            }
            return (
              <TouchableOpacity
                onPress={() => onPressFaq(i)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth: faqsDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <View style={styles.faqCellInner}>
                  <Text
                    smallRegular
                    numberOfLines={2}
                    color={accountSettingGray}
                    style={{ flex: 1 }}
                    bold={obj.isSelected ? true : false}
                  >
                    {obj.question}
                  </Text>
                  <Image
                    style={[
                      styles.arrow,
                      {
                        transform: [
                          { rotate: obj.isSelected ? '90deg' : '0deg' },
                        ],
                      },
                    ]}
                    source={right_arrow}
                  />
                </View>
                {obj.isSelected && renderAnswer(obj.answer)}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderOtherSection = () => {
    return (
      <View style={styles.orderSection}>
        <Text color={orderDarkGray} smallRegular style={styles.text}>
          Other
        </Text>
        <View style={styles.myDetailsList}>
          {faqsDataArray.map((obj, i) => {
            if (obj.subgroup !== 'Other') {
              return null
            }
            return (
              <TouchableOpacity
                onPress={() => onPressFaq(i)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth: faqsDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <View style={styles.faqCellInner}>
                  <Text
                    smallRegular
                    numberOfLines={2}
                    color={accountSettingGray}
                    style={{ flex: 1 }}
                    bold={obj.isSelected ? true : false}
                  >
                    {obj.question}
                  </Text>
                  <Image
                    style={[
                      styles.arrow,
                      {
                        transform: [
                          { rotate: obj.isSelected ? '90deg' : '0deg' },
                        ],
                      },
                    ]}
                    source={right_arrow}
                  />
                </View>
                {obj.isSelected && renderAnswer(obj.answer)}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderDeliverySection = () => {
    return (
      <View style={styles.orderSection}>
        <Text color={orderDarkGray} smallRegular style={styles.text}>
          Delivery
        </Text>
        <View style={styles.myDetailsList}>
          {faqsDataArray.map((obj, i) => {
            if (obj.subgroup !== 'Delivery') {
              return null
            }
            return (
              <TouchableOpacity
                onPress={() => onPressFaq(i)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth: faqsDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <View style={styles.faqCellInner}>
                  <Text
                    smallRegular
                    numberOfLines={2}
                    color={accountSettingGray}
                    style={{ flex: 1 }}
                    bold={obj.isSelected ? true : false}
                  >
                    {obj.question}
                  </Text>
                  <Image
                    style={[
                      styles.arrow,
                      {
                        transform: [
                          { rotate: obj.isSelected ? '90deg' : '0deg' },
                        ],
                      },
                    ]}
                    source={right_arrow}
                  />
                </View>
                {obj.isSelected && renderAnswer(obj.answer)}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderGeneralSection = () => {
    return (
      <View style={styles.orderSection}>
        <Text color={orderDarkGray} smallRegular style={styles.text}>
          General Questions
        </Text>
        <View style={styles.myDetailsList}>
          {faqsDataArray.map((obj, i) => {
            if (obj.subgroup !== null) {
              return null
            }
            return (
              <TouchableOpacity
                onPress={() => onPressFaq(i)}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth: faqsDataArray.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <View style={styles.faqCellInner}>
                  <Text
                    smallRegular
                    numberOfLines={2}
                    color={accountSettingGray}
                    style={{ flex: 1 }}
                    bold={obj.isSelected ? true : false}
                  >
                    {obj.question}
                  </Text>
                  <Image
                    style={[
                      styles.arrow,
                      {
                        transform: [
                          { rotate: obj.isSelected ? '90deg' : '0deg' },
                        ],
                      },
                    ]}
                    source={right_arrow}
                  />
                </View>
                {obj.isSelected && renderAnswer(obj.answer)}
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AccountHeader
        title={'FAQ - ' + title}
        backArrow
        backPress={() => onBackPress()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {ordering.length > 0 && renderOrderingSection()}
        {payment.length > 0 && renderPaymentSection()}
        {mealPreparation.length > 0 && renderMealPreparationSection()}
        {others.length > 0 && renderOtherSection()}
        {delivery.length > 0 && renderDeliverySection()}
        {general.length > 0 && renderGeneralSection()}
      </ScrollView>
    </View>
  )
}

export default Faq
