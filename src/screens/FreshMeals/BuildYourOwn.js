import React, { useState, useContext } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native'
import TimeSlot from '../PickupTimeSlot'
import { createDaysArray } from "../PickupTimeSlot";
import styles from './BuildYourOwnStyles'
import { appColors, appImages } from '../../theme'
import helpers from '../../helpers'
const { getDefaultDateForFreshMeals } = helpers
import { Text } from '../../components/'
const { darkGray, black, lessDarkGray, darkGrey } = appColors
import AppContext from '../../provider'
const { red_calander_ic, byo_plate, byo_salad } = appImages

const dataList = [
  {
    image: byo_plate,
    title: 'Salad',
    minDescription: 'Pick a base salad mix,\nthen add what you like.',
    quality: 'Nitro Black Coffee',
    exVAT: 'ex VAT',
    exVATPrice: false,
    itemLeft: '',
    price: '฿199',

    notAvailable: false,
    bestSeller: 'KETO',
    notify: false,
  },

  {
    title: 'Plate',
    minDescription: 'Pick a protein & add up\nto 2 sides for free.',
    quality: 'Peachy Sparkling Tea',
    exVAT: 'ex VAT',
    price: '฿299',
    image: byo_salad,
    exVATPrice: false,

    isQuantityPicked: 1,

    bestSeller: 'KETO',
    redBestSeller: 'LOCAL',
    notify: false,
  },
]

const BuildYourOwn = (props) => {
  const { navigation, timeSlotForDelivery, showChangeAddress, setSelectedFreshMealsTime } = props
  const [showModalTime, setShowModalTime] = useState(false)

  const { pretty_date, tomorrow } = getDefaultDateForFreshMeals();
  const [ordersDataArray, setOrdersDataArray] = useState(dataList)

  const renderTextContent = (obj, index) => {
    return (
      <View style={styles.rightContainer}>
        <View style={styles.headingRow}>
          <Text condensedBold largeRegularPlus color={lessDarkGray}>
            {obj.title}
          </Text>
          <View style={styles.fromContainer}>
            <Text condensed extSmall color={lessDarkGray}>
              From
            </Text>
            <Text condensedBold color={black}>
              {obj.price}
            </Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <Text
            numberOfLines={2}
            color={darkGray}
            style={styles.descriptionText}
          >
            {obj.minDescription}
          </Text>
        </View>
      </View>
    )
  }
  const renderListItem = (obj, index) => {
    return (
      <View style={styles.mainCell}>
        <TouchableOpacity
          onPress={() => {
            if (showChangeAddress == true) {
              alert("Your default address is out of our Delivery Area. Please add another address in order to access the Build Your Own section.");
            } else {
              if (index == 0) {
                navigation.navigate('BuildYourOwnSalad')
              }
              if (index == 1) {
                navigation.navigate('BuildYourOwnPlate')
              }
            }
          }}
        >
          <View key={index} style={[styles.cell, {}]}>
            <View style={styles.ImgContainer}>
              <ImageBackground
                source={obj.image}
                style={styles.cellImg}
              ></ImageBackground>
            </View>
            {renderTextContent(obj, index)}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const onSelectTime = (obj) => {
    global.freshMealsTimeSlotNew = obj;
    setSelectedFreshMealsTime(global.freshMealsTimeSlotNew);
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.whiteContainer}>
          <View style={styles.topRed}>
            <Text color={darkGrey}>Delivery: {timeSlotForDelivery}</Text>
            <TouchableOpacity
              style={styles.changeRow}
              onPress={() => {
                setShowModalTime(true)
                //  setIsAnyPopupOpened(true)
              }}
            >
              <Text bold color={darkGrey}>
                Change
              </Text>
              <Image source={red_calander_ic} style={styles.calenderImg} />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={ordersDataArray}
          style={styles.listStyle}
          renderItem={({ item, index }) => renderListItem(item, index)}
        />
      </View>

      <TimeSlot
        // freshMeals={true}
        heading={'Choose delivery slot'}
        showModal={showModalTime}
        setSelectTimeSlot={(obj) => onSelectTime(obj)}
        timeSlots={createDaysArray()}
        setShowPrivacyModal={() => {
          setShowModalTime(false)
        }}
        selectedSection={'fresh_meals'}
      />
    </View>
  )
}

export default BuildYourOwn
