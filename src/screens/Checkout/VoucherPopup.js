import React, { useState, useEffect, useContext } from 'react'
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native'
import styles from './VoucherPopupStyles'
import { appImages, appColors } from '../../theme'
import { Text, Input, Button } from '../../components/'
const { buttonOpacity, black, brown } = appColors
const { close } = appImages
import Services from '../../services'
const { API } = Services

import AppContext from '../../provider'
import helpers from "../../helpers";
const {
  getCartType,
  hapticFeedback,
} = helpers;

const VoucherPopup = (props) => {
  const { setShowPrivacyModal, contentStyle} = props

  const [code, setCode] = useState('')
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [voucherError, setVoucherError] = useState(false)  
  
  const {
    // General
    setIsAnyPopupOpened,
    setIsAnyApiLoading,
    loginData,
    setIsApiLoaderShowing,  // Is this really necessary as we already have setIsAnyApiLoading above
        
    // Cart Related Context
    // Grocery Cart
    cartData,
    setCartData,
    // Meal Cart
    mealsCartData,
    setMealsCartData,
  } = useContext(AppContext)
  
  const { accountInfo, token, user_id } = loginData;
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height)
        setKeyboardVisible(true) // or some other action
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false) // or some other action
        setKeyboardHeight(0)
      },
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])
  const contentStyles = [styles.content]
  if (contentStyle) {
    contentStyles.push(contentStyle)
  }

  const validateInputs = () => {
    if (code.trim().length > 0) {
      return true
    }
    return false
  }
  
  const applyVoucher = async () => {
    
    const cartType = getCartType(cartData, mealsCartData);
   
    if (cartType=='combined') {
      var meal_cart_id= parseInt(global.mealsCartId);
      var grocery_cart_id= parseInt(global.cartId);
      var carts = [grocery_cart_id,meal_cart_id]
    } else if (cartType=='grocery') {
      var cart_id= parseInt(global.cartId);
      var carts = [cart_id]
    } else if (cartType=='meal') {
      var cart_id= parseInt(global.mealsCartId);
      var carts = [cart_id]
    }
    
    var voucher_code = code;
    
    console.log('voucher_code',voucher_code);
    
    await API.execute("ecom2.cart","apply_voucher_code_check", [carts,voucher_code],{}, setIsAnyApiLoading,{token, user_id}).then((data) => {
                    
      // console.log('voucher answer',data, data.message);
      
      if (data) {
        if (data.message) {
          setVoucherError(data.message);
        }
      } else {
        
        if (cartType === "grocery") {
          API.grocery_cart_load(
            global.cartId,
            setCartData,
            () => {},
            'normal',
           {token, user_id},
           'apply_voucher'
          );
        }
        
        if (cartType === "combined" || cartType === "meal") {
          API.combined_cart_load(
            global.mealsCartId,
            global.cartId,
            setMealsCartData,
            setCartData,
            'normal',
            'apply_voucher'
          );
        }
        setShowPrivacyModal(voucher_code)
      }
      
    }).catch((err) => {
      alert(err)
    })
    
  }

  const validation = validateInputs()
  return (
    <Modal
      visible={props.showPrivacyModal}
      onRequestClose={() => {
        setShowPrivacyModal(null)
      }}
      transparent={true}
      // onShow={() => setBackColor(blackOpacity)}
      // onRequestClose={() => setBackColor('tranparent')}
      animationType={'slide'}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPrivacyModal(null)
        }}
      >
        <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
          <View
            style={[styles.body, { height: voucherError ? 237 + 55 : 237 }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.topView}>
              <Text style={styles.topText} numberOfLines={2} condensedBold>
                {'Do you have a voucher code?'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => {
                setShowPrivacyModal(null)
              }}
            >
              <Image
                source={close}
                style={styles.crossImg}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <View style={styles.scrollView}>
              {voucherError && (
                <View style={styles.invalid}>
                  <Text color={brown}>{voucherError}</Text>
                </View>
              )}
              <Input
                placeholder={'Voucher code'}
                label={'Add voucher'}
                onChangeText={(text) => {
                  setCode(text)
                  setVoucherError(false)
                }}
                value={code}
              />

              <Button
                onPress={() => {
                  //  Keyboard.dismiss()
                  applyVoucher();
                  hapticFeedback();
                }}
                btnTitle={'Apply voucher'}
                disabled={!validation}
                style={[
                  styles.addvouchBtnBtn,
                  { backgroundColor: validation ? black : buttonOpacity },
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default VoucherPopup
