import React, { useState } from "react";
import { TouchableOpacity, View, Image, Linking } from "react-native";
import Modal from "react-native-modal";
import styles from "./UpdatePopupStyles";
import { appImages, appColors, appMetrics } from "../../theme";
import { Text, Button } from "../../components/";
const { blackOpacity } = appColors;
const { appTrackingPageLogo } = appImages;
const UpdatePopup = (props) => {
  const { showPrivacyModal, setShowPrivacyModal } = props;

  const onPressUpdate = () => {
    let link;
    if (appMetrics.IS_IOS) {
      link = "itms-apps://apps.apple.com/se/app/paleo-robbie/id1597443504";
    } else {
      link = "market://details?id=com.food.paleorobbie";
    }

    Linking.canOpenURL(link).then(
      (supported) => {
        supported && Linking.openURL(link);
      },
      (err) => console.log(err)
    );
  };

  const onPressCancel = () => {
    setShowPrivacyModal(false);
  };

  return (
    <Modal
      backdropColor={blackOpacity}
      isVisible={showPrivacyModal}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={() => {
        setShowPrivacyModal();
      }}
      statusBarTranslucent
      useNativeDriverForBackdrop
    >
      <View style={[styles.container]}>
        <View style={[styles.body]}>
          <Image
            source={appTrackingPageLogo}
            style={styles.logo}
            resizeMode={"contain"}
          />

          <View style={styles.innserScoll}>
            <Text condensedBold largeTitlePlus style={styles.title}>
              It’s time to update the app!
            </Text>

            <Text regular style={styles.description}>
              Please click the below button to update to the latest version of
              our app 👇
              {"\n"}
              {"\n"}
              We’re constantly adding new features and fixing small bugs.
              Without the latest version, the app might not work correctly.
            </Text>
          </View>
          <Button
            btnTitle={"Update now"}
            style={styles.updateButton}
            onPress={onPressUpdate}
          />
          {/* <TouchableOpacity onPress={onPressCancel}>
            <Text small lineHeight={18} style={styles.footerText}>
              Or{" "}
              <Text small lineHeight={18} underlined onPress={onPressCancel}>
                click here
              </Text>{" "}
              to update later - please be aware the app may not work correctly
              if not updated to the latest version.
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

export default UpdatePopup;
