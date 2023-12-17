import React, { useState, useContext } from "react";
import {
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StatusBar,
  Platform,
} from "react-native";
import * as CommonActions from "@react-navigation/routers/src/CommonActions";
import { appColors, appImages } from "../../theme";
const { orderDarkGray, errorText } = appColors;
import styles from "./Styles";
import {
  PrivacyModal,
  TermsModal,
  Button,
  Header,
  Input,
  Text,
  LINELoginButton
} from "../../components/";
import AppContext from "../../provider";
import Services from "../../services";
import helpers, { AppsFyler } from "../../helpers";
import LINE from "../../helpers/line";
import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const { eye, full_eye } = appImages;

const { validateEmail } = helpers;
const { API } = Services;

const Signup = (props) => {
  const { navigation } = props;

  const { setIsApiLoaderShowing,
  setLoginData,
  updateCartId,
  cartData,
  // refId,
  // setRefId,
  // refVoucher,
  // setRefVoucher,
  } =
    useContext(AppContext);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailSignupForm, setShowEmailSignupForm] = useState(false);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // login method
  const onLogin = () => {
    props.navigation.navigate("login");
  };

  const validateInputs = () => {
    let valid = true;
    let validationErrors = {};

    if (email || email.trim().length > 0) {
      if (!validateEmail(email)) {
        valid = false;
        validationErrors['email'] = 'Check again, you might have made a typo. eg:\nyou@paleo.com';
      }
    } else {
      valid = false;
      validationErrors['email'] = 'Missing email.';
    }

    if (!firstName || firstName.trim().length == 0) {
      valid = false;
      validationErrors['firstName'] = 'Missing first name.';
    }

    if (!lastName || lastName.trim().length == 0) {
      valid = false;
      validationErrors['lastName']  = 'Missing last name.';
    }

    if (!password || password.trim().length == 0) {
      valid = false;
      validationErrors['password'] = 'Missing password.';
    }
    setErrors({
      ...errors,
      ...validationErrors
    });

    return valid;
  };

  const validateInputsForLine = () => {
    let valid = true;

    const validationErrors = {};

    if (!firstName || firstName.trim().length == 0) {
      valid = false;
      validationErrors['firstName'] = 'Please enter your first name.';
    }

    if (!lastName || lastName.trim().length == 0) {
      valid = false;
      validationErrors['lastName'] = 'Please enter your last name.';
    }
    setErrors({
      ...errors,
      ...validationErrors
    });

    return valid;
  };

  const processSignUpResponse = async (data) => {
    /*
    if (data.voucher) {
      await AsyncStorage.setItem('refVoucher', data.voucher);
      setRefVoucher(data.voucher);
    }
    */

    if (data.user_id) {
      await analytics().logEvent('click_create_account', { userID: data.user_id });
      API.user_load({ user_id: data.user_id }, setIsApiLoaderShowing)
        .then((response) => {
          clearInputs();
          setLoginData({ accountInfo: response[0], ...data });
          // log signup event
          AppsFyler.logEvent('create_account', {});

          var token = data.token;
          var user_id = data.user_id
          
          API.execute("ecom2.interface", "contact_tracking", ["open_app"], {}, setIsApiLoaderShowing, { token, user_id });

          // Only create a new cart id if we don't already have one
          if (global.cartId == null) {
            API.create_grocery_cart({token, user_id}).then((res) => {
              updateCartId(res);
            });
          }

          // If the user doesn't have any addresses and no default zone set up under his account, then we take him through the postcode flow
          console.log('Addresses Check', response[0].contact_id.addresses);
          var addresses = response[0].contact_id.addresses;
          console.log('Address Check Condition', addresses.length, response[0].contact_id.zone_id);
          if(response[0].contact_id.zone_id == null && addresses.length==0) {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: "PostCode" }],
              })
            )
          // Normal flow
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: "TabNavigation" }],
              })
            )
          }

        })
        .catch((err) => {
          alert(err);
        });
    } else {
      alert(data.message);
    }
  }

  const onToggleEmailSignup = (selected) => {
    setShowEmailSignupForm(selected);
  }

  const onCreateAccount = async () => {
    Keyboard.dismiss();
    if (validateInputs()) {

      // var referral_id = refId;

      const deeplinkValue = await AsyncStorage.getItem('deeplink_value');
      console.log('Deeplink value', deeplinkValue);

      var vals = {
        email: email.toLowerCase(),
        password: password,
        first_name: firstName,
        last_name: lastName,
        guest: false,
        // referral_id: referral_id,
        device: "App",
        browser: "",
        operating_system: Platform.OS === "ios" ? "ios" : "android",
        deeplink: deeplinkValue || '',
      };
      // const response = API.execute(
      //   'ecom2.interface',
      //   'server_info',
      //   [],
      //   {},
      //   setIsApiLoaderShowing,
      // )

      var ctx={
        grocery_cart_id: parseInt(global.cartId),
        meal_cart_id: parseInt(global.mealsCartId),
      };

      const response = API.execute(
        "ecom2.interface",
        "sign_up",
        [vals],
        {context:ctx},
        setIsApiLoaderShowing
      )
        .then( async (data) => {
          await processSignUpResponse(data);
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const clearInputs = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };

  const clearErrors = (field) => {
    if (field) {
      setErrors({
        ...errors,
        [field]: ''
      });
    } else {
      setErrors({});
    }
  };

  const onContinueAsGuest = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "TabNavigation" }],
      })
    )
  };

  const onSignUpWithLINE = async () => {
    try {

      if (validateInputsForLine()) {

        // var referral_id = refId;

        const deeplinkValue = await AsyncStorage.getItem('deeplink_value');
        console.log('Deeplink value', deeplinkValue);

        var ctx={
          grocery_cart_id: parseInt(global.cartId),
          meal_cart_id: parseInt(global.mealsCartId),
          first_name: firstName,
          last_name: lastName,
          // referral_id: referral_id,
          device: "App",
          browser: "",
          operating_system: Platform.OS === "ios" ? "ios" : "android",
          deeplink: deeplinkValue || '',
        };

        const data = await LINE.createAcccountWithLINE_v2(cartData, ctx, setIsApiLoaderShowing);
        await processSignUpResponse(data);

      }
    } catch (err) {
      alert(err);
    }
  }

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1, backgroundColor: appColors.white }}
      onPress={() => Keyboard.dismiss()}
    >
      <View style={{ flex: 1, backgroundColor: appColors.white, display: 'flex' }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={appColors.headerBgColor}
        />
        <Header title={"Create your account"} backPress={() => navigation.pop()} hideBack={!navigation.canGoBack()}/>

        {/* Body  */}
        <View style={styles.body}>
          <KeyboardAwareScrollView contentContainerStyle={styles.bodyContent}>
            <Text color={orderDarkGray} style={{alignSelf: 'flex-start', height: 20}}>Please provide your:</Text>
            <View style={styles.nameView}>
              <View style={styles.container}>
                <Input
                  value={firstName}
                  onChangeText={(text) => {
                    clearErrors('firstName');
                    setFirstName(text);
                  }}
                  placeholder={'First name'}
                  customStyles={{
                    container: styles.inputCustom,
                  }}
                  inputStyle={{
                    width: '100%'
                  }}
                />
                <Text color={errorText}>{errors.firstName || ''}</Text>
              </View>
              <View style={styles.inpuOuter}>
                <Input
                  value={lastName}
                  onChangeText={(text) => {
                    clearErrors('lastName');
                    setLastName(text);
                  }}
                  placeholder={'Last name'}
                  customStyles={{
                    container: {
                      paddingLeft: '5%'
                    }
                  }}
                  inputStyle={{
                    width: '100%'
                  }}
                />
                <Text color={errorText} textAlign={"right"}>
                  {errors.lastName || ''}
                </Text>
              </View>
            </View>
            <View style={styles.signUpButtonsContainer}>
              <Text color={orderDarkGray}>
                Then you can sign up with:
              </Text>
              <LINELoginButton style={styles.lineSignupButton} onPress={onSignUpWithLINE} label={'Create account with LINE'}></LINELoginButton>
              <Text color={orderDarkGray} style={styles.separator}>
                - or -
              </Text>
              <Button btnTitle={"Create account with email"} onPress={onToggleEmailSignup} type={'toggleButton'} style={{width: 'auto', paddingHorizontal: 32, marginTop: 12}}/>
            </View>
            {showEmailSignupForm && (
              <View style={styles.emailSignupContainer}>
                <Input
                  placeholder={"Enter your email"}
                  value={email}
                  onChangeText={(text) => {
                    clearErrors('email');
                    setEmail(text.replace(/\s/g, ""));
                  }}
                  inputStyle={{
                    width: '100%'
                  }}
                />
                <Text color={errorText}>{errors.email || ''}</Text>
                <Input
                  value={password}
                  onChangeText={(text) => {
                    clearErrors('password');
                    setPassword(text);
                  }}
                  placeholder={'Create password'}
                  secureTextEntry={!showPassword}
                  password
                  imageSource={!showPassword ? eye : full_eye}
                  onPressIcon={toggleShowPassword}
                  customStyles={{
                    container: {
                      marginTop: 8,
                    },
                  }}
                />
                <Text color={errorText}>{errors.password || ''}</Text>
                <Button btnTitle={'Continue'} disabled={!email || !password || !!errors.email || !!errors.password}
                  onPress={onCreateAccount}
                  style={{paddingHorizontal: 24, alignSelf: 'flex-end', marginTop: 0}}>
                </Button>
              </View>
            )}
            <View
              style={{
                marginTop: 20,
                marginBottom: 23
              }}
            >
              <View style={styles.textRow}>
                <Text style={styles.termsText}>
                  By clicking above, you agree to our&nbsp;
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTermsModal(!showTermsModal)}
                  style={[styles.smallTextRow, { width: 82 }]}
                >
                  <Text style={styles.termsText}>Terms of Use</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.textRow}>
                <Text style={[styles.termsText, { marginTop: 0 }]}>
                  and consent to our&nbsp;
                </Text>
                <Text underlined style={styles.termsText} onPress={() => setShowPrivacyModal(!showPrivacyModal)}>Privacy Policy</Text>
                <Text>.</Text>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>

        <TouchableOpacity
          style={styles.footer}
          activeOpacity={0.8}
          onPress={() => onContinueAsGuest()}
        >
          <Text style={styles.signupText}>
            Just want to look around first?{" "}
            <Text style={{ color: appColors.green }} onPress={() => onContinueAsGuest()}>
              Go ahead
            </Text>
          </Text>
        </TouchableOpacity>

        {showTermsModal && (
          <View style={styles.modalContain}>
            <TermsModal
              showTermsModal={showTermsModal}
              setShowTermsModal={() => {
                setShowTermsModal(!showTermsModal);
              }}
            />
          </View>
        )}

        {showPrivacyModal && (
          <View style={styles.modalContain}>
            <PrivacyModal
              showPrivacyModal={showPrivacyModal}
              setShowPrivacyModal={() => {
                setShowPrivacyModal(!showPrivacyModal);
              }}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Signup;
