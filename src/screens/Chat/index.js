import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
  Keyboard,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Dimensions,
  Modal,
} from 'react-native'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import styles from './Styles'
import AppContext from '../../provider'
import { AccountHeader, Text, Button, Input } from '../../components'
import { appFonts, appColors, appImages, appMetrics } from '../../theme'

const {
  accountSettingGray,
  orderDarkGray,
  buttonOpacity,
  black,
  blackOpacity,
  white,
} = appColors
const { IS_IOS } = appMetrics
const {
  support_img,
  close,
  chat_food_img,
  chat_send_ic,
  chat_file_ic,
} = appImages
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import NetInfo from '@react-native-community/netinfo'
import ImageViewer from 'react-native-image-zoom-viewer'
const Cart = (props) => {
  const { navigation } = props
  const { setIsKeyBoardOpen } = useContext(AppContext)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [isZoomImage, setIsZoomImage] = useState(false)

  const onBackPress = () => {
    navigation.goBack()
  }

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        setMessages([
          {
            _id: 4,
            text: 'I need help to find the correct address',
            time: 'Mon 08:06',
            createdAt: new Date(),
            image: chat_food_img,
            user: {
              _id: 2,

              name: '',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },

          {
            _id: 3,
            text:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel tincidunt lorem, eget elementum nunc. Praesent quis mi sapien. Maecenas vestibulum nibh in elit eleifend suscipit. Vestibulum et sapien tincidunt, elementum est ut, laoreet libero.',
            createdAt: new Date(),
            time: 'Mon 08:05',
            user: {
              _id: 1,
              name: 'Support',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
          {
            _id: 2,
            text: 'I need help to find the correct \naddress',
            createdAt: new Date(),
            time: ' Mon 08:04',
            user: {
              _id: 2,
              name: '',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
          {
            _id: 1,
            text: 'Hello! welcome to PaleoRobbie.\nHow can we help?',
            createdAt: new Date(),
            time: 'Mon 08:03',
            user: {
              _id: 1,
              name: 'Support',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
        ])
      } else {
        setMessages([
          {
            _id: 1,
            text:
              'Please leave us a message and we will respond as soon as possible.\n\nOur normal business hours are 9am-6pm (Mon-Sat), and closed on Sundays. ',
            createdAt: new Date(),
            time: 'Mon 09:03',
            offline: true,
            user: {
              _id: 1,
              name: 'Support',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
        ])
      }
    })
  }, [])
  const images = [
    {
      url: '',
      props: {
        // Or you can set source directory.
        source: chat_food_img,
      },
    },
  ]
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])
  const renderZoomImage = () => {
    return (
      <Modal
        visible={true}
        transparent={true}
        onRequestClose={() => setIsZoomImage(!isZoomImage)}
      >
        <ImageViewer
          imageUrls={images}
          backgroundColor={blackOpacity}
          renderIndicator={() => null}
          enableSwipeDown={true}
          onSwipeDown={() => {
            setIsZoomImage(!isZoomImage)
          }}
        />
        <TouchableOpacity
          style={styles.closeZoomImgTouch}
          onPress={() => {
            setIsZoomImage(!isZoomImage)
          }}
        ></TouchableOpacity>
      </Modal>
    )
  }

  const renderInputToolbar = (props) => {
    const { text, messageIdGenerator, user, onSend, messages } = props
    return (
      <View style={styles.tootlBar}>
        <Input
          {...props}
          autoCorrect={false}
          customStyles={{ container: styles.customStyles }}
          inputViewStyle={styles.customViewStyles}
          inputStyle={styles.input}
          value={messageText}
          multiline={true}
          onChangeText={(text) => setMessageText(text)}
        />
        <TouchableOpacity>
          <Image style={styles.fileIc} source={chat_file_ic} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={messageText.trim().length == 0}
          onPress={() => {
            onSend([
              {
                _id: 5,
                text: messageText,
                createdAt: new Date(),
                user: {
                  _id: 1,
                  name: 'Support',
                  avatar: 'https://placeimg.com/140/140/any',
                },
              },
            ])
            setMessageText('')
          }}
        >
          <Image style={styles.sendIc} source={chat_send_ic} />
        </TouchableOpacity>
      </View>
    )
  }

  const rederLeftMessage = (props) => {
    const { currentMessage } = props
    const { user, text, time, offline } = currentMessage
    const { _id } = user
    return (
      <View
        style={[
          styles.messageContainer,
          { marginTop: currentMessage._id == 1 ? 20 : 0 },
        ]}
      >
        <Image source={support_img} style={styles.doubleCheck} />
        <View style={styles.mainTextContainer}>
          <View style={styles.statusContainer}>
            <Text smallRegular color={accountSettingGray}>
              Support
            </Text>
            {!offline && <View style={styles.greenDot} />}
          </View>
          <View style={styles.messageTextContainer}>
            <Text regularPlus color={accountSettingGray}>
              {text}
            </Text>
          </View>
          <Text small color={orderDarkGray} style={styles.time}>
            {time}
          </Text>
        </View>
      </View>
    )
  }

  const renderRightMessage = (props) => {
    const { currentMessage } = props
    const { user, text, image, time } = currentMessage
    const { _id } = user
    return (
      <View style={styles.messageRightContainer}>
        {image ? (
          <TouchableOpacity
            style={styles.mainRightTextContainer}
            onPress={() => setIsZoomImage(!isZoomImage)}
          >
            <Image style={styles.chatImg} source={chat_food_img} />
            <Text small color={orderDarkGray} style={styles.time}>
              {time}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.mainRightTextContainer}>
            <View style={styles.messageRightTextContainer}>
              <Text regularPlus color={white}>
                {text}
              </Text>
            </View>
            <Text small color={orderDarkGray} style={styles.time}>
              {time}
            </Text>
          </View>
        )}
      </View>
    )
  }

  const customSystemMessage = (props) => {
    console.log('props', props)
    const { currentMessage } = props
    const { user, text } = currentMessage
    const { _id } = user
    return (
      <View style={styles.chatContainer}>
        {_id == 1 ? rederLeftMessage(props) : renderRightMessage(props)}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AccountHeader
        title={'Customer support'}
        backPress={() => onBackPress()}
        crossBtn={close}
      />

      {isZoomImage && renderZoomImage()}
      <View style={styles.body}>
        <GiftedChat
          contentContainerStyle={{ justifyContent: 'flex-end' }}
          renderMessage={(props) => customSystemMessage(props)}
          textInputStyle={styles.textInputStyle}
          placeholder={'Type a message'}
          messages={messages}
          alignTop={true}
          autoCorrect={false}
          bottomOffset={getBottomSpace()}
          keyboardShouldPersistTaps="never"
          onSend={(messages) => onSend(messages)}
          renderInputToolbar={(props) => renderInputToolbar(props)}
          user={{
            _id: 1,
          }}
        />
      </View>
    </View>
  )
}

export default Cart
