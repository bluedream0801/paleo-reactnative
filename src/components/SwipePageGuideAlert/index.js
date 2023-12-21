import { React } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { appColors, appImages } from '../../theme';
import Text from '../Text';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 10
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.blueOpacity,
    borderRadius: 5,
    shadowColor: '#05253F',
    shadowOpacity: 0.29,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 13,
    paddingHorizontal: 15,
    paddingVertical: 8
  },
  icon: {
    height: 25,
    width: 29,
    marginLeft: 8,
    resizeMode: 'contain'
  }
});

const SwipePageGuideAlert = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text color={appColors.notifyBlue}>
          Swipe right or left to browse subcategories
        </Text>
        <Image source={appImages.iconSwipteHandGesture} style={styles.icon}/>
      </View>
    </View>
  )
}

export default SwipePageGuideAlert;