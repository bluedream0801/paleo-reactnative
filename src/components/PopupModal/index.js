import React, { useState } from 'react'
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native'
import styles from './Styles'
import { appImages } from '../../theme'

const { location_ic } = appImages
const PopupModal = (props) => {
  const {
    content,
    heading,
    contentHeight,
    showBottomText,
    subHeading,
    setShowPrivacyModal,
    contentStyle,
    getMyCurrentLocation,
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
              <Text style={styles.topText} numberOfLines={2}>
                {heading}
              </Text>
            </View>
            {subHeading && (
              <View style={styles.subView}>
                <Text style={styles.subHeadingText} numberOfLines={2}>
                  {subHeading}
                </Text>
              </View>
            )}
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
              <Text style={contentStyles}>{content}</Text>
              {showBottomText && (
                <TouchableOpacity
                  style={styles.locationRow}
                  onPress={() => {
                    setShowPrivacyModal()
                    getMyCurrentLocation()
                  }}
                >
                  <Image source={location_ic} style={styles.location} />
                  <Text style={styles.bottomText}>Use my current location</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default PopupModal
