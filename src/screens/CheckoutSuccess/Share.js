import React, { useState, useContext, useEffect, useCallback } from "react";

import { View, Image, ScrollView, Pressable } from "react-native";
import styles from "./Styles2";
import { appColors, appImages } from "../../theme";

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
  },
  {
    id: "facebook",
    image: logoFacebook,
    title: "Go to Facebook",
    fontSize: 17,
  },
  {
    id: "appstore",
    image: logoAppstore,
    title: "Go to App / Play Store",
    fontSize: 13,
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
  const onShareClick = (appId) => {
    alert("Clicked " + appId);
  };

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
          onPress={() => onShareClick(app.id)}
          title={app.title}
          icon={app.image}
          fontSize={app.fontSize}
        />
      ))}
      <Button
        onPress={() => alert("No thanks")}
        btnTitle="No thanks."
        style={[styles.noThanksBtn]}
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
                  We received your payment and your order confirmation is{' '}
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

            {renderShare()}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Share;
