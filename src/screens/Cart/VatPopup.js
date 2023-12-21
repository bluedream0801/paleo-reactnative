import React, { useState } from 'react'
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native'
import styles from './DeliveryPopupStyles'
import { appImages, appColors } from '../../theme'
import { Text } from '../../components/'
const { darkGray } = appColors
const { location_ic } = appImages
const VatPopup = (props) => {
  const {
    content,
    heading,
    contentHeight,
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
      visible={props.showPrivacyModal}
      onRequestClose={() => setShowPrivacyModal()}
      transparent={true}
      // onShow={() => setBackColor(blackOpacity)}
      // onRequestClose={() => setBackColor('tranparent')}
      animationType={'slide'}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPrivacyModal()
        }}
      >
        <View style={[styles.container, { backgroundColor: backColor }]}>
          <View style={[styles.body, { height: contentHeight ? contentHeight: 331 }]}>
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
                <Text lineHeight={18}>
                  Some of our products are VAT exempt and others are not. You
                  can see the items on which we have charged VAT for your order
                  below:
                  {'\n'}
                </Text>
              </View>
              <View style={styles.cell}>
                <Text colo={darkGray}>Canterbury Prime Steer Ribeye</Text>

                <Text colo={darkGray} condensed>
                  ฿269
                </Text>
              </View>
              <View style={styles.cell}>
                <Text colo={darkGray}>Piri Piri Chicken Wings</Text>

                <Text colo={darkGray} condensed>
                  ฿269
                </Text>
              </View>
              <View style={styles.cell}>
                <Text colo={darkGray}>Robbie's chicken roast</Text>

                <Text colo={darkGray} condensed>
                  ฿269
                </Text>
              </View>
              <View style={[styles.cell, styles.bottomBorder]}>
                <Text bold colo={darkGray}>
                  Total:
                </Text>

                <Text colo={darkGray} condensed>
                  ฿807
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default VatPopup
