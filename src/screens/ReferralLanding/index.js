import { React, useContext, useCallback } from 'react';
import { View, Keyboard, ImageBackground, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { appImages, appColors } from '../../theme';
import { Text, Button } from '../../components';
import AppContext from "../../provider";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  bgImg: {
    width: "100%",
    height: "100%",
    backgroundColor: appColors.black,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    width: "95%",
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
    backgroundColor: appColors.white,
    paddingTop: 21,
    paddingBottom: 17,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  textCenter: {
    textAlign: 'center'
  },
  textBody: {
    paddingLeft: 31,
    paddingRight: 27,
    paddingTop: 25,
    paddingBottom: 27
  }
})

const ReferralLanding = (props) => {
  
  const { navigation, route } = props;
  
  const {
    setRefId,
    refId,
    setRefVoucher,
    refVoucher
  } = useContext(AppContext);
  
  useFocusEffect(useCallback(() => {
    async function setStorageRefId(refferalId) {
      // alert(refferalId);
      await AsyncStorage.setItem('referralId', refferalId);
      // var testing = await AsyncStorage.getItem('referralId');
      // alert(testing);
      await AsyncStorage.setItem('refVoucher', refferalId);
      // var testing = await AsyncStorage.getItem('referralId');
    }
    if (route.params) {
      if (route.params.refId) {
        setStorageRefId(route.params.refId)
        setRefId(route.params.refId);
        setRefVoucher(route.params.refId);
      }
    }
    return () => {
    }
  }, []));
  
  const onCreateAccount = () => {
    props.navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Auth',
          params: {
            screen: 'signUp'
          }
        }
      ]
    });
  }

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => Keyboard.dismiss()}
    >
      <ImageBackground source={appImages.postcode_bg} style={styles.bgImg}>
        <View style={styles.body}>
          <Text lineHeight={25} largeRegularPlus color={appColors.black} condensedBold style={styles.textCenter}>
            Welcome to Paleo Robbie!
          </Text>
          <Text regular color={appColors.black} style={[styles.textCenter, styles.textBody]}>
            {
              `We’re so happy you’re here.\n\n` +
              `Once you have created your account, simply start shopping and your ฿500 voucher will be applied automatically at checkout.\n\n` +
              `Please note that there is a minimum spend of ฿1,500 (before discount) to redeem this voucher.\n\n` +
              `Once you make your first order, your friend will receive their ฿500 credit too!\n\n` +
              `Feel free to contact us with any questions. Welcome to the tribe!`
            }
          </Text>
          <Button
            btnTitle={"Create account"}
            onPress={() => {
              onCreateAccount();
            }}
          />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  )
}

export default ReferralLanding;