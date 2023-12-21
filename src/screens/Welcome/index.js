import React, { useState } from "react";
import { Dimensions, View, Text, Image, StatusBar } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../components";
import { appColors, appImages } from "../../theme";
import styles from "./Styles";
import { LinearGradient } from 'expo-linear-gradient';

const Welcome = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [sliderState, setSliderState] = useState({ currentPage: 0});
  const { width, height } = Dimensions.get('window');
  onSignIn = () => {
    navigation.navigate('login');
  }

  onCreateAccount = () => {
    navigation.navigate('signUp', { from: 'welcome'});
  }

  setSliderPage = (event) => {
    const { currentPage } = sliderState;
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  }

  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={appColors.headerBgColor}
      />
      <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
        <ScrollView
          style={styles.body}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            setSliderPage(event);
          }}>
          <View style={[{ width, height }, {backgroundColor: appColors.darkRed}]}>
            <Image source={appImages.whiteLogo} style={styles.logoImage} />
            <View style={[styles.wrapper, { marginBottom: insets.bottom}]}>
              <View>
                <Text style={styles.welcomeTitle}>Welcome to</Text>
                <Text style={styles.welcomeTitle}>Paleo Robbie!</Text>
              </View>
              <Text style={styles.introText}>
                We're Bangkok's <Text style={styles.textBold}>better-for-you</Text> grocery store.
              </Text>
              <Text style={styles.introText}>
                Our promise to you is that you won’t find anything artificial, heavily processed, or factory-farmed in our grocery or prepared meals - because we believe <Text style={styles.textBold}>real food</Text> is better for your body, your tastebuds, and the planet.
              </Text>
              <Text style={styles.introText}>
                Swipe right to see how it works.
              </Text>
            </View>
          </View>
          <View style={[{ width, height }]}>
            <Image source={appImages.welcome1} style={styles.sliderImage}/>
            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(75, 0, 0, 0.9)']} locations={[0.3164, 1.0]} style={styles.welcomeTextBackground} />
            <View style={[styles.wrapper, { marginBottom: insets.bottom}]}>
              <Image source={appImages.welcomeOverlay1} style={styles.overlayImage1} />
              <Text style={styles.introTitle}>
                Shop the grocery.
              </Text>
              <Text style={styles.introText}>
                1,000+ everyday groceries, 0 artificial ingredients. We obsess over quality so you don’t have to.
              </Text>
            </View>
          </View>
          <View style={[{ width, height }]}>
            <Image source={appImages.welcome2} style={styles.sliderImage}/>
            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(75, 0, 0, 0.9)']} locations={[0.3164, 1.0]} style={styles.welcomeTextBackground} />
            <View style={[styles.wrapper, { marginBottom: insets.bottom}]}>
              <Image source={appImages.welcomeOverlay2} style={styles.overlayImage2} />
              <Text style={styles.introTitle}>
                {'Don’t feel like cooking? Pick up a ' + '\n' + 'Fresh Meal.'}
              </Text>
              <Text style={styles.introText}>
              Fully prepared meals & sides, made fresh daily. Pick from our rotating menu or build your own.
              </Text>
            </View>
          </View>
          <View style={[{ width, height }]}>
            <Image source={appImages.welcome3} style={styles.sliderImage}/>
            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(75, 0, 0, 0.9)']} locations={[0.3164, 1.0]} style={styles.welcomeTextBackground} />
            <View style={[styles.wrapper, { marginBottom: insets.bottom}]}>
              <Image source={appImages.welcomeOverlay1} style={styles.overlayImage3} />
              <Text style={styles.introTitle}>
                Pick a delivery time and get your food!
              </Text>
              <Text style={styles.introText}>
                Same day delivery is available for orders before 6pm (except our Fresh Meals).
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={[styles.paginationWrapper, { marginBottom: insets.bottom }]}>
          {Array.from(Array(4).keys()).map((key, index) => (
            <View style={[styles.paginationDots, { opacity: sliderState.currentPage === index ? 1 : 0.2 }]} key={index} />
          ))}
        </View>
        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <Button btnTitle={'Sign in'} style={[styles.signinButton]} textStyle={styles.signinButton} onPress={onSignIn}>
            </Button>
          </View>
          <View style={styles.footerButton}>
            <Button btnTitle={'Create account'} style={[styles.createAccButton]} textStyle={styles.createAccButton} onPress={onCreateAccount}></Button>
          </View>
        </View>
      </SafeAreaView>
    </>

  )
}

export default Welcome;