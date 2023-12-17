import React, { useState } from 'react'
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native'
import { Text } from '../../components/'
import styles from './QRCodeHelpPopupStyles'
import { appImages, appColors } from '../../theme'
const { darkGrey, black, darkGray } = appColors
const { location_ic, qrcode1, qrcode2, qrcode3, qrcode4, qrcode5 } = appImages

const DataArray = [
  {
    number: 1,
    title: 'Save a screenshot of the\nQR code to your photos',
    text: 'You can also press the “Save\nimage” button to do this.',
    image: qrcode1,
  },
  {
    number: 2,
    title: 'Open your banking app.',
    text: 'Look for the “Scan QR” function\nin most Thai mobile banking\napps.',
    image: qrcode2,
  },
  {
    number: 3,
    title: 'Press the “Choose/scan\nfrom photo library” option.',
    text: ' ',
    image: qrcode3,
  },
  {
    number: 4,
    title: 'Select the screenshot\nyou saved that contains\nthe QR.',
    text: ' ',
    image: qrcode4,
  },
  {
    number: 5,
    title:
      'Your banking app will now\nsetup the payment details\nautomatically.',
    text:
      'Press transfer and you’re done!\nYou will receive a notification\nfrom our app that the payment is\nreceived and order is confirmed.',
    image: qrcode5,
  },
]

const QRCodeHelpPopup = (props) => {
  const { setShowPrivacyModal, contentStyle } = props
  const [backColor, setBackColor] = useState('')

  const contentStyles = [styles.content]
  if (contentStyle) {
    contentStyles.push(contentStyle)
  }

  const renderListItem = (obj, i) => {
    const { title, number, text, image } = obj
    return (
      <View style={[styles.cellContainer, {}]}>
        <ImageBackground source={image} style={styles.image}></ImageBackground>

        <View style={styles.cellInner}>
          <View style={styles.circle}>
            <Text color={darkGrey} regularPlus condensedBold>
              {number}
            </Text>
          </View>
          <Text
            regular
            condensedBold
            color={black}
            lineHeight={20}
            style={styles.titileText}
          >
            {title}
          </Text>
          <Text extSmall color={darkGray} lineHeight={18}>
            {text}
          </Text>
        </View>
      </View>
    )
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
      <View style={[styles.container, { backgroundColor: backColor }]}>
        <View style={[styles.body, { height: '94%' }]}>
          <View style={styles.topView}></View>

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
            {DataArray.map((obj, i) => {
              return renderListItem(obj, i)
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default QRCodeHelpPopup
