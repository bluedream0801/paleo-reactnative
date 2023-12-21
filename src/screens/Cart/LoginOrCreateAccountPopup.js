import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import styles from "./LoginOrCreateAccountPopupStyles";
import { appImages, appColors } from "../../theme";
import { Text, Button  } from "../../components/";
const {
  black,
  blackOpacity,
} = appColors;

const LoginOrCreateAccountPopup = (props) => {
  const {
    showModal,
    setShowPrivacyModal,
    navigation,
  } = props;
  
  
  const onPressLogin = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Auth',
          params: {
            screen: 'login'
          }
        }
      ]
    });    
  };
  
  const onPressCreateAccount = () => {
    navigation.reset({
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
  };

  return (
    <Modal
      isVisible={showModal}
      onRequestClose={() => setShowPrivacyModal()}
      backdropColor={blackOpacity}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={() => {
        setShowPrivacyModal(false);
      }}
      statusBarTranslucent
      useNativeDriverForBackdrop
      swipeDirection={["down"]}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPrivacyModal();
        }}
      >
        <View style={[styles.container]}>
          <View style={[styles.body]}>
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => setShowPrivacyModal()}
            >
              <Image
                source={appImages.close}
                style={styles.crossImg}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
            <Text condensedBold minTitle style={styles.margin} color={black}>
              Login or create account
            </Text>
            <Text style={styles.description} color={black}>
              You will need to either login or create an account in order to proceed.
            </Text>
            <View style={[styles.footer]}>
              <Button
                btnTitle={'Sign in'}
                color={appColors.black}
                style={styles.login}
                textStyle={styles.loginText}
                onPress={onPressLogin}              
              />
              <Button
                btnTitle={'Create account'}
                style={styles.addAnother}
                onPress={onPressCreateAccount}              
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LoginOrCreateAccountPopup;