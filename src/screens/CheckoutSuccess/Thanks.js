import React, { useState, useContext, useEffect, useCallback } from "react";

import { View, Image } from "react-native";
import styles from "./Styles2";
import { appImages } from "../../theme";

import { MarketHeader, Text, Button } from "../../components/";

const { logoThanks } = appImages;

const Thanks = (props) => {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <MarketHeader searchEnabled={false} condensedTitle={`Order SO-108267`} />
      <View style={styles.body}>
        <View style={styles.thanksContainer}>
          <View style={styles.thanksBody}>
            <Image style={styles.logoThanks} source={logoThanks} />
            <Text condensedBold style={styles.thanksTitle}>
              Thank you!
            </Text>
            <Text style={styles.thanksNote} condensedBold largeRegularPlus>
              Your account has been credited with ฿100 for your next order.
            </Text>
          </View>

          <Button
            onPress={() => navigation.navigate("Home")}
            btnTitle="Take me Home"
            style={[styles.takeHomeBtn]}
          />
        </View>
      </View>
    </View>
  );
};

export default Thanks;
