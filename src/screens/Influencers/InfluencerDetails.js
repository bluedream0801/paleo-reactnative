import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, SectionList, Pressable } from "react-native";
import analytics from '@react-native-firebase/analytics';
import FastImage from "react-native-fast-image";
import Modal from "react-native-modal";
import helpers from "../../helpers";
import Services from "../../services";
const { API } = Services;
const {
  get_thumbnail,
  isShowOutOfStockBadge,
  number_format,
  getSlotsForDelivery,
  getTimeSlotForDeliveryDisplay,
  getCartType,
  isSingleDayDelivery,
  onchange_time_slot,
} = helpers;
import styles from "./Styles";
import { appColors } from "../../theme";
import { Text, MarketHeader } from "../../components";
import PickupTimeSlot from "../PickupTimeSlot";
import AppContext from "../../provider";
const { black, accountSettingGray, addressGrey, transparent } = appColors;
import provider from "../../firebase/ProductsProvider";
const { getProductsData } = provider;

import ProductQuantityEdit from "../Products/ProductQuantityEdit";
import ProductDetails from "../ProductDetails";
const { commentIcon, upArrow, downArrow } = appImages;

const InfluencerDetails = (props) => {
  const { navigation, route } = props;
  const { influencerId } = route.params;
  const [influencer, setInfluencer] = useState(route.params.influencer || {});
  const {
    setIsApiLoaderShowing,
    addToCart,
    cartData,
    mealsCartData,
    isAnyApiLoading,
    setIsAnyApiLoading,
    setMealsCartData,
    setCartData,
    loginData
  } = useContext(AppContext);

  if (loginData) {
    var { token, user_id } = loginData;
  } else {
    var user_id = null;
    var token = null;
  }
  const [sectionList, setSectionList] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductObj, setSelectedProductObj] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const selectedDateSlotString = getTimeSlotForDeliveryDisplay(
    cartData,
    mealsCartData
  );

  useEffect(() => {
    if (influencer.id !== undefined) {
      generateSectionList(influencer);
    } else if (influencerId) {
      const found = global.categoriesArray.find(([_, item]) => String(item.id) === influencerId)
      if (found) {
        setInfluencer(found[1]);
        generateSectionList(found[1]);
      }
    }
  }, [global.categoriesArray]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const getPrice = (
    sale_invoice_uom_name,
    sale_price,
    sale_price_order_uom,
    old_sale_price
  ) => {
    if (sale_invoice_uom_name == "KG") {
      return <>{(old_sale_price) && <Text style={{ textDecorationLine: 'line-through' }}>~฿{number_format(old_sale_price, "0,0")}</Text>} ~฿{number_format(sale_price_order_uom, "0,0")}</>;
    } else {
      return <>{(old_sale_price) && <Text style={{ textDecorationLine: 'line-through' }}>฿{number_format(old_sale_price, "0,0")}</Text>} ฿{number_format(sale_price, "0,0")}</>;
    }
  };

  const generateSectionList = async (data) => {
    if (data && data.items?.length) {
      const productItems = await getProductsData( data.items.map((item) => item.product_id), setIsApiLoaderShowing);

      let sections = [];
      let oneSection = {};

      data.items.forEach((item) => {
        if (oneSection.headline) {
          sections.push(oneSection);
          oneSection = {
            headline: item.detail_header,
            body: item.detail_body,
            open: true,
            data: [],
          }
        } else {
          if (oneSection.data === undefined) {
            oneSection = {
              headline: item.detail_header,
              body: item.detail_body,
              open: true,
              data: [],
            }
          } else {
            if (item.detail_header) {
              oneSection.headline = item.detail_header;
              oneSection.body = item.detail_body;
            }
          }
        }

        const productItem = productItems.find((product) => product.id === item.product_id);
        oneSection.data.push(productItem);
      });

      sections.push(oneSection);

      sections = sections.map((section, index) => ({...section, index}));
      setSectionList(sections);
    }
  };

  const showProductDetails = async (product) => {
    const products = await getProductsData([product.id], setIsAnyApiLoading);
    if (products && products.length) {
      setSelectedProductObj(products[0]);
      setShowDetailsModal(true);
    }
  };

  const getItemQuantity = (item) => {
    if (cartData) {
      const items = cartData.lines;

      if (items && items.length > 0) {
        const cartFilteredArray = items.filter(
          (x) => x.product_id.id == item.id
        );

        if (cartFilteredArray.length > 0) {
          let quantity = 0;
          for (let index = 0; index < cartFilteredArray.length; index++) {
            quantity = quantity + cartFilteredArray[index].total_qty;
          }

          return quantity;
        }
      }
    }
    return 0;
  };

  const onSelectQuantity = (obj, quantity, callback) => {
    obj.quantity = quantity;

    // Only do quantity checks on Grocery items.
    // Maximum Quantity that can be ordered
    let max_qty = 999;
    if (obj.ecom_no_order_unavail) {
      max_qty = obj.stock_qty_avail;
    }

    if (obj.sale_max_qty && obj.sale_max_qty < max_qty) {
      max_qty = obj.sale_max_qty;
    }

    if (obj.quantity > max_qty) {
      alert("You can add maximum " + max_qty + " products");
      return;
    }

    if (
      (obj.quantity > max_qty || obj.stock_qty_avail < 0) &&
      obj.ecom_no_order_unavail == true
    ) {
      alert("No more products left in stock");
    } else {
      analytics().logEvent('lists_add_to_cart');
      addToCart(obj, obj.quantity, 'grocery_add_to_cart_app');
    }
  };

  const renderItem = ({ item: obj, index, section }) => {
    // Maximum Quantity that can be ordered
    let max_qty = 999;
    if (obj.ecom_no_order_unavail) {
      max_qty = obj.stock_qty_avail;
    }

    if (obj.sale_max_qty && obj.sale_max_qty < max_qty) {
      max_qty = obj.sale_max_qty;
    }

    return (
      <Pressable
        style={[
          styles.productCell,
          {
            borderBottomWidth: section.data.length == index + 1 ? 0 : 1,
            borderTopLeftRadius: index == 0 ? 5 : 0,
            borderTopRightRadius: index == 0 ? 5 : 0,
            borderBottomLeftRadius: section.data.length == index + 1 ? 5 : 0,
            borderBottomRightRadius: section.data.length == index + 1 ? 5 : 0,
          },
        ]}
        onPress={() => showProductDetails(obj)}
      >
        <View style={styles.row}>
          <View style={styles.imgContainer}>
            <FastImage
              source={{ uri: get_thumbnail(obj.image, 256) }}
              style={styles.favorites}
            />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.productName}>
              <Text extSmall color={accountSettingGray} numberOfLines={2}>
                {obj.name}
              </Text>
              <Text minSmall color={accountSettingGray}>
                {obj.sale_uom_id ? "per " + obj.sale_uom_id?.name : null}
              </Text>
            </View>
            <Text condensed color={black} style={styles.price}>
              {getPrice(
                obj.sale_invoice_uom_id.name,
                obj.sale_price,
                obj.sale_price_order_uom,
                obj.old_sale_price
              )}
            </Text>
          </View>
        </View>
        <Pressable
          style={{
            position: "absolute",
            right: 5,
            top: 5,
            bottom: 5,
            width: 63,
          }}
        >
          <ProductQuantityEdit
            isVertical={true}
            quantity={getItemQuantity(obj)}
            disabled={isAnyApiLoading}
            product_id={obj.docId}
            isOutOfStock={isShowOutOfStockBadge(
              obj.stock_qty_avail,
              obj.ecom_no_order_unavail,
              obj.sale_max_qty
            )}
            onSelectQuantity={(quantity, callback) => {
              onSelectQuantity(obj, quantity, callback);
            }}
            max_qty={max_qty}
            sale_qty_multiple={obj.sale_qty_multiple}
          />
        </Pressable>
      </Pressable>
    );
  };

  const onClickComment = (index) => {
    sectionList[index].open = !sectionList[index].open;
    setSectionList([...sectionList]);
  };

  const renderTop = () => {
    const image = influencer.feature_image;
    const headline = influencer.feature_headline;
    const body = influencer.feature_body;

    const imageUrl = get_thumbnail(image);

    return (
      <View style={styles.headerCell}>
        <FastImage
          source={{ uri: imageUrl }}
          style={styles.headerImg}
        ></FastImage>
        <View style={[styles.cellText, styles.headerText]}>
          <Text
            largeRegularPlus
            condensedBold
            style={styles.cellTitle}
            lineHeight={25}
            numberOfLines={1}
          >
            {headline}
          </Text>
          <Text smallRegular lineHeight={17}>
            {body}
          </Text>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { index } }) => {
    return <View>{!index && renderTop()}</View>;
  };

  const renderSectionFooter = ({
    section: { headline, body, open, index },
  }) => {
    const color = open ? accountSettingGray : addressGrey;
    const arrowIcon = open ? upArrow : downArrow;

    return (
      <View>
        {headline && body && (
          <TouchableOpacity
            onPress={() => {
              onClickComment(index);
            }}
            style={styles.commentFooter}
          >
            <View style={styles.textRow}>
              <FastImage
                source={commentIcon}
                style={styles.commentImg}
                tintColor={color}
              />
              <Text smallRegular color={color}>
                {headline}
              </Text>
              <FastImage
                source={arrowIcon}
                style={styles.arrowImg}
                tintColor={color}
              />
            </View>
            {open && (
              <Text small color={color} style={styles.commentDetails}>
                {body}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <MarketHeader
        calenderImg={true}
        onPressDropDown={() => {
          setShowModal(!showModal);
        }}
        title={selectedDateSlotString}
        backArrow
        backPress={() => onBackPress()}
      />
      <View style={styles.body}>
        <View style={styles.Inner}>
          {influencer.items?.length ? (
            <SectionList
              style={styles.listBody}
              sections={sectionList}
              keyExtractor={(item, index) => item.id + index}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              renderSectionFooter={renderSectionFooter}
              stickySectionHeadersEnabled={false}
            />
          ) : (
            renderTop()
          )}
        </View>
      </View>

      {showModal && (
        <PickupTimeSlot
          freshMeals={true}
          fromCart={false}
          mealsCartData={mealsCartData}
          cartData={cartData}
          cartType={getCartType(cartData, mealsCartData)}
          timeSlots={getSlotsForDelivery(cartData, mealsCartData)}
          splitTheDelivery={() => {}}
          isSingleDay={isSingleDayDelivery(cartData, mealsCartData)}
          heading={"Delivery times"}
          defaultDate={""}
          selectedSection={"none"}
          showModal={showModal}
          setSelectTimeSlot={(obj) => {
            global.freshMealsTimeSlotNew = obj;
            onchange_time_slot(cartData, mealsCartData, setMealsCartData, setCartData, obj.completeDate, obj.slotId, token, user_id, API);
          }}
          setShowPrivacyModal={() => {
            setShowModal(false);
          }}
        />
      )}

      <Modal
        style={{ margin: 0 }}
        testID={"modal"}
        swipeDirection={null}
        isVisible={showDetailsModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropColor={transparent}
        animationInTiming={400}
        animationOutTiming={300}
        backdropTransitionInTiming={1500}
        backdropTransitionOutTiming={1500}
        useNativeDriverForBackdrop
      >
        <ProductDetails
          navigation={navigation}
          productObj={Object.assign({}, selectedProductObj)}
          setShowDetailsModal={setShowDetailsModal}
          addToCart={addToCart}
        />
      </Modal>
    </View>
  );
};

export default InfluencerDetails;
