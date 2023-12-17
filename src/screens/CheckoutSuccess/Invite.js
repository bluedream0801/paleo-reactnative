import React, { useState, useContext, useEffect, useCallback } from "react";

import { View, Image, ScrollView } from "react-native";
import styles from "./Styles2";
import { appColors, appImages } from "../../theme";

import { MarketHeader, Text, Button } from "../../components/";

const { black } = appColors;

const { friend_man_img, success_ic } = appImages;

const Invite = (props) => {
  const renderShare = () => (
    <View style={styles.inviteContainer}>
      <View style={styles.inviteBody}>
        <Text smallRegular textAlign={"center"}>
          Do you have a friend that would like what we do? Help us grow & get
          some store credit by sharing your link ❤️
        </Text>
        <Image style={styles.inviteImg} source={friend_man_img} />

        <View style={styles.inviteCard}>
          <Text smallTitle condensedBold style={styles.inviteTitle}>
            Give ฿500, get ฿500.
          </Text>
          <Text smallRegular style={styles.inviteNote}>
            Invite your friends to give us a try with a ฿500 voucher. When they
            use it, you’ll get a ฿500 credit.
          </Text>
          <Button
            onPress={() => alert("Send invite")}
            btnTitle="Send invite"
            small
            style={[styles.sendInviteBtn]}
            textStyle={[styles.sendInviteBtnText]}
          />
        </View>
        <Text small textAlign={"center"} style={styles.inviteBottomNote}>
          Minimum order ฿1,500 before discount. {"\n"}No family members or
          significant others at the same address, please! 🙂
        </Text>
        <Text small textAlign={"center"} style={styles.inviteTerms}>
          See full{" "}
          <Text small underlined onPress={() => alert("terms of service")}>
            terms of service.
          </Text>
        </Text>
      </View>
      <Button
        onPress={() => alert("No thanks")}
        btnTitle="No thanks."
        style={[styles.inviteNoThanksBtn]}
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
                  <Text underlined onPress={() => alert("here")}>
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

export default Invite;
