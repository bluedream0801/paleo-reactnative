import React, { useState, useContext } from 'react'
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Share,
} from 'react-native'
import {
  Button,
  AccountHeader,
  Input,
  Text,
  PopupModal,
} from '../../components/'
import AppContext from '../../provider'
import styles from './Styles'
import { appColors, appImages, appMetrics } from '../../theme'
const { offer_image } = appImages
const { IS_IOS } = appMetrics
const { black, orderDarkGray, darkGray, green } = appColors
const PupupContent =
  'Minimum first purchase amount of ฿1,500 baht for the referred person (calculated before discount). Once the referred customer has made a purchase, the referring customer will be credited with ฿500 automatically. Questions? Visit the Help Center or call us at 083-002-3607.'
const ReferAFriend = (props) => {
  const { navigation } = props
  const [showModal, setShowModal] = useState(false)
  const { setIsAnyPopupOpened } = useContext(AppContext)
  const onBackPress = () => {
    navigation.goBack()
  }
  const onShareLink = async () => {
    try {
      const result = await Share.share({
        message: 'Share app',
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }
  const renderOfferContent = () => {
    return (
      <View style={styles.offerContainer}>
        <Image source={offer_image} style={styles.offerImg} />
        <Text bold largeRegularPlus color={black} style={styles.offerText}>
          Give{' '}
          <Text condensedBold largeRegularPlus color={black}>
            ฿500,
          </Text>{' '}
          get
          <Text condensedBold largeRegularPlus color={black}>
            {' '}
            ฿500
          </Text>
          .
        </Text>
      </View>
    )
  }

  const renderInputContent = () => {
    return (
      <View style={styles.contentMargin}>
        <Text smallRegular color={orderDarkGray} style={styles.heading}>
          Or send it directly to your friend's email
        </Text>
        <View style={styles.innerContainer}>
          <Input label={"Friend's first name"} />
          <Input
            label={"Friend's email address"}
            customStyles={{ container: styles.inputCustomStyles }}
          />

          <Button btnTitle={'Send invite'} />
        </View>
      </View>
    )
  }

  const renderHowWorksContent = () => {
    return (
      <View style={styles.contentMargin}>
        <Text smallRegular color={orderDarkGray} style={styles.heading}>
          How it works
        </Text>
        <View style={styles.innerOfferContainer}>
          <Text color={darkGray} lineHeight={20}>
            Do you like what we’re doing? Help us grow by inviting your friends
            to give us a try with a ฿500 voucher. When they use it, you’ll
            automatically get ฿500 in store credit too.
          </Text>
          <Button
            onPress={() => onShareLink()}
            btnTitle={'Share your invite link'}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AccountHeader
        title={'Refer-a-friend program'}
        backArrow
        backPress={() => onBackPress()}
      />
      <View style={styles.body}>
        <KeyboardAvoidingView
          behavior={IS_IOS ? 'position' : 'padding'}
          style={styles.avodingView}
          keyboardVerticalOffset={IS_IOS ? 20 : 0}
        >
          <ScrollView>
            {renderOfferContent()}
            {renderHowWorksContent()}
            {renderInputContent()}

            <TouchableOpacity
              style={styles.footer}
              activeOpacity={0.8}
              onPress={() => {
                setShowModal(!showModal)
                setIsAnyPopupOpened(true)
              }}
            >
              <Text color={darkGray}>
                Please see the <Text color={green}>Terms of Use.</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        {showModal && (
          <View style={styles.modalContain}>
            <PopupModal
              heading={'Refer-a-friend: Terms of Use'}
              content={PupupContent}
              showPrivacyModal={showModal}
              setShowPrivacyModal={() => {
                setShowModal(!showModal)
                setIsAnyPopupOpened(false)
              }}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default ReferAFriend
