import React, { useState, useContext } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Animated,
} from "react-native";
import helpers from "../../helpers";
const { number_format, get_thumbnail, hapticFeedback } = helpers;
import styles, { detailsTextStyles } from "./Styles";
import { appColors, appImages, appMetrics } from "../../theme";
import { Text, Button, PopupModal, Reviews } from "../../components/";
import HTMLView from "react-native-htmlview";
import FastImage from "react-native-fast-image";
const {
  textDarkGray,
  black,
  accountSettingGray,
  white,
  freshGreen,
  quantityGreen,
  addressGrey,
  greenButtonOpacity,
} = appColors;

import AppContext from "../../provider";
const { close, question_ic } = appImages;
import Carousel, { Pagination } from "react-native-snap-carousel";

const { screenWidth } = appMetrics;
const PupupContent = `Pretty big! \n\nOur Regular size meals come in 800ml BPA-free Tupperwares and contain a generous amount of protein. For our wild fish dishes, the portion weighs in at about 150g, and for the pastured meat dishes the portion is around 180 grams.
\nFor the Jumbo size, you can expect a 1200ml Tupperware with fish and meat portions that are 50% larger, so about 230g of wild fish and 270g of pastured meats. Some dishes that are more meat-heavy, e.g. chili con carne, can contain much more than these amounts. Many of our customers purchase our Jumbo meals to split with a partner or their family.
\nIf you ever have questions about a particular meal, please don’t hesitate to ask us.
\nFor the Build your Own meals, the protein portions are given in the menu, and you can choose to order double the protein portion if you like.`;

