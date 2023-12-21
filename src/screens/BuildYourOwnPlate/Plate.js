import React, { useState, createRef, useRef, useCallback } from 'react'
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { appImages, appColors, appMetrics } from '../../theme'
import SectionList from 'react-native-tabs-section-list'
const {
  black,
  darkGray,
  accountSettingGray,
  addressGrey,
  headerBgColor,
  orderDarkGray,
  white,
} = appColors
const {} = appImages

const {} = appMetrics
import { Text } from '../../components/'
import styles from './PlateStyles'

const Plate = (props) => {
  const {
    addItemInlList,
    saladArray,
  } = props
  const flatlistRef = useRef()

  const getLastIndex = () => {
    const array = saladArray
    for (let index = array.length - 1; index < array.length; index--) {
      if (array[index].data.length > 0) {
        return index
      }
    }
  }
  //console.log('saladArray--', saladArray)

  const getDressingItemsCount = () => {
    const isDressing = false
    for (let index = 0; index < saladArray[2].data.length; index++) {
      if (saladArray[2].data[index].QuantityAdded && saladArray[2].data[index].QuantityAdded > 0) {
        return false
      }
    }
    return true
  }

  const getAddOnsItemsCount = () => {
    let count = 0
    for (let index = 0; index < saladArray[3].data.length; index++) {
      if (saladArray[3].data[index].QuantityAdded) {
        count = count + saladArray[3].data[index].QuantityAdded
      }
    }
    console.log('count--', count)
    if (count > 1) {
      return true
    } else false
  }

  useFocusEffect(useCallback(() => {}, []))

  const getQuantityLabel = (item) => {
    if (item.section !== 'protein') {
      return item.QuantityAdded + ' added.';
    } else if (item.QuantityAdded == 1 ) {
      return item.QuantityAdded + ' added. Click to add another.';
    } else {
      return 'Double portion added';
    }
  }

  const rendrItem = (item, index, obj, sectionIndex, count_sides) => {

    return (
      <TouchableOpacity
        onPress={() => {
          addItemInlList(
            { ...item, cellWidth: obj.cellWidth },
            index,
            sectionIndex,
          )
        }}
        style={[
          styles.mixCell,
          {
            marginLeft: index % obj.numColumns !== 0 ? 10 : 0,
            width: obj.cellWidth,
            height: obj.height,
            marginBottom: item.marginBottom ? 30 : 0,
            marginTop:
              (sectionIndex == 0 && index + 1 > obj.numColumns) ||
              (sectionIndex == 1 && index + 1 > obj.numColumns) ||
              (sectionIndex == 2 && index + 1 > obj.numColumns) ||
              (sectionIndex == 3 && index + 1 > obj.numColumns)
                ? 10
                : 0,
          },
        ]}
      >
        <ImageBackground
          style={[
            styles.mixImg,
            { height: obj.imgHeight, width: obj.cellWidth },
          ]}
          source={item.image}
        >
          {item.QuantityAdded && item.QuantityAdded > 0 ? (
            <View style={styles.addedQuantity}>
              <Text minSmall condensedBold color={white}>
                {getQuantityLabel(item)}
              </Text>
            </View>
          ) : null}
        </ImageBackground>
        <View style={styles.texContainer}>
          <Text
            small
            textAlign={'center'}
            color={accountSettingGray}
            lineHeight={14}
            style={styles.cellText}
            noOfLines={3}
          >
            {item.heading}
          </Text>
          {((item.price ==0) || (count_sides<2 && sectionIndex == 2)) ?
            (
              <></>
            )
            :
            (
              <Text
                condensedBold
                lineHeight={17.18}
                style={styles.price}
                color={black}
              >
                ฿{item.price}
              </Text>
            )
          }
        </View>
      </TouchableOpacity>
    )
  }

  const renderList = () => {

    let currentSaladArray = Object.assign([], saladArray)

    var count_proteins = 0;
    var count_sauces = 0;
    var count_sides = 0;
    var count_addons = 0;

    for (j=0;j<4;j++) {
      for (k=0;k<currentSaladArray[j].data.length;k++) {
        if (currentSaladArray[j].data[k]['QuantityAdded'] > 0) {

          if (currentSaladArray[j].data[k]['section'] == 'protein') {
            count_proteins +=currentSaladArray[j].data[k]['QuantityAdded'];
          }

          if (currentSaladArray[j].data[k]['section'] == 'sauce') {
            count_sauces +=currentSaladArray[j].data[k]['QuantityAdded'];
          }

          if (currentSaladArray[j].data[k]['section'] == 'side') {
            count_sides +=currentSaladArray[j].data[k]['QuantityAdded'];
          }

          if (currentSaladArray[j].data[k]['section'] == 'addon') {
            count_addons +=currentSaladArray[j].data[k]['QuantityAdded'];
          }

        }
      }
    }

    var display_count_proteins = ' ('+ count_proteins +'/1)';
    var display_count_sauces = ' ('+ count_sauces +'/1)';
    var display_count_sides = ' ('+ count_sides +'/2)';
    var display_count_addons = ' ('+ count_addons +'/2)';


    return (
      <SectionList
        sections={saladArray}
        keyExtractor={(item) => item.key}
        stickySectionHeadersEnabled={false}
        scrollToLocationOffset={50}
        tabBarStyle={{
          backgroundColor: white,
          justifyContent: 'flex-end',
          height: 45,
          paddingTop: 15,
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderTab={(obj) => {
          // console.log('obj==', obj)
          const { title, isActive } = obj
          return (
            <View
              style={[
                styles.tabContainer,
                {
                  borderBottomWidth: isActive ? 3 : 0,
                  borderBottomColor: headerBgColor,
                  marginHorizontal: 10,
                  marginLeft: obj.index == 0 ? 10 : 20,
                },
              ]}
            >
              <Text
                lineHeight={21}
                regular
                style={[
                  styles.tabText,
                  { color: isActive ? headerBgColor : accountSettingGray },
                ]}
              >
                {title}
              </Text>
            </View>
          )
        }}
        renderSectionHeader={(sectionObj) => {
          const { section } = sectionObj
          const { smallTitle, index, title } = section
          //   console.log('section--', sectionObj)
          return (
            <View>
              {section.data.length > 0 && (
                <View
                  style={[
                    styles.headingRow,
                    { marginTop: index == 0 ? 14 : 24 },
                  ]}
                >
                  <Text
                    smallRegular
                    color={orderDarkGray}
                    style={[styles.greyHeading]}
                    lineHeight={18.53}
                  >
                    {title}
                    {(index == 0) &&
                      <>{display_count_proteins}</>
                    }
                    {(index == 1) &&
                      <>{display_count_sauces}</>
                    }
                    {(index == 2) &&
                      <>{display_count_sides}</>
                    }
                    {(index == 3) &&
                      <>{display_count_addons}</>
                    }
                  </Text>
                  {smallTitle &&
                    <Text color={orderDarkGray} tiny>
                      {smallTitle}
                    </Text>
                  }
                </View>
              )}
            </View>
          )
        }}
        renderItem={(innerObj) => {
          const { section } = innerObj
          const i = innerObj.index
          const { numColumns } = section
          // console.log('innerObj', innerObj)
          if (i > 0) {
            return null
          }
          return (
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => section.title+'_'+index.toString()}
              data={section.data}
              style={styles.flatlList}
              numColumns={numColumns}
              renderItem={({ item, index }) =>
                rendrItem(item, index, section, section.index, count_sides)
              }
            />
          )
        }}
      />
    )
  }

  return <View style={styles.container}>{renderList()}</View>
}

export default Plate
