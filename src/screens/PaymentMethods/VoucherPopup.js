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

const VoucherPopup = (props) => {
  const { setShowPrivacyModal, contentStyle, confirmCardId} = props

  const [code, setCode] = useState('')
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [CVVError, setCVVError] = useState(false)  
  
  const {
    // General
    setIsAnyPopupOpened,
    setIsAnyApiLoading,
    loginData,
    setIsApiLoaderShowing,  // Is this really necessary as we already have setIsAnyApiLoading above
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
    if ((code.trim().length > 0) && (code.trim().length < 4)){
      return true
    }
    return false
  }
  
  const confirmCVV = async () => {
    
    var cvvCode = code;
    
    console.log('cvv_code',confirmCardId,cvvCode);
    
    var vals = {
      "cvv": cvvCode,
    };
    
    // Create Card Token in netforce
    await API.execute("card.token","write",[[confirmCardId],vals],{},setIsAnyApiLoading,{token, user_id}).then((data) => {
                    
      console.log('cvv code updated answer',data);
      
      if (data) {
        if (data.message) {
          setCVVError(data.message);
        }
      } else {
        setShowPrivacyModal(cvvCode)
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
            style={[styles.body, { height: CVVError ? 237 + 55 : 237 }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.topView}>
              <Text style={styles.topText} numberOfLines={2} condensedBold>
                {'Please confirm the CVV code'}
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
              {CVVError && (
                <View style={styles.invalid}>
                  <Text color={brown}>{CVVError}</Text>
                </View>
              )}
              <Input
                placeholder={'CVV code'}
                label={'Add cvv code'}
                onChangeText={(text) => {
                  setCode(text)
                  setCVVError(false)
                }}
                value={code}
              />

              <Button
                onPress={() => {
                  //  Keyboard.dismiss()
                  confirmCVV();
                }}
                btnTitle={'Confirm CVV'}
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