const FreshMealsDetails = (props) => {
  const {
    navigation,
    setShowFreshDetailsModal,
    selectedFreshMealsObj,
    addToCart,
  } = props;

  const {
    image,
    sale_price,
    description,
    ecom_title,
    ecom_subtitle,
    nutrition_id,
    jumbo,
    reviews,
    groups,
    regularPrice,
    specialBigItemsArray,
    image_app,
    images,
    regularCalories,
    regularLipid,
    regularProtein,
    regularCarbohydrt,
  } = selectedFreshMealsObj;
  console.log("selectedFreshMealsObj--", selectedFreshMealsObj);
  const scrollRef = React.useRef();
  const [showModal, setShowModal] = useState(false);
  const [isJumbo, setIsJumbo] = useState(jumbo);
  const [xTabOne, setxTabOne] = useState(0);
  const [xTabTwo, setxTabTwo] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const [translateX, setTranslateX] = useState(
    new Animated.Value(jumbo ? 0 : 45)
  );
  const {
    setIsAddToOrderPopup,
    setIsAddressNotificationShowing,
    setIsNotificationShowing,
    setIsAnyPopupOpened,
    cartData,
    isAnyApiLoading,
    mealsCartData,
    loginData
  } = useContext(AppContext);
  
  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
    var { contact_id } = accountInfo;
    var { default_address_id, addresses } = contact_id;
  } else {
    var user_id = null;
    var token = null;
  }

  const handleSlide = (type, index) => {
    Animated.spring(translateX, {
      toValue: type,
      duration: 100,
      useNativeDriver: true,
    }).start();

    setIsJumbo(!isJumbo);
  };

  const renderTab = () => {
    const { calories, carbohydrt_g, protein_g, lipid_tot_g } = nutrition_id || {};
    return (
      <View style={styles.tabsRow}>
        <View style={styles.tab}>
          <Text smallRegular condensed color={freshGreen}>
            {parseInt(isJumbo ? regularCalories : calories) + " calories"}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.tab}>
          <Text smallRegular condensed color={freshGreen}>
            {parseInt(isJumbo ? regularLipid : lipid_tot_g) + "g fat"}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.tab}>
          <Text smallRegular condensed color={freshGreen}>
            {parseInt(isJumbo ? regularProtein : protein_g) + "g protein"}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.tab}>
          <Text smallRegular condensed color={freshGreen}>
            {parseInt(isJumbo ? regularCarbohydrt : carbohydrt_g) + "g carbs"}
          </Text>
        </View>
      </View>
    );
  };

  const renderTextContent = () => {
    let htmlContent = description;
    htmlContent = "<div>" + htmlContent + "</div>";
    return (
      <View style={styles.textContainer}>
        <View style={styles.badgesRow}>
          {checkGroups("126", groups) && (
            <View style={styles.fromRedContainer}>
              <Text minSmall condensed color={white}>
                SPICY
              </Text>
            </View>
          )}

          {checkGroups("117", groups) && (
            <View style={styles.fromKetoContainer}>
              <Text minSmall condensed color={white}>
                KETO
              </Text>
            </View>
          )}
           {(reviews && user_id == 12272) &&
            <Reviews reviews={reviews} from="details"/>
          }
          {checkGroups("266", groups) && (
            <View style={styles.fromContainer}>
              <Text minSmall condensed color={white}>
                LOCAL
              </Text>
            </View>
          )}
        </View>
        <Text
          minTitle
          condensedBold
          color={black}
          style={styles.textMargin}
          lineHeight={25}
        >
          {ecom_title}
        </Text>
        <Text condensed color={black} style={styles.padding} largeRegularPlus>
          {ecom_subtitle}
        </Text>

        {renderTab()}

        <View style={styles.textSubContainer}>
          {/* <Text
            condensedBold
            color={black}
            regularPlus
            lineHeight={24}
            style={styles.detailsText}
          >
            Description
          </Text>
          <Text color={darkGray} lineHeight={20}>
            {cleandescriptionText}
          </Text> */}

          <HTMLView value={htmlContent} stylesheet={detailsTextStyles} />
        </View>
      </View>
    );
  };

  const selectQuantity = (obj) => {
    const { sale_max_qty, code } = selectedFreshMealsObj;

    if (sale_max_qty && obj.quantity > sale_max_qty) {
      alert("You can add maximum" + sale_max_qty + "products");
      return;
    }

    selectedFreshMealsObj.quantity = obj.quantity;

    if (true) {
      const cartArray = Object.assign([], cartItems);
      let itemIndex = 0;
      const cartFilteredArray = cartArray.filter((x, i) => {
        if (x.code == code) {
          itemIndex = i;
          return x;
        }
      });

      if (cartFilteredArray.length == 0) {
        const randomstr = Math.random().toString(36).substr(2, 5);
        const itemObj = Object.assign({}, { ...selectedFreshMealsObj, randomstr });
        cartArray.push(itemObj);

        setCartItems(cartArray);
      } else {
        cartArray[itemIndex].quantity =
          cartArray[itemIndex].quantity + obj.quantity;

        //cartArray.map((obj) => cartFilteredArray[0])
        setCartItems(cartArray);
      }
    }
  };

  const checkGroups = (id, groups) => {
    if (groups && groups.length > 0) {
      const filtered = groups.filter((x) => x == id);

      if (filtered.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const getItemQuantity = (item) => {
    console.log("mealsCartData", mealsCartData);
    if (mealsCartData) {
      const items = mealsCartData.lines;
      if (items && items.length) {
        const cartFilteredArray = items.filter((x, i) => {
          if (x.product_id.id == item.docId) {
            return x;
          }
        });

        if (cartFilteredArray.length > 0) {
          let quantity = 0;
          for (let index = 0; index < cartFilteredArray.length; index++) {
            quantity = quantity + cartFilteredArray[index].qty;
          }
          return quantity;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };
  const renderJumbo = () => {
    return (
      <View style={styles.sizeRow}>
        <Animated.View
          style={[
            styles.animatedView,
            {
              width: isJumbo ? 45 : 45,
              left: 1,
              transform: [
                {
                  translateX: translateX,
                },
              ],
            },
          ]}
        />

        <TouchableOpacity
          disabled={isJumbo}
          onLayout={(event) => {
            setxTabOne(event.nativeEvent.layout.x - 2);
          }}
          style={[styles.jumboBnt]}
          onPress={() => {
            handleSlide(xTabOne, 0);
          }}
        >
          <Text
            bold={isJumbo}
            tiny
            color={isJumbo ? white : accountSettingGray}
          >
            {"Regular"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!isJumbo}
          onLayout={(event) => {
            setxTabTwo(event.nativeEvent.layout.x - 2);
          }}
          onPress={() => {
            handleSlide(xTabTwo, 1);
          }}
          style={[styles.jumboBnt, {}]}
        >
          <Text
            bold={!isJumbo}
            tiny
            color={isJumbo ? accountSettingGray : white}
          >
            {"Jumbo"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderAddToCart = () => {
    return (
      <View style={styles.cartContainer}>
        <View>
          {renderJumbo()}
          <TouchableOpacity
            style={styles.qRow}
            onPress={() => {
              setShowModal(!showModal);
              setIsAnyPopupOpened(false);
            }}
          >
            <Image source={question_ic} style={styles.qImg} />

            <Text small color={addressGrey}>
              See portions information
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnrow}>
          <View style={styles.itemPrice}>
            <Text condensedBold color={black} largeRegularPlus>
              {isJumbo
                ? "฿" + number_format(regularPrice, "0,0")
                : "฿" + number_format(sale_price, "0,0")}
            </Text>
            <Text color={textDarkGray} tiny bold>
              {"EX VAT"}
            </Text>
          </View>
          <Button
            disabled={isAnyApiLoading}
            onPress={() => {
              // setIsAddToOrderPopup(true)

              // setIsAddressNotificationShowing(false)
              // setIsNotificationShowing(true)

              hapticFeedback();
              const previousQuantity = getItemQuantity(selectedFreshMealsObj);
              addToCart({...selectedFreshMealsObj, jumbo: isJumbo}, 1, previousQuantity);
            }}
            btnTitle={
              isAnyApiLoading
                ? "Adding..."
                : getItemQuantity(selectedFreshMealsObj) > 0
                ? "Add another"
                : "Add to cart"
            }
            style={[styles.cartBtn, {}]}
          />
        </View>
      </View>
    );
  };

  const dataImage = images.length == 0 ? [image_app] : [image_app, ...images.map(i => i.image)];

  const renderTopHeader = (item) => {
    return (
      <View>
        <FastImage
          source={{
            uri: get_thumbnail(item, 512),
          }}
          style={styles.itemImg}
        ></FastImage>
      </View>
    );
  };

  const dotPagination = () => {
    return (
      <Pagination
        dotsLength={dataImage.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.dotMainContainer}
        dotContainerStyle={styles.dotContainerStyle}
        dotStyle={styles.activeDot}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <ScrollView ref={scrollRef} bounces={true}>
          <View style={styles.imgSection}>
            <View>
              <View>
                <Carousel
                  loop={false}
                  showsHorizontalScrollIndicator={false}
                  autoplay={false}
                  containerCustomStyle={styles.carouselContainer}
                  data={dataImage}
                  renderItem={({ item, index }) => renderTopHeader(item)}
                  sliderWidth={screenWidth}
                  itemWidth={screenWidth}
                  onSnapToItem={(index) => {
                    setActiveSlide(index);
                  }}
                ></Carousel>
                {dotPagination()}
              </View>
            </View>
          </View>
          {renderTextContent()}
          <View style={styles.bottomContent}></View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            setShowFreshDetailsModal(false);

            //  navigation.goBack()
          }}
          style={styles.crossContainer}
        >
          <Image source={close} style={styles.crossImg} />
        </TouchableOpacity>
        {renderAddToCart()}
      </View>

      {showModal && (
        <View style={styles.modalContain}>
          <PopupModal
            heading={"How big are our portions?"}
            content={PupupContent}
            showPrivacyModal={showModal}
            contentHeight={514}
            setShowPrivacyModal={() => {
              setShowModal(!showModal);
              setIsAnyPopupOpened(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default FreshMealsDetails;
