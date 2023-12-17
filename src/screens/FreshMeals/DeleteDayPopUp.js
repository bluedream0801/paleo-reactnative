import React, { useState } from 'react'
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native'
import styles from './DeleteDayPopUpStyles'
import { appImages, appColors } from '../../theme'
const {} = appColors
const {} = appImages
import { Button, Text } from '../../components/'
const DeleteDayPopUp = (props) => {
  const {
    contentHeight,

    setShowPrivacyModal,
  } = props
  const [backColor, setBackColor] = useState('')

  return (
    <Modal
      visible={props.showModal}
      onRequestClose={() => setShowPrivacyModal()}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPrivacyModal()
        }}
      >
        <View style={[styles.container, { backgroundColor: backColor }]}>
          <View
            style={[
              styles.body,
              { height: contentHeight ? contentHeight : 180 },
            ]}
          >
            <View style={styles.topView}>
              <Text
                condensedBold
                largeRegularPlus
                textAlign={'center'}
                numberOfLines={2}
                lineHeight={25}
                style={styles.topText}
              >
                {'Are you sure you want to delete all Meals for Monday 19th? '}
              </Text>
            </View>

            <View style={styles.btnRow}>
              <Button
                btnTitle={'No, cancel'}
                onPress={() => setShowPrivacyModal()}
                small
                style={styles.noBtn}
                textStyle={styles.textStyles}
              />
              <Button
                btnTitle={'Yes, delete day'}
                onPress={() => setShowPrivacyModal()}
                small
                style={styles.yesBtn}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default DeleteDayPopUp
