import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  Keyboard,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native'
import moment from "moment";
import { appColors, appImages } from '../../theme'
const {
  darkGray,
  lessDarkGray,
  orderDarkGray,
  accountSettingGray,
  tabTextGrey,
} = appColors
import Services from '../../services'
const { API } = Services
import { Button, AccountHeader, Text } from '../../components/'
import AppContext from '../../provider'
import styles from './Styles'
const { prepaid_ic, care_ic, large_cart_ic, meals_ic } = appImages

import helpers from "../../helpers";
// Clear whatever is not used from the helpers
const {
  number_format,
} = helpers;

// { order: 'Order 129371239', price: '฿12,000', credit: '- ฿3,000' },
//   { order: 'Warrior Package', price: '฿15,000', credit: '+ ฿15,000' },

const myAccountDataArray = []
const PaleoWallet = (props) => {
  const { navigation } = props

  const { loginData, setIsApiLoaderShowing, setIsAnyApiLoading, setLoginData} = useContext(
    AppContext,
  )

  const { accountInfo, token, user_id } = loginData
  const { receivable_credit } = accountInfo.contact_id;

  const [walletHistory, setWalletHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {

      var contact_id = accountInfo.contact_id.id;
      var data,error = null
      var account_id = 2247; //727;

      API.execute("account.move.line","search_read_path",[
            [
              [
              "contact_id", "=", contact_id
              ],
              [
              "account_id", "=", account_id
              ],
              [
              "move_id.state", "=", "posted"
              ]
            ],
            [
              "move_id.date",
              "move_id.number",
              "debit",
              "credit",
              "description",
              "move_id.create_time"
            ]
          ],
          {order: "move_id.date DESC,id"},
          setIsAnyApiLoading,
          {token, user_id}
          ).then(data=>{
            console.log("Paleo Wallet History", data);
            setWalletHistory(data);
      })

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );


  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        // Added for checking if the users receivable credit has changed
        if (loginData) {
          var users_receivabile_credit = await getUsersReceivableCredit();
          if (users_receivabile_credit && users_receivabile_credit[0]) {
            console.log('Credits comparison',users_receivabile_credit[0].contact_id.receivable_credit,receivable_credit)
            if (users_receivabile_credit[0].contact_id.receivable_credit != receivable_credit) {
              await getUserData();
            } else {
              console.log('User credit has not changed');
            }
          }
        }

      }
      fetchData();
    }, [])
  );

  const getUsersReceivableCredit = async () => {
    if (loginData) {
      var res = await API.execute(
        "base.user",
        "read_path",
        [
          [
            user_id,
          ],
          [
            "contact_id.receivable_credit",
          ],
        ],
        {},
        setIsApiLoaderShowing,
        { token, user_id }
      );
      if (res.length >0) {
        console.log('Receivable Credit',res);
        return res;
      }
    } else {
      console.log('Not logged in. No Receivable Credit check.')
    }
  };

  const getUserData = () => {
    API.user_load({ user_id: user_id }, () => {})
      .then((response) => {
        let previousData = Object.assign({}, loginData)
        setLoginData({ ...previousData, accountInfo: response[0] })
      })
      .catch((err) => {
        alert(err)
      })
  }

  const onBackPress = () => {
    navigation.goBack()
  }

  const onAddCredit = () => {
    navigation.navigate('StoreCreditPackages',{ flow: 'AddCredit'})
  }

  const renderCurrentBalance = () => {
    return (
      <View style={styles.balanceSection}>
        <Text color={orderDarkGray} smallRegular style={styles.balanceText}>
          Current balance
        </Text>

        <View style={[styles.currentBlanceCell]}>
          <Text color={accountSettingGray} largeRegularPlus condensedBold>
            ฿{receivable_credit ? receivable_credit : 0}
          </Text>
          <Button
            onPress={() => onAddCredit()}
            style={styles.btn}
            small
            btnTitle={'Add credit'}
            textStyle={styles.text}
          />
        </View>
      </View>
    )
  }

  var balance = 0;

  const price = (amount) => {
    const isPositive = amount >= 0;

    return `${(isPositive ? '+' : '-')} ฿${number_format(Math.abs(amount),"0,0")}`
  };

  const renderCreditHistory = () => {
    return (
      <View style={styles.orderSection}>
        <View style={styles.orderSubSections}>
          <Text color={orderDarkGray} smallRegular>
            Paleo Credit history
          </Text>
        </View>
        <View style={styles.myDetailsList}>
          {walletHistory.map((obj, i) => {

            var amount = obj.credit - obj.debit;
            balance += amount;

            return (
              <View
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth:
                      walletHistory.length == i + 1 ? 0 : 1,
                  },
                ]}
                key={i}
              >
                <View style={{flex: 1}}>
                  <Text color={accountSettingGray} bold style={styles.margin}>
                    {moment(obj.move_id.date).format("MMMM Do, YYYY")}
                  </Text>

                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Text color={accountSettingGray} regular style={{maxWidth: 200}} noOfLines={1}>
                    {obj.description}{' '}
                    </Text>
                    <Text color={accountSettingGray} smallRegular>
                      {' '}
                      |{' '}
                    </Text>
                    <Text color={accountSettingGray} condensed smallRegular>
                      {' '}
                      {price(amount,"0,0")}
                    </Text>
                  </View>
                </View>

                <Text color={tabTextGrey} condensed style={styles.price}>
                  ฿{number_format(balance,"0,0")}
                </Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <AccountHeader
        title={'Paleo Wallet'}
        backArrow
        backPress={() => onBackPress()}
      />
      <View style={styles.body}>
        <Text color={darkGray}>
          Below is your Paleo Credit history, including store credit purchases,
          bonus credit, and refunds.
        </Text>
        <ScrollView>
          {renderCurrentBalance()}
          {renderCreditHistory()}
        </ScrollView>
      </View>
    </View>
  )
}

export default PaleoWallet
