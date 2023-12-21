import React, { useContext, useState, useCallback } from "react";
import {
  Image,
  View,
  Pressable,
} from "react-native";
import AppContext from "../../provider";
import { callUs, chatUs, emailUs } from "../../helpers/contact";
import { appColors, appImages } from "../../theme";
import { AccountHeader, Text, Input, Button } from "../../components"; // , LINELoginButton
import LINELoginButton from "../../components/LINELoginButton";
import styles from "./Styles";
import { ACCOUNT_TYPES } from "../../common/constants";
const { darkGray, darkGrey, lessDarkGray, white } = appColors;
import Services from '../../services'
const { API } = Services
import helpers from "../../helpers";
const { validateEmail } = helpers;
import LINE from '../../helpers/line';
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from '@react-navigation/native';
const { eye, full_eye } = appImages;

const LinkedAccount = (props) => {
  const { navigation, route } = props;
  const { loginData, setLoginData, setIsApiLoaderShowing } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const { accountInfo, token, user_id } = loginData;
  const { contact_id } = accountInfo;

  const accountType = route.params.type || ACCOUNT_TYPES.EMAIL;
  const dontFollowQA = route.params.dontFollowQA;

  const [hasFollowedLINEQA, setHasFollowedLINEQA] = useState(!dontFollowQA);

  const validateInputs = () => {
    let error = true;

    if (email || email.trim().length > 0) {
      if (!validateEmail(email)) {
        error = false;
        setErrorEmail(
          "Check again, you might have made a typo. eg:\nyou@paleo.com"
        );
      }
    } else {
      error = false;
      setErrorEmail("Missing email.");
    }

    if (!password || password.trim().length == 0) {
      error = false;
      setErrorPassword("Missing password.");
    }

    return error;
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const onCallUs = () => {
    callUs();
  }

  const onEmailUs = () => {
    emailUs();
  }

  const onChatNow = () => {
    chatUs();
  }

  const onLINELogin = async () => {
    try {
      var contact_id = loginData.accountInfo.contact_id.id;

      var ctx={
        contact_id: contact_id,
      };
      const data = await LINE.updateAcccountLINE_v2(ctx, () => {});

      if (data.message) {
        alert(data.message);
      } else {
        await getUserData();
        Alert.alert('', `Success! Your LINE accout is now linked. You will receive delivery notifications by LINE so please don't mute us! ðŸ™‚`);
      }

    } catch(ex) {
      console.log(ex);
    }
  }

  const onLinkEmail = () => {
    if (validateInputs()) {

      var vals = {
        email: email.toLowerCase(),
        password: password,
      };

      const response = API.execute(
        "ecom2.interface",
        "update_email_and_password",
        [vals],
        {},
        setIsApiLoaderShowing,
        {token: token, user_id: user_id}
      ).then( async (data) => {
        await getUserData();
      })
      .catch((err) => {
        alert(err);
      });

    }
  }

  useFocusEffect(
    useCallback(() => {
      async function checkLINEFriendshipStatus() {
        if (contact_id && contact_id.line_user_id) {
          const friendshipStatus = await LINE.hasFollowedLINEQA();
          setHasFollowedLINEQA(friendshipStatus);
        }
      }
      checkLINEFriendshipStatus();
    }, [])
  );

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

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const clearErrors = () => {
    setErrorEmail("");
    setErrorPassword("");
  };

  const onFollowQA = () => {
    LINE.openFollowLINEQA();
  }

  const renderAccountInformation = () => {
    return accountType === ACCOUNT_TYPES.EMAIL ? (
      <>
        <Text color={darkGray} lineHeight={20}>
          Your current linked email is: {"\n \n"}
          {contact_id.email || 'None'} {"\n"}
        </Text>
        <View style={styles.horizontalLine}></View>
        {contact_id.email ? (
          <Text color={darkGray} lineHeight={20}>
            {"\n"}
            To change your email address, please contact us via live chat, email
            or call us.
          </Text>
        ) : (
          <View style={{marginTop: 20, marginHorizontal: -10, padding: 10, backgroundColor: white}}>
            <Input
              label={"Link an email:"}
              placeholder={"Email address"}
              value={email}
              onChangeText={(text) => {
                clearErrors();
                setEmail(text.replace(/\s/g, ""));
              }}
            />
            {errorEmail.length > 0 && <Text color={darkGrey}>{errorEmail}</Text>}
            <Input
              label={"New Paleo Robbie password"}
              value={password}
              onChangeText={(text) => {
                clearErrors();
                setPassword(text);
              }}
              // placeholder={'Enter your password'}
              secureTextEntry={!showPassword}
              password
              imageSource={!showPassword ? eye : full_eye}
              onPressIcon={toggleShowPassword}
              customStyles={{
                container: {
                  marginTop: 20,
                },
              }}
            />
            {errorPassword.length > 0 && (
              <Text color={darkGrey}>{errorPassword}</Text>
            )}
            <Button btnTitle={"Link your email"} onPress={onLinkEmail} />
          </View>
        )}
      </>
    ) : (
      <>
        <Text color={darkGray} lineHeight={20}>
          Your current linked LINE account is: {"\n \n"}
          {contact_id.title || contact_id.line_user_id || 'None'} {"\n"}
        </Text>
        <View style={styles.horizontalLine}></View>
        {hasFollowedLINEQA && (
          <Text color={darkGray} lineHeight={20}>
            {"\n"}Users with a linked LINE account will receive order receipts, delivery notifications, and back-in-stock messages through LINE.
          </Text>
        )}
        {!contact_id.line_user_id ? (
          <>
            <Text>{"\n \n"}To add/change your linked LINE account, please press the button below:</Text>
            <View style={{paddingVertical: 16, alignSelf: 'flex-start'}}>
              <LINELoginButton onPress={onLINELogin}></LINELoginButton>
            </View>
          </>
        ) : (
          <>
            {!hasFollowedLINEQA && (
              <View style={styles.warningsContainer}>
                <Image style={styles.iconInfo} source={appImages.iconInfo} resizeMode={"contain"} />
                <View style={{flex: 1}}>
                  <View>
                    <Text>
                      <Text condensedBold>Important:</Text>
                      {" You have linked a LINE account but you are not following us on our LINE Official Account: @paleorobbie"}
                    </Text>
                    <Text style={{marginTop: 12}}>
                      In order to receive your delivery notifications, order confirmation & receipts, and back-in-stock notifications, you will need to add our LINE account as a friend. You can do so here:
                    </Text>
                  </View>
                  <Pressable style={styles.buttonFollowQA} onPress={onFollowQA}>
                    <Image style={styles.imageFollowQA} source={appImages.buttonFolowLINEQA} resizeMode={"contain"} />
                  </Pressable>
                </View>
              </View>
            )}
            <Text color={darkGray} lineHeight={20}>
              {"\n"}
              <Text bold>
                Changing or removing LINE accounts:{" "}
              </Text>
              If you need to change your linked LINE account to another one, or remove LINE from your account with us, you will need to <Text style={{textDecorationLine: 'underline'}}>link an email address</Text> to your Paleo Robbie account first.
              {"\n\n"}
              Once you have a linked email, please contact us to assist you with the LINE account change.
            </Text>
          </>
        )}
      </>
    )
  }

  const renderContent = () => {
    return (
      <ScrollView style={styles.innerContainer}>
        {renderAccountInformation()}
        {(accountType === ACCOUNT_TYPES.EMAIL && contact_id.email || accountType === ACCOUNT_TYPES.LINE && contact_id.line_user_id) && (
          <View style={styles.optionsRow}>
            <Pressable
              style={styles.ImgContainer}
              onPress={() => {
                onChatNow();
              }}
            >
              <Image source={appImages.chat_ic} style={styles.chatImg} />
              <Text extSmall color={lessDarkGray}>
                Chat now
              </Text>
            </Pressable>
            <Pressable style={styles.borderdImgContainer} onPress={onEmailUs}>
              <Image source={appImages.email_ic} style={styles.emailImg}/>
              <Text extSmall color={lessDarkGray}>
                Email us
              </Text>
            </Pressable>
            <Pressable style={styles.ImgContainer} onPress={onCallUs}>
              <Image source={appImages.phone_ic} style={styles.callImg} />
              <Text extSmall color={lessDarkGray}>
                Call us
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <AccountHeader
        title={accountType === ACCOUNT_TYPES.EMAIL ? "Linked email address" : "Linked LINE account"}
        backArrow
        backPress={() => onBackPress()}
      />

      <View style={styles.body}>{renderContent()}</View>
    </View>
  );
};

export default LinkedAccount;
