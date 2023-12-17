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
import moment from "moment-timezone";
import styles from "./Styles2";
import { appColors, appImages } from "../../theme";

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
  const [hearFromText, setHearFromText] = useState("");
  const [genderIndex, setGenderIndex] = useState();
  const [fromIndex, setFromIndex] = useState();
  const [buyForIndex, setBuyForIndex] = useState();
  const [dob, setDOB] = useState();

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
          <DatePickerIOS date={dob} onDateChange={(date) => setDOB(date)} />
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
            selected={buyForIndex === index}
            onPress={() => {
              setBuyForIndex(index);
            }}
          ></AnswerButton>
        ))}
      </View>

      <Button
        onPress={() => alert("submit")}
        disabled={!validation}
        btnTitle="Submit"
        style={[styles.submitBtn]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <MarketHeader searchEnabled={false} condensedTitle={`Order SO-108267`} />
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
                  <Text
                    underlined
                    onPress={() => alert("here")}
                  >
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
