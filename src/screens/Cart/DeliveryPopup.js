import React, { useState } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native'
import Modal from "react-native-modal";
import styles from './DeliveryPopupStyles'
import { appImages, appColors } from '../../theme'
import { Text } from '../../components/'
const { blackOpacity } = appColors
const { location_ic } = appImages
const DeliveryPopup = (props) => {
  const {
    heading,
    showBottomText,
    subHeading,
    setShowPrivacyModal,
    contentStyle,
  } = props
  const [backColor, setBackColor] = useState('')

  const contentStyles = [styles.content]
  if (contentStyle) {
    contentStyles.push(contentStyle)
  }

  return (
    <Modal
      backdropColor={blackOpacity}
      isVisible={props.showPrivacyModal}
      onRequestClose={() => setShowPrivacyModal()}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={() => {
        setShowPrivacyModal();
      }}
      statusBarTranslucent
      useNativeDriverForBackdrop
      swipeDirection={["down"]}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPrivacyModal()
        }}
      >
        <View style={[styles.container]}>
          <View style={[styles.body, { height: 320 }]}>
            <View style={styles.topView}>
              <Text style={styles.topText} numberOfLines={2} condensedBold>
                {heading}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => setShowPrivacyModal()}
            >
              <Image
                source={appImages.close}
                style={styles.crossImg}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <ScrollView style={styles.scrollView}>
              <View style={styles.innserScoll}>
                <Text bold lineHeight={18}>
                  Delivery fees are charged based on distance from our facility
                  in central Bangkok and the size of your delivery.
                </Text>

                <Text lineHeight={18}>
                  {'\n'}
                  If your delivery contains only Fresh Meals, the fee starts at
                  <Text condensed> ฿</Text>
                  60. Otherwise, the fee starts at <Text condensed> ฿</Text>90.
                  {'\n'} {'\n'}
                  For any delivery with a value over<Text condensed> ฿</Text>
                  1,500 in central Bangkok, delivery is free.
                  {'\n'} {'\n'}
                  See the full details under ‘Delivery details’ in the Account section of the app.
                  {'\n'} {'\n'}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default DeliveryPopup
