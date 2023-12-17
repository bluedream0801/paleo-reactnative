import React, { useState, useCallback, useContext } from 'react'
import {
  View,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import styles from './Styles'
import { useFocusEffect } from '@react-navigation/native'
import Services from '../../services'
const { API } = Services

import { AccountHeader, Text } from '../../components/'
import { appFonts, appColors, appImages } from '../../theme'
import helpers from "../../helpers";

const { accountSettingGray, orderDarkGray } = appColors
const {
  right_arrow,
  master_card_ic,
  visa_ic,
  delete_ic,
  card_shape_ic,
  express_ic,
} = appImages

const {
  formatCreditCardNumber,
} = helpers;

import AppContext from '../../provider'

const cardDataArry = [
  {
    titleText: '5577 55 ** **** 2912',
    smallText: 'Mastercard',
    image: master_card_ic,
  },
  {
    titleText: '5577 55 ** **** 3941',
    smallText: 'Visa',
    image: visa_ic,
  },
]

const SavedCards = (props) => {
  const { navigation } = props

  const {setIsAnyApiLoading,
   loginData} = useContext(AppContext)

  const [cardDetails, setCardsDetails] = useState(null)

  const { accountInfo, token, user_id } = loginData

  useFocusEffect(
    useCallback(() => {

      API.execute("contact","read_path",[
          [accountInfo.contact_id.id],
          [
            "card_tokens.mask_card",
            "card_tokens.exp_month",
            "card_tokens.exp_year"
          ]
        ],
        {},
        setIsAnyApiLoading,
        {token, user_id}
        ).then(data=>{
          console.log("data cards", data);
          setCardsDetails(data[0]);
      })

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const onBackPress = () => {
    navigation.goBack()
  }

  const onDeleteCard = async (card_id) => {
    // alert('Deleting'+ card_id);
    await API.execute("card.token", "delete_card_token", [[card_id]], {}, setIsAnyApiLoading,{token, user_id}).then(data=>{
      console.log('deleting card data', data);
      API.execute("contact","read_path",[
          [accountInfo.contact_id.id],
          [
            "card_tokens.mask_card",
            "card_tokens.exp_month",
            "card_tokens.exp_year"
          ]
        ],
        {},
        setIsAnyApiLoading,
        {token, user_id}
        ).then(data=>{
          console.log("data cards", data);
          setCardsDetails(data[0]);
      })
    }).catch(err=>{
      alert("Error: "+err.message);
    });
  }

  const showConfirmDialog = (card_id) => {
    return Alert.alert(
      "Are you sure?",
      "Are you sure you want to delete this card?",
      [
        {
          text: "Yes",
          onPress: () => {
            onDeleteCard(card_id)
          },
        },
        {
          text: "No",
        },
      ]
    );
  };


  const onPressNewCard = () => {
    navigation.navigate('AddCard')
  }

  const renderCard = (obj, i) => {

    var first_card_number = obj.mask_card.charAt(0);
    var card_type = '';
    var card_image = '';
    if (first_card_number == 4 ) {
      card_type = 'Visa';
      card_image = visa_ic;
    } else if (first_card_number == 5 ) {
      card_type = 'Mastercard';
      card_image = master_card_ic;
    }

    return (
      <View
        style={[
          styles.cardCell,
          {
            borderBottomWidth: cardDataArry.length == i + 1 ? 0 : 1,
          },
        ]}
        key={i}
      >
        <View style={styles.smallRow}>
          <Image style={[styles.card]} source={card_image} />
          <View>
            <Text bold small color={accountSettingGray}>
              {formatCreditCardNumber(obj.mask_card)}
            </Text>
            <Text tiny color={accountSettingGray} style={styles.textMargin}>
              {card_type}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            showConfirmDialog(obj.id);
          }}
        >
          <Image style={[styles.delete]} source={delete_ic}/>
        </TouchableOpacity>
      </View>
    )
  }

  const renderNewCardSection = () => {
    return (
      <View style={styles.newCard}>
        <Text smallRegular color={orderDarkGray} style={styles.smallHeading}>
          Add new card
        </Text>

        <TouchableOpacity
          style={[styles.cardCell]}
          onPress={() => onPressNewCard()}
        >
          <View style={styles.smallRow}>
            <Image style={[styles.smalpeCard]} source={card_shape_ic} />
            <View>
              <Text bold small color={accountSettingGray}>
                Credit / debit card
              </Text>
              <Text tiny color={accountSettingGray} style={styles.textMargin}>
                Tap to add card details
              </Text>
            </View>
          </View>
          <View style={styles.smallRow}>
            <View style={styles.cardsRow}>
              <Image style={[styles.smallCard]} source={visa_ic} />
              <Image style={[styles.smallCard]} source={master_card_ic} />
            </View>
            <Image style={[styles.arrow]} source={right_arrow} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  const renderCardList = () => {
    return (
      <View style={styles.cardList}>
        <ScrollView>
          <Text smallRegular color={orderDarkGray} style={styles.smallHeading}>
            Select payment method
          </Text>
          {(cardDetails !== null) &&
            <>
              {cardDetails.card_tokens.map((item, index) => renderCard(item, index))}
            </>
          }
          {renderNewCardSection()}
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AccountHeader
        title={'Saved credit / debit cards'}
        backArrow
        backPress={() => onBackPress()}
      />
      {renderCardList()}
    </View>
  )
}

export default SavedCards
