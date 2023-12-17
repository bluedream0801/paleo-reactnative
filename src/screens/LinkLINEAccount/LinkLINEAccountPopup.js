import React from "react";
import { View, Image, Alert, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import * as Linking from 'expo-linking';
import styles from "./LinkLINEAccountPopupStyles";
import { appImages, appColors } from "../../theme";
import { Text, Button } from "../../components";
import LINELoginButton from "../../components/LINELoginButton";
import LINE from '../../helpers/line';
const { blackOpacity } = appColors;
const { appTrackingPageLogo, lineOfficialAccountIcon } = appImages;
import Services from '../../services'
import { ScrollView } from "react-native-gesture-handler";
const { API } = Services

const LinkLINEAccountPopup = (props) => {

  const { showPopup, setShowPopup, loginData, setLoginData, popupType } = props;
  var { user_id } = loginData;

  const onPressLogin = async () => {
    try {
      var contact_id = loginData.accountInfo.contact_id.id;

      var ctx={
        contact_id: contact_id,
      };
      const data = await LINE.updateAcccountLINE_v2(ctx, () => {});

      if (data.message) {
        alert(data.message);
      } else {
        // await LINE.setShouldAskLINELinking(false);
        /*
        var vals = {}
        vals['line_popup_showed'] = true;
        await API.execute('contact', 'write', [[loginData.accountInfo.contact_id.id], vals], {}, () => {}, {token: token, user_id: user_id})
        .catch((err) => {
          alert('Error: ' + err)
        })
        */

        await getUserData();
        setShowPopup(false);
        Alert.alert('', `Success! Your LINE accout is now linked. You will receive delivery notifications by LINE so please don't mute us! 🙂`);
      }

    } catch(ex) {
      console.log(ex);
    }
  };

  const onPressCancel = async () => {
    // await LINE.setShouldAskLINELinking(false);
    /*
    var vals = {}
    vals['line_popup_showed'] = true;
    await API.execute('contact', 'write', [[loginData.accountInfo.contact_id.id], vals], {}, () => {}, {token: token, user_id: user_id})
    .catch((err) => {
      alert('Error: ' + err)
    })
    */

    await getUserData();

    setShowPopup(false);
    // await LINE.setShouldAskLINELinking(false);
  };

  const onPressFollow = () => {
    LINE.openFollowLINEQA();
    setShowPopup(false);
  }

  const getUserData = async () => {
    API.user_load({ user_id: user_id }, () => {})
      .then((response) => {
        let previousData = Object.assign({}, loginData)
        setLoginData({ ...previousData, accountInfo: response[0] })
      })
      .catch((err) => {
        alert(err)
      })
  }

  return (
    <Modal
      backdropColor={blackOpacity}
      isVisible={showPopup}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={() => {
        setShowPopup();
      }}
      statusBarTranslucent
      useNativeDriverForBackdrop
    >
      <View style={[styles.container]}>
        {popupType === 'link_account' ? (
          <View style={[styles.body]}>
            <Image
              source={appTrackingPageLogo}
              style={styles.logo}
              resizeMode={"contain"}
            />
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => setShowPopup(false)}
            >
              <Image
                source={appImages.close}
                style={styles.crossImg}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <View style={styles.innserScoll}>
              <Text condensedBold largeTitlePlus style={styles.title}>
                Link your LINE account?
              </Text>

              <Text regular style={[styles.description, styles.textCenter]}>
                We can now send:
                {"\n"}
              </Text>
              <View style={styles.alignCenter}>
                <Text regular>
                  {"\u2022"} Order confirmation & receipt{"\n"}
                  {"\u2022"} Delivery notifications{"\n"}
                  {"\u2022"} “Back in stock” notifications{"\n"}
                </Text>
              </View>
              <Text regular style={styles.textCenter}>
                ...directly to LINE instead of email. It’s great.
                {"\n\n"}
                Click to link your account, and make sure to press <Text bold>“Add friend”</Text> to get these messages.
                {"\n"}
              </Text>
            </View>
            <LINELoginButton onPress={onPressLogin}></LINELoginButton>
            <Button
              btnTitle={"No thanks, I prefer email."}
              style={styles.cancelButton}
              onPress={onPressCancel}
            />
            <Text small style={styles.footerText}>
              Change your settings at any time in the Account section.
            </Text>
          </View>
         ) : (
          <View style={[styles.body]}>
            <Image
              source={appTrackingPageLogo}
              style={styles.logo}
              resizeMode={"contain"}
            />
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => setShowPopup(false)}
            >
              <Image
                source={appImages.close}
                style={styles.crossImg}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <ScrollView style={styles.innserScoll}>
              <Text condensedBold largeTitlePlus style={styles.title}>
                Follow our LINE Official to get critical notifications
              </Text>
              <View style={styles.lineQAInfoContainer}>
                <Image style={styles.lineQAIcon} resizeMode={"contain"} source={lineOfficialAccountIcon}/>
                <Text condensedBold largeRegularPlus>@paleorobbie</Text>
              </View>

              <Text regular style={[styles.descriptionQA, styles.textVMargin]}>
                We noticed you have linked your LINE account but you are not currently following our Paleo Robbie LINE Official Account.
              </Text>
              <Text regular style={[styles.descriptionQA, styles.textVMargin]}>
                In order for us to send you messages like:
              </Text>
              <View style={[styles.alignCenter]}>
                <Text regular style={[styles.alignCenter, styles.textVMargin]}>
                  {"\u2022"} Order confirmation & receipt{"\n"}
                  {"\u2022"} Delivery notifications{"\n"}
                  {"\u2022"} “Back in stock” notifications
                </Text>
              </View>
              <Text regular style={[styles.textCenter, styles.textVMargin]}>
                ...you need to be following our account.
              </Text>
              <Text regular style={[styles.textCenter, styles.textVMargin]}>
                You’ll also get our weekly promotions & new product announcements - just the good stuff.
              </Text>
            </ScrollView>
            <Button
              btnTitle={"OK, let’s do it"}
              style={styles.followButton}
              onPress={onPressFollow}
            />
            <Text small style={styles.footerTextQA}>
              Change your settings at any time in the Account section.
            </Text>
          </View>
         )}
      </View>
    </Modal>
  );
};

export default LinkLINEAccountPopup;
