import React, { useState, useContext } from 'react'
import { TouchableOpacity, Image, View, ScrollView } from 'react-native'
import AppContext from '../../provider'
import { appColors, appImages } from '../../theme'
const {
  accountSettingGray,
  green,
  textDarkGray,
  lightGreen,
  lightBlue,
  lightRed,
  bounceRed,
  bounceBlue,
} = appColors
import { Button, AccountHeader, Text, PopupModal } from '../../components/'
import styles from './Styles'
const {
  savage_man_img,
  warrior_man_img,
  chieftain_man_img,
  tick_ic,
  question_ic,
} = appImages
import helpers from "../../helpers";
const {
  number_format,
} = helpers;

const myAccountDataArray = [
  {
    heading: 'PALEO SAVAGE',
    text1: 'Super fast checkout by store credit',
    text2: 'Bragging rights',
    credit: 7500,
    img: savage_man_img,
    imgStyle: {
      width: 51,
      height: 57,
      resizeMode: 'contain',
      marginTop: -14,
      marginLeft: 12,
    },
    lightColor: lightGreen,
    darkColor: green,
    bounce: false,
    info: false,
  },
  {
    heading: 'PALEO WARRIOR',
    text1: '2% bonus credit',
    text2: 'Our most popular package',
    credit: 17500,
    img: warrior_man_img,
    imgStyle: {
      width: 49,
      height: 75,
      resizeMode: 'contain',
      marginTop: -32,
      marginLeft: 12,
    },
    lightColor: lightBlue,
    darkColor: bounceBlue,
    bounce: '+ 2% bonus (฿350)',
    info: false,
  },
  {
    heading: 'PALEO CHIEFTAIN',
    text1: '2.1% bonus credit',
    text2: 'Cash refundable',
    credit: 47500,
    img: chieftain_man_img,
    imgStyle: {
      width: 60,
      height: 64,
      resizeMode: 'contain',
      marginTop: -25,
      marginLeft: 12,
    },
    lightColor: lightRed,
    darkColor: bounceRed,
    bounce: '+ 2.1% bonus (฿1,000)',
    info: true,
  },
]

const PopupContent =
  'For the Chieftain package only, your credit is refundable to cash within 5 working days (except any bonus credit that was given) for up to 3 years.\n \nAll in-store credit credit expires after 3 years. We do not give cash refunds for unused in-store credit to Savage or Warrior members, but credit can be transferred to another customer for a small admin fee.'

const StoreCreditPackages = (props) => {
  const { navigation, route } = props
  const { flow } = route.params

  const [showModal, setShowModal] = useState(false)
  const { setIsAnyPopupOpened } = useContext(AppContext)
  const onBackPress = () => {
    navigation.goBack()
  }

  const renderCellHeader = (obj) => {
    return (
      <View style={[styles.cellHeaderRow, { backgroundColor: obj.lightColor }]}>
        <View style={styles.leftHeader}>
          <Image source={obj.img} style={obj.imgStyle} />
        </View>
        <View style={styles.rightHeader}>
          <View style={styles.headingRow}>
            <Text color={obj.darkColor} bold style={styles.heading}>
              {obj.heading}
            </Text>
            {obj.bounce && (
              <View style={styles.bounce}>
                <Text small color={obj.darkColor}>
                  {obj.bounce}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  const renderCellButton = (obj) => {
    return (
      <View style={styles.buttonRow}>
        <View style={styles.crediSection}>
          <Text color={textDarkGray} small bold>
            STORE CREDIT
          </Text>
          <Text color={accountSettingGray} largeRegularPlus condensedBold>
            ฿{number_format(obj.credit, "0,0")}
          </Text>
        </View>
        <Button
          onPress={() => {
            navigation.navigate('PaymentMethods', { flow:flow , credit: obj.credit })
          }}
          style={styles.btn}
          small
          btnTitle={'Add credit'}
          textStyle={styles.text}
        />
      </View>
    )
  }
  const renderCreditHistory = () => {
    return (
      <View style={styles.orderSection}>
        <View style={styles.myDetailsList}>
          {myAccountDataArray.map((obj, i) => {
            return (
              <View
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth:
                      myAccountDataArray.length == i + 1 ? 0 : 1,
                    marginTop: i == 0 ? 15 : 0,
                  },
                ]}
                key={i}
              >
                {renderCellHeader(obj)}
                <View style={styles.cellInnerRow}>
                  <View style={styles.leftHeader} />

                  <View style={styles.rightHeader}>
                    <View style={styles.textRowUpper}>
                      <Image source={tick_ic} style={styles.tick} />
                      <Text
                        smallRegular
                        color={accountSettingGray}
                        style={styles.margin}
                      >
                        {obj.text1}
                      </Text>
                    </View>
                    <View style={styles.textRow}>
                      <Image source={tick_ic} style={styles.tick} />
                      <Text
                        smallRegular
                        color={accountSettingGray}
                        style={styles.margin}
                      >
                        {obj.text2}
                      </Text>
                      {obj.info && (
                        <TouchableOpacity
                          onPress={() => {
                            setShowModal(true)
                            setIsAnyPopupOpened(true)
                          }}
                        >
                          <Image source={question_ic} style={styles.info} />
                        </TouchableOpacity>
                      )}
                    </View>
                    {renderCellButton(obj)}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
  
  console.log('flow',flow);
  
  return (
    <View style={styles.container}>
      <AccountHeader
        title={'Store credit packages'}
        backArrow
        backPress={() => onBackPress()}
      />
      <View style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderCreditHistory()}
        </ScrollView>
        {showModal && (
          <View style={styles.modalContain}>
            <PopupModal
              heading={'Cash refundable'}
              subHeading="What does “cash refundable” for the Chieftain package mean?"
              content={PopupContent}
              showPrivacyModal={showModal}
              contentHeight={360}
              setShowPrivacyModal={() => {
                setShowModal(!showModal)
                setIsAnyPopupOpened(false)
              }}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default StoreCreditPackages
