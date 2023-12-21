import React, { useState, useContext } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native'
import styles from './HowItWorksPopupStyles'
import { appImages, appColors } from '../../theme'
const { black, darkGray } = appColors
const {} = appImages
import { Text } from '../../components/'
import AppContext from '../../provider';

const HowItWorksPopup = (props) => {
  
  const {
    loginData,
  } = useContext(AppContext);
  
  const { setShowPrivacyModal, navigation } = props
  const [backColor, setBackColor] = useState('')

  const renderQuestions = () => {
    return (
      <View style={styles.textContainer}>
        <Text condensedBold regularPlus color={darkGray} lineHeight={18}>
          1. Choose the delivery day you want.
        </Text>
        <Text smallRegular color={darkGray} lineHeight={18}>
          {'\n'}Fresh Meals cannot be ordered for same-day delivery. (We need
          time to prepare them!) You can order up to 8pm the night before your
          delivery day. {'\n'}
        </Text>
        <Text condensedBold regularPlus color={darkGray} lineHeight={18}>
          2. See the menu for that day.
        </Text>
        <Text smallRegular color={darkGray} lineHeight={18}>
          {'\n'}We change the Specials menu every 3 days to ensure a good
          variety of choices for you. Normally this means a new menu every
          Mon-Weds and Thurs-Sat. {'\n'}
        </Text>

        <Text condensedBold regularPlus color={darkGray} lineHeight={18}>
          3. Add the meal(s) to your cart.
        </Text>
        <Text smallRegular color={darkGray} lineHeight={18}>
          {'\n'}Add our Fresh Meals to your cart like any other grocery item and
          they will be delivered together.{'\n'}
          {'\n'}You can add Fresh Meals for multiple days (with multiple
          deliveries) into the same cart and checkout only once. Simply change
          the date before adding a new meal to cart and you can schedule
          deliveries up to 6 days in advance.
          {'\n'}
        </Text>

        <Text condensedBold regularPlus color={darkGray} lineHeight={18}>
          4. (Optional) Return the containers for free!
        </Text>
        <View style={styles.textRow} onStartShouldSetResponder={() => true}>
          <Text smallRegular color={darkGray} lineHeight={18} style={{}}>
            {'\n'}Help us reduce single-use plastic! We will take back your meal
            containers with your next delivery, or we will pick them up for free
            on Fridays and Saturdays. Schedule a free pickup{' '}
            <TouchableOpacity
              onPress={() => {
                setShowPrivacyModal(false)
                if (loginData) {
                  navigation.navigate('AccountStack', {
                    screen: 'ScheduleContainer',
                  })
                } else {
                  alert('You need to login in order to access this section.')
                }
              }}
              style={styles.underLinkText}
            >
              <Text
                smallRegular
                color={darkGray}
                lineHeight={18}
                style={styles.underLinkText}
              >
                here
              </Text>
            </TouchableOpacity>
            <Text smallRegular color={darkGray} lineHeight={18}>
              .{'\n'}
            </Text>
          </Text>
        </View>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={() => setShowPrivacyModal()}>
      <View style={[styles.container, { backgroundColor: backColor }]}>
        <View
          style={[styles.body, { height: 661 }]}
          onStartShouldSetResponder={() => true}
        >
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
          <View style={styles.topView}>
            <Text
              condensedBold
              largeRegularPlus
              textAlign={'center'}
              numberOfLines={2}
              lineHeight={25}
              style={styles.topText}
              color={black}
            >
              {'Fresh Meals: How it Works'}
            </Text>
          </View>
          <ScrollView scrollEnabled={false}>{renderQuestions()}</ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default HowItWorksPopup
