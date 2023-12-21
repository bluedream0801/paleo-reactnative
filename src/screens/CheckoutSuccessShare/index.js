import React, { useState, useContext, useEffect, useCallback } from "react";

import { View, Image, ScrollView, Pressable, Linking } from "react-native";
import styles from "./Styles2";
import { appColors, appImages } from "../../theme";

import { useFocusEffect } from '@react-navigation/native'
import AppContext from '../../provider'
import Services from '../../services'
const { API } = Services

import { MarketHeader, Text, Button } from "../../components/";

const { black } = appColors;

const {
  logoThanks,
  success_ic,
  logoAppstore,
  logoFacebook,
  logoGoogle,
  goto_ic,
} = appImages;

const SHARE_LIST = [
  {
    id: "google",
    image: logoGoogle,
    title: "Go to Google",
    fontSize: 17,
    url: "https://www.google.com/search?q=paleo+robbie+thailand+location&sxsrf=ALeKk010z82FE4RfKGazsFgIsGWcLb1luA%3A1618235385441&ei=-U90YMnIGpCxrgTF3KrIBg&oq=paleo+robbie+thailand+location&gs_lcp=Cgdnd3Mtd2l6EAMyBQghEKABOgcIABBHELADOgcIABCwAxBDOgYIIxAnEBM6BAgjECc6BAgAEEM6CAgAELEDEIMBOggILhCxAxCDAToICAAQxwEQrwE6BQgAELEDOgsIABCxAxDHARCjAjoCCAA6BQguELEDOgsIABCxAxCDARDJAzoFCAAQywE6AgguOggIABDJAxDLAToGCAAQDRAeOgYIABAWEB46BwghEAoQoAE6CAgAEBYQHhATOgQIIRAVUNM1WJBeYJ1gaANwAngAgAGNAogB7iCSAQYyLjI5LjKYAQCgAQGqAQdnd3Mtd2l6yAEKwAEB&sclient=gws-wiz&ved=0ahUKEwiJqb_K7PjvAhWQmIsKHUWuCmkQ4dUDCAw&uact=5#lrd=0x30e29e51f39c29e7:0x4886f5ac886e7ce0,1,,,"
  },
  {
    id: "facebook",
    image: logoFacebook,
    title: "Go to Facebook",
    fontSize: 17,
    url: "https://www.facebook.com/PaleoRobbie/",
  },
  {
    id: "appstore",
    image: logoAppstore,
    title: "Go to App / Play Store",
    fontSize: 13,
    url: "https://apps.apple.com/th/app/paleo-robbie/id1597443504"
  },
];

const ShareButton = ({ onPress, fontSize, title, icon }) => {
  return (
    <Pressable onPress={onPress} style={[styles.shareBtn]}>
      <Image style={styles.shareBtnImage} source={icon} />
      <View style={styles.shareBtnTextContainer}>
        <Text
          style={[styles.shareBtnText, { fontSize: fontSize }]}
          condensedBold
        >
          {title}
        </Text>
        <Image style={styles.shareBtnGotoIcon} source={goto_ic} />
      </View>
    </Pressable>
  );
};

const Share = (props) => {
  
  const { navigation, route} = props;
  const { sale_id } = route.params;
  
  const onShareClick = (appId, appUrl) => {
    Linking.openURL(appUrl);
    // alert("Clicked " + appId);
  };
  
  const {
    setIsAnyApiLoading,
    loginData,
    setLoginData
  } = useContext(AppContext)
  
  const { accountInfo, token, user_id } = loginData;
  
  const [orderDetails, setOrderDetails] = useState(null);
  
  useFocusEffect(
    useCallback(() => {
      
      console.log('CURRENT SALE ID', route.params, sale_id);
      
      var order_id = sale_id
      var data, error = null
      
      var vals = {
        plr_survey1_second_screen_shown: true,
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
  

  const renderShare = () => (
    <View style={styles.surveyContainer}>
      <View style={styles.surveyBody}>
        <Image style={styles.shareImg} source={logoThanks} />

        <Text smallTitle condensedBold style={styles.surveyTitle}>
          Help us out and earn ฿100 per review!
        </Text>
      </View>
      <Text smallRegular>
        Like what we do? Help us grow by leaving a review! We’ll credit you ฿100
        for each one - simply screenshot the posted review and send it to us by
        LINE or email to get your credit 🙂
      </Text>
      {SHARE_LIST.map((app) => (
        <ShareButton
          onPress={() => onShareClick(app.id, app.url)}
          title={app.title}
          icon={app.image}
          fontSize={app.fontSize}
        />
      ))}
      <Button
        onPress={() => navigation.navigate("Home")}
        btnTitle="No thanks."
        style={[styles.noThanksBtn]}
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
                  We received your payment and your order confirmation is{' '}
                  <Text underlined onPress={() => navigation.navigate('CheckoutSuccess', {sale_id: sale_id}) }>
                    here
                  </Text>
                  .
                </Text>
              </View>
            </View>
            <View style={styles.line} />

            {renderShare()}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Share;
