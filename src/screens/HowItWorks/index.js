import React, { useContext } from 'react';
import { View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AccountHeader, Text } from '../../components';
import AppContext from '../../provider';
import { appColors, appImages } from '../../theme';
import styles from './Styles';
import helpers from '../../helpers';

const ImageSectionHeader = (props) => {
  return (
    <View style={styles.imageSectionHeader}>
      <Image style={styles.imageHeader} source={props.image}/>
      <View style={styles.spacerView}></View>
      <View style={styles.textHeader}>
        <Text regularPlus condensedBold>{props.header}</Text>
        {!!props.subHeader && <Text regularPlus condensedBold>{props.subHeader}</Text>}
      </View>
    </View>
  )
}

const HowItWorks = ({navigation}) => {

  const {
    loginData,
  } = useContext(AppContext);
  
  
  onBackPress = () => {
    navigation.navigate('MyAccount');
  }

  navigateToContainerPickup = () => {
    if (loginData) {
      navigation.navigate('ScheduleContainer')
    } else {
      alert('You need to login in order to access this section.')
    }
  }

  navigateToFreshMeals = () => {
    navigation.navigate('MarketStack', {
      screen: 'FreshMeals',
      params: {
        fromHome: false,
        BYO: false,
      }
    })
  }

  return (
    <View style={styles.container}>
      <AccountHeader
        title={'How it works'}
        backArrow
        backPress={onBackPress}
      />
      <ScrollView style={styles.scrollContent}>
        <View style={[styles.section, { marginTop: 10 }]}>
          <Text regular style={[styles.textBlock]}><Text bold>Paleo Robbie</Text> is Bangkok’s better-for-you grocery store & meal delivery.</Text>
          <Text style={[styles.textBlock, { marginBottom: 15 }]}>
          Our promise to you is that you won’t find anything artificial, heavily processed, or factory-farmed in our grocery or meals - because we believe <Text bold>real food</Text> is best for your body, your tastebuds, and the planet.
          </Text>
        </View>
        <View style={styles.section}>
          <ImageSectionHeader image={appImages.aboutUs1} header={'1. Shop the grocery.'}/>
          <Text regular style={[styles.textBlock]}>
          We have a wide selection of everyday grocery goods, carefully curated to exclude artificial ingredients or other harmful stuff like antibiotics in meats & fish.
          </Text>
          <Text regular style={styles.textBlock}>
          We make many of our products ourselves, and we also source from trusted producers both locally and abroad.
          </Text>
        </View>
        <View style={styles.section}>
          <ImageSectionHeader image={appImages.aboutUs2} header={'2. Want to let us do the cooking?'} subHeader={'Add a fresh meal to your cart.'} />
          <Text regular style={[styles.textBlock]}>
            You can order freshly made meals 6 days per week (Monday-Saturday) and we’ll deliver them in BPA-free Tupperwares for easy reheating or storage.
          </Text>
          <Text regular style={styles.textBlock}>
            Just select from the <Text regular color={appColors.green} onPress={navigateToFreshMeals}>Fresh Meals section</Text> and add to your cart! Your meals are made to order, so they must be ordered before 8pm the night before your scheduled delivery.
          </Text>
          <View style={[styles.textBlock, styles.tipBlock]}>
            <Text bold smallRegular color={appColors.notifyBlue}>
              Tip: Meal planning?
            </Text>
            <Text extSmall color={appColors.notifyBlue}>
              You can schedule multiple meal deliveries over up to 6 days in advance on a single checkout (up to a week in advance) by simply changing the date before adding a new meal to your cart.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <ImageSectionHeader image={appImages.aboutUs3} header={'3. Pick a delivery time & get your food!'}/>
          <Text regular style={[styles.textBlock]}>
          Same-day delivery is available in Bangkok for orders made before 6pm. Some items, like our Meals, are only made when you order them, so same-day delivery is not available - you can order those up to 8pm the night before your delivery.
          </Text>
          <Text regular style={styles.textBlock}>
          For orders outside Bangkok, it is usually +2 days between order and delivery.
          </Text>
        </View>
        <View style={styles.section}>
          <ImageSectionHeader image={appImages.aboutUs4} header={'4. (Optional): Return your food'} subHeader={'containers for free.'}/>
          <Text regular style={[styles.textBlock]}>
          Help us reduce single-use food packaging! We will pick up your meal Tupperwares and delivery foam boxes for free on Fridays or Saturdays (Bangkok only). Just schedule a pickup <Text style={{textDecorationLine: 'underline'}} lineHeight={21} onPress={navigateToContainerPickup}>here.</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default HowItWorks;