import React, { useState } from 'react'
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native'
import styles from './OrderAmountsPopupStyles'
import { appImages, appColors } from '../../theme'
import { Text } from '../../components/'
const { green } = appColors
const { location_ic } = appImages
const OrderAmountsPopup = (props) => {
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
          <View
            style={[
              styles.body,
              { height: contentHeight ? contentHeight : 276 },
            ]}
          >
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
              <Text style={contentStyles}>
                If your delivery contains only items from our Fresh Meals menu, the
                minimum delivery amount is
                <Text condensedBold> ฿</Text>
                <Text bold>299</Text>.{'\n'} {'\n'}
                If your delivery contains any other items, the minimum delivery amount
                is
                <Text condensedBold> ฿</Text>
                <Text bold>750</Text>.{'\n'} {'\n'}
                This is because our grocery products require larger and more
                packaging per order to deliver (and ensure the proper
                temperature is maintained as the goods travel from us to you).
              </Text>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default OrderAmountsPopup
