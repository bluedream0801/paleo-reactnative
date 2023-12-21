import React, { useContext } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { chatUs } from '../../helpers/contact';
import AppContext from '../../provider';
import { appColors, appImages, appMetrics } from "../../theme";
import Text from '../Text';

const styles = StyleSheet.create({
  chatSection: {
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: appColors.borderGrey,
    flexDirection: 'row',
    marginTop: appMetrics.doubleBaseMargin,
    padding: 6,
    marginHorizontal: 10,
  },
  smallChat: {
    width: 25,
    height: 20,
    resizeMode: 'contain',
  },
  helpText: {
    marginHorizontal: appMetrics.marginHorizontal,
  },
});
export const ChatUs = ({style}) => {
  const {
    chatAvailabilityStatus
  } = useContext(AppContext);
  return (
    <Pressable style={[styles.chatSection, style]} onPress={() => chatUs()}>
      <Image source={appImages.small_chat_ic} style={styles.smallChat} />
      <Text extSmall color={appColors.lessDarkGray} style={styles.helpText}>
        Need help? {chatAvailabilityStatus ? 'Chat with us.' : '' }
      </Text>
      <Text minSmall bold color={chatAvailabilityStatus ? appColors.sharpGreen : appColors.brightRed}>
        { chatAvailabilityStatus ? 'We are online' : `We’re offline - leave us a message` }
      </Text>
    </Pressable>
  )
}