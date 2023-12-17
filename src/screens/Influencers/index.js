import React, { useContext, useRef, useEffect, useCallback } from "react";
import { View, TouchableOpacity, FlatList, Image } from "react-native";
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import styles from "./Styles";
import AppContext from "../../provider";
import helpers from "../../helpers";
import { appColors, appImages } from "../../theme";
import { AccountHeader, Text } from "../../components";
import Services from "../../services";
const { API } = Services;

const { darkGray, white, orderDarkGray } = appColors;
const { overlay } = appImages;
const { get_thumbnail } = helpers;

const Influencers = (props) => {
  const { navigation } = props;
  
  const { setIsApiLoaderShowing, loginData, setCartData, updateCartId,  setMealsCartData } = useContext(AppContext);
  
  const scrollRef = useRef();
  
  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
  } else {
    var user_id = null;
    var token = null;
  }
  // This now also loads whatever carts we have when the first is first focused
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        if (loginData) {
          console.log('accountInfo',accountInfo.contact_id.id);
          console.log('Current Carts',global.cartId,global.mealsCartId);
          await API.check_latest_carts(accountInfo.contact_id.id,  setCartData, updateCartId, setMealsCartData, 'normal', { token, user_id },'grocery_initial_cart_load');
          // await API.check_latest_carts(accountInfo.contact_id.id, setCartData, updateCartId, setMealsCartData, setMealsCartId, { token, user_id });
        } else {
          console.log('User not logged in - just checking his cart');
          await API.check_latest_carts_no_login(setCartData, updateCartId, setMealsCartData, 'normal', { token, user_id },'grocery_initial_cart_load');
          // await API.check_latest_carts_no_login(setCartData, updateCartId, setMealsCartData, setMealsCartId, { token, user_id });
        }
      }
      fetchData();
    }, [])
  );
  
  const influencers = global.categoriesArray
    .filter((item) => item[1].feature_image || item[1].other_image)
    .map((item) => item[1]);
    
  const featured = influencers
    .filter((item) => item.feature_image)
    .sort((a, b) => a.sequence - b.sequence)
    .shift();
    
  const others = influencers
    .filter((item) => item.id !== featured.id && item.other_image)
    .sort((a, b) => a.sequence - b.sequence);

  if (others.length % 2 === 1) {
    others.push({});
  }
  
  /*
  const onBackPress = () => {
    navigation.goBack();
  };
  */
  
  const onBackPress = () => {
    navigation.navigate('Market');
  };

  const onPressItem = (obj, isFeature) => {
    analytics().logEvent(`lists_click_${obj.code}`);
    navigation.navigate("InfluencerDetails", { influencer: obj, isFeature });
  };

  // Rendering of categories on Main Market Page
  const renderListItem = (obj, index) => {
    const { other_headline, other_image, other_body } = obj;

    return (
      <TouchableOpacity
        onPress={() => {
          onPressItem(obj, false);
        }}
        style={[
          styles.cell,
          {
            marginRight: index % 2 == 0 ? 5 : 10,
            marginLeft: index % 2 !== 0 ? 5 : 10,
            marginBottom: 10,
          },
        ]}
      >
        {other_image && (
          <View
            style={{
              backgroundColor: white,
            }}
          >
            <FastImage
              source={{ uri: get_thumbnail(other_image, 256) }}
              style={styles.cellImg}
            />
            <View style={[styles.cellText]}>
              <Text
                smallRegular
                condensedBold
                style={styles.cellTitle}
                color={darkGray}
                lineHeight={17}
                numberOfLines={1}
              >
                {other_headline}
              </Text>
              <Text
                smallRegular
                color={darkGray}
                lineHeight={17}
                numberOfLines={3}
              >
                {other_body}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const ListHeaderComponent = () => {
    const { feature_headline, feature_image, feature_body } = featured;
    const imageUrl = get_thumbnail(feature_image);

    return (
      <View style={styles.headerCell}>
        <TouchableOpacity
          onPress={() => {
            onPressItem(featured, true);
          }}
        >
          <FastImage source={{ uri: imageUrl }} style={styles.headerImg}>
            <Image source={overlay} style={styles.headerOverlay} />
            <View style={[styles.cellText, styles.headerText]}>
              <Text
                largeRegularPlus
                condensedBold
                style={styles.cellTitle}
                color={white}
                lineHeight={25}
                numberOfLines={1}
              >
                {feature_headline}
              </Text>
              <Text
                smallRegular
                color={white}
                lineHeight={17}
                numberOfLines={3}
              >
                {feature_body}
              </Text>
            </View>
          </FastImage>
        </TouchableOpacity>
        <Text
          smallRegular
          color={orderDarkGray}
          lineHeight={19}
          numberOfLines={1}
          style={styles.allLabel}
        >
          More lists from our friends
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AccountHeader
        title={"Lists from our friends"}
        backArrow
        backPress={() => onBackPress()}
      />
      <View style={styles.body}>
        {influencers.length > 0 && (
          <FlatList
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={others}
            numColumns={2}
            renderItem={({ item, index }) => renderListItem(item, index)}
            ListHeaderComponent={ListHeaderComponent()}
          />
        )}
      </View>
    </View>
  );
};

export default Influencers;
