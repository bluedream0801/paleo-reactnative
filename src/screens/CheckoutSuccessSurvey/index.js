import React, { useState, useContext, useEffect, useCallback } from "react";

import {
  View,
  Image,
  DatePickerIOS,
  DatePickerAndroid,
  FlatList,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native'
import moment from "moment-timezone";
import styles from "./Styles2";
import { appColors, appImages } from "../../theme";
import AppContext from '../../provider'
import Services from '../../services'
const { API } = Services

import {
  MarketHeader,
  Text,
  Button,
  Input,
  AccountHeader,
} from "../../components/";

const { black, surveyPlaceholder } = appColors;

const { logoSurvey, success_ic } = appImages;

const GENDER_LIST = ["Male", "Female"];
const FROM_LIST = ["Thailand 🇹🇭", "Not Thailand 🌎"];
const BUY_LIST = ["Primarily yourself", "Yourself + a partner", "Your family"];

const AnswerButton = ({ onPress, width, title, selected }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.answerBtn,
        { width: width },
        selected ? styles.selectedBtn : "",
      ]}
    >
      <View style={[styles.mark, selected ? styles.selectedMark : ""]} />
      <Text
        style={[styles.answerBtnText, selected ? styles.selectedBtnText : ""]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const Survey = (props) => {
  
  const { navigation, route} = props;
  const { sale_id } = route.params;
  
  const [hearFromText, setHearFromText] = useState("");
  const [genderIndex, setGenderIndex] = useState();
  const [fromIndex, setFromIndex] = useState();
  const [buyForIndex, setBuyForIndex] = useState();
  const [dob, setDOB] = useState(new Date());
  
  const {
    setIsAnyApiLoading,
    loginData,
    setLoginData
  } = useContext(AppContext)
  
  const { accountInfo, token, user_id } = loginData;
  
  const [orderDetails, setOrderDetails] = useState(null)
  
  useFocusEffect(
    useCallback(() => {
      
      console.log('CURRENT SALE ID', route.params, sale_id, accountInfo.contact_id.plr_survey1_completed, accountInfo.contact_id.plr_survey1_denied);
      
      var order_id = sale_id
      var data, error = null
      
      if ((accountInfo.contact_id.plr_survey1_completed == null || accountInfo.contact_id.plr_survey1_completed == false) && (accountInfo.contact_id.plr_survey1_denied == null || accountInfo.contact_id.plr_survey1_denied == false)) {
        var vals = {
          plr_survey1_start: moment(),
        }
        API.execute("contact","write", [[accountInfo.contact_id.id],vals],{}, () => {},{token, user_id}).then(() => {
          getUserData()
        }).catch((err) => {
          console.log('err',err)
          alert(err)
        });
      }
      
      var shown = accountInfo.contact_id.plr_survey1_first_screen_shown;
      if (shown == null || shown == false ) {
        shown = 0;
      }
      var vals = {
        plr_survey1_first_screen_shown: shown,
      }
      
      API.execute("contact","write", [[accountInfo.contact_id.id],vals],{}, () => {},{token, user_id}).then(() => {
        getUserData()
      }).catch((err) => {
        console.log('err',err)
        alert(err)
      });
      
      // Ask to do it directly in netforce
      API.execute("sale.order","read_path",[
            [order_id],
            [
              "number",
            ]
          ],
          {},
          setIsAnyApiLoading,
          {token, user_id}
          ).then(data=>{
            console.log("data payment", data);
            setOrderDetails(data[0]);
      })
      
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [sale_id])
  );

  const validation =
    hearFromText &&
    dob &&
    genderIndex !== undefined &&
    fromIndex !== undefined &&
    buyForIndex !== undefined;

  const onDOBPress = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: dob ? dob : new Date(),
        mode: "spinner",
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        setDOB(new Date(year, month, day));
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };
  
  const SubmitSurvey = async () => {

    // setIsPaymentProcessing(true);
    var selected_gender = genderIndex;
    if (selected_gender == 'Male') {
      selected_gender = 'm';
    } else {
      selected_gender = 'f';
    }
    
    var selected_customer_source = fromIndex;
    if (selected_customer_source == 'Thailand 🇹🇭') {
      selected_customer_source = 'thai';
    } else {
      selected_customer_source = 'foreign';
    }
    
    var selected_reason = buyForIndex;
    if (selected_reason == 'Primarily yourself') {
      selected_reason = 'you';
    } else if (selected_reason == 'Your family') {
      selected_reason = 'family';
    } else {
      selected_reason = 'couple';
    }
    
    var selected_birth_date = moment(dob).format("YYYY-MM-DD");
    
    var vals = {
      plr_survey1_how_hear: hearFromText,
      birth_date: selected_birth_date, // var new_date = moment(this.state.birth_date_year + '-'+this.state.birth_date_month + '-'+e.target.value).format("YYYY-MM-DD")
      plr_reason_grocery: selected_reason, // you / couple / family
      customer_source: selected_customer_source, // thai - foreign 
      gender: selected_gender // m / f
    }
    
    await API.execute("contact","write", [[accountInfo.contact_id.id],vals],{}, () => {},{token, user_id}).then(async () => {
    }).catch((err) => {
      console.log('err',err)
      alert(err)
    });
    
    console.log('selected vals',vals);
    
    // plr_survey1_second_screen_shown
    // plr_survey1_denied
    // plr_survey1_completed
    // user_first_name: data.contact_id.first_name
    
    await API.execute("contact","complete_survey1", [[accountInfo.contact_id.id],true],{}, () => {},{token, user_id}).then(async () => {
      await getUserData()
      navigation.navigate('CheckoutSuccessThanks', { sale_id: sale_id })
    }).catch((err) => {
      console.log('err',err)
      alert(err)
    });
   
    
     /*
    */

  }
  
  const getUserData = async () => {
    await API.user_load({ user_id: user_id }, () => {})
      .then((response) => {
        let previousData = Object.assign({}, loginData)
        setLoginData({ ...previousData, accountInfo: response[0] })
      })
      .catch((err) => {
        alert(err)
      })
  }

  const renderSurvey = () => (
    <View style={styles.surveyContainer}>
      <View style={styles.surveyBody}>
        <Image style={styles.surveyImg} source={logoSurvey} />

        <Text
          smallTitle
          textAlign={"center"}
          condensedBold
          style={styles.surveyTitle}
        >
          Get ฿100 off your next order automatically!
        </Text>
      </View>
      <Text regular>
        Take one minute to help us get to know you better, and we’ll add a B100
        credit to your account for your next order 💰
      </Text>
      <Text largeRegular condensedBold style={styles.surveyQuestion}>
        1) How did you hear about us?
      </Text>
      <TextInput
        style={[styles.hearFromInput]}
        placeholder="E.g. my friend told me, social media ads, etc."
        placeholderTextColor={surveyPlaceholder}
        onChangeText={(text) => setHearFromText(text)}
        value={hearFromText}
        multiline={true}
        numberOfLines={3}
      />
      <Text largeRegular condensedBold style={styles.surveyQuestion}>
        2) You are:
      </Text>
      <View style={styles.answerContainer}>
        {GENDER_LIST.map((gender, index) => (
          <AnswerButton
            title={gender}
            width={80}
            key={index}
            selected={genderIndex === index}
            onPress={() => {
              setGenderIndex(index);
            }}
          ></AnswerButton>
        ))}
      </View>
      <Text largeRegular condensedBold style={styles.surveyQuestion}>
        3) You’re from:
      </Text>
      <View style={styles.answerContainer}>
        {FROM_LIST.map((from, index) => (
          <AnswerButton
            title={from}
            width={126}
            key={index}
            selected={fromIndex === index}
            onPress={() => {
              setFromIndex(index);
            }}
          ></AnswerButton>
        ))}
      </View>
      <Text largeRegular condensedBold style={styles.surveyQuestion}>
        4) When is your birthday?
      </Text>
      {Platform.OS === "ios" && (
        <View style={styles.dobContainer}>
          <DatePickerIOS mode="date" date={dob} onDateChange={(date) => setDOB(date)} />
        </View>
      )}
      {Platform.OS === "android" && (
        <Pressable onPress={onDOBPress} style={[styles.dobContainer]}>
          <Text>{dob ? moment(dob).format("YYYY-MM-DD") : "XXXX-XX-XX"}</Text>
        </Pressable>
      )}
      <Text largeRegular condensedBold style={styles.surveyQuestion}>
        5) You’re buying primarily for:
      </Text>
      <View style={styles.answerContainer}>
        {BUY_LIST.map((buy, index) => (
          <AnswerButton
            title={buy}
            width={161}
            key={index}
            selected={buyForIndex === index}
            onPress={() => {
              setBuyForIndex(index);
            }}
          ></AnswerButton>
        ))}
      </View>
      
      {/* onPress={() => alert("submit" + dob.toDateString())} */}
      <Button
        onPress={() => {
                SubmitSurvey();
              }}
        disabled={!validation}
        btnTitle="Submit"
        style={[styles.submitBtn]}
      />
    </View>
  );
  
  var page_title = '';
  if (orderDetails) {
    page_title = 'Order ' + orderDetails.number;
  }

  return (
    <View style={styles.container}>
      <MarketHeader searchEnabled={false} condensedTitle={page_title} />
      <View style={styles.body}>
        <ScrollView>
          <View style={styles.successContainer}>
            <View style={styles.successBody}>
              <Image style={styles.successIC} source={success_ic} />
              <View style={styles.textBody}>
                <Text largeTitlePlus color={black} condensedBold>
                  Success!
                </Text>
                <Text
                  style={styles.successTitle}
                  largeRegularBetween
                  color={black}
                  condensedBold
                >
                  We received your payment and your order confirmation is{" "}
                  <Text underlined onPress={() => navigation.navigate('CheckoutSuccess', {sale_id: sale_id}) }>
                    here
                  </Text>
                  .
                </Text>
              </View>
            </View>
            <View style={styles.line} />

            {renderSurvey()}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Survey;
