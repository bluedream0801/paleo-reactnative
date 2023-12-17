import React from 'react';
import { View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AccountHeader, Text } from '../../components';
import { appColors, appImages } from '../../theme';
import styles from './Styles';

const DeliveryDetails = ({navigation}) => {
  onBackPress = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <AccountHeader
        title={'Delivery details'}
        backArrow
        backPress={onBackPress}
      />
      <ScrollView style={styles.scrollContent}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 20}}>
          <Text regular color={appColors.darkGray}>
          We deliver throughout the Bangkok area from 10am-8pm, except Sundays. Outside Bangkok? We’ll send most of our items nationwide with express delivery.
          </Text>
        </View>
        <View style={{ marginVertical: 10 }}>
          <Image style={styles.deliveryMapImg} source={appImages.deliveryMap} />
        </View>
        <View>
          <View style={[styles.deliveryPriceRow, { backgroundColor: 'rgba(234, 236, 238, 0.5)' }]}>
            <View style={[styles.textBlock, styles.hSeparator, styles.deliveryPriceLeftColumn]}>
              <Text regular condensedBold color={appColors.lessDarkGray}>
                Regular
              </Text>
              <Text regular condensedBold color={appColors.lessDarkGray}>
                orders
              </Text>
            </View>
            <View style={[styles.textBlock, styles.deliveryPriceRightColumn]}>
              <Text regular condensedBold color={appColors.lessDarkGray} style={{textAlign: 'center'}}>
                Fresh Meals menu items only
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.regionTextSection, {backgroundColor: '#F2E889'}]}>
          <Text smallRegular color={appColors.lessDarkGray}>
            Central Bangkok
          </Text>
        </View>
        <View style={[styles.deliveryPriceRow, { backgroundColor: 'rgba(242, 232, 137, 0.5)' }]}>
          <View style={[styles.textBlock, styles.deliveryPriceLeftColumn, styles.hSeparator, {borderRightColor: '#CCC687'}]}>
            <Text largeRegular condensedBold color={appColors.accountSettingGray}>
              ฿90
            </Text>
            <View style={[styles.badge, {backgroundColor: 'rgba(242, 232, 137, 0.6)', marginTop: 10}]}>
              <Text extSmall condensedBold color={'#272727'}>
                FREE for deliveries over  ฿1,500
              </Text>
            </View>
          </View>
          <View style={[styles.textBlock, styles.deliveryPriceRightColumn]}>
            <Text largeRegular condensedBold color={appColors.accountSettingGray}>
              ฿50
            </Text>
          </View>
        </View>
        <View style={[styles.regionTextSection, {backgroundColor: '#ADCFEE'}]}>
          <Text smallRegular color={appColors.lessDarkGray}>
            Outer Bangkok
          </Text>
        </View>
        <View style={[styles.deliveryPriceRow, { backgroundColor: 'rgba(173, 207, 238, 0.4)' }]}>
          <View style={[styles.textBlock, styles.deliveryPriceLeftColumn, styles.hSeparator, {borderRightColor: '#92BCE3'}]}>
            <Text largeRegular condensedBold color={appColors.accountSettingGray}>
              ฿180
            </Text>
            <View style={[styles.badge, {backgroundColor: 'rgba(173, 207, 238, 0.6)', marginTop: 10}]}>
              <Text extSmall condensedBold color={'#272727'}>
                FREE for deliveries over ฿2,500
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 6.5}}>
              <Text minSmall condensedBold>*฿80</Text>
              <Text minSmall color={'#272727'}> surcharge for deliveries from 4-8pm</Text>
            </View>
          </View>
          <View style={[styles.textBlock, styles.deliveryPriceRightColumn]}>
            <Text largeRegular condensedBold color={appColors.accountSettingGray}>
              ฿90
            </Text>
          </View>
        </View>
        <View style={[styles.regionTextSection, { backgroundColor: '#EAECEE', marginTop: 12}]}>
          <Text regular condensedBold style={{marginRight: 4}}>Nationwide</Text>
          <Text small>(Yes, including islands.)</Text>
        </View>
        <View style={[styles.textBlock, { marginBottom: 18, backgroundColor: '#F2F5F8'}]}>
          <Text largeRegular bold color={appColors.accountSettingGray}>
          ฿390
          </Text>
          <View style={[styles.badge, {backgroundColor: '#DBE0E5', marginTop: 10}]}>
            <Text extSmall condensedBold color={'#272727'}>
              FREE for deliveries over ฿7,500
            </Text>
          </View>
          <View style={{marginTop: 10, marginHorizontal: 20}}>
            <Text minSmall color={'#333330'} style={{textAlign: 'center'}}>We charge the same fee that our shipment partner Inter Express charges for nationwide frozen shipping. Your order will arrive in a well-insulated foam box.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default DeliveryDetails;