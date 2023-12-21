import React from 'react';
import { Image, View, Dimensions } from 'react-native';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import Styles from './Styles';
import { appImages } from '../../theme';
import { Button, Text } from '../../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppTrackingPrompt = (props) => {
  const onContinue = async () => {
    const { status } = requestTrackingPermissionsAsync();
    if (status === 'granted') {
      console.log('User allowed app data tracking');
    }
    if (props.onContinue) {
      props.onContinue();
    }
  }

  const insets = useSafeAreaInsets();
  const { height: deviceHeight } = Dimensions.get('window');

  return (
    <View style={Styles.container}>
      <View style={Styles.mainContent}>
        <Image source={appImages.appTrackingPageLogo} style={{...Styles.imageLogo, marginTop: deviceHeight*0.13 + insets.top}}/>
        <Text largeTitlePlus condensedBold style={Styles.textTitle}>Help us help you!</Text>
        <View>
          <Text regular style={Styles.textDescription}>
            {'We need your permission to collect certain usage data, which really helps us grow with better app features & marketing.\n\n'
            + 'Growth helps us be able to offer even better products & pricing.' + '\n\n'
            + 'We promise to '}
            <Text regular style={Styles.textUnerline}>never</Text>
            <Text regular>{' sell this data or use it for anything other than the above.'}</Text>
          </Text>
        </View>
      </View>
      <Button btnTitle={'Continue'} style={Styles.btnContinue} onPress={() => onContinue()}></Button>
      <Text small style={Styles.textNotice}>{'You can make changes later in your Account settings.\nQuestions? Contact us about this anytime.'}</Text>
    </View>
  )
}

export default AppTrackingPrompt;