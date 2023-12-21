import React, { useState, useContext, useCallback } from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SectionList,
  Pressable,
} from 'react-native'
import analytics from '@react-native-firebase/analytics';
import moment from "moment";
import FastImage from 'react-native-fast-image'
import Modal from "react-native-modal";
import helpers from '../../helpers'
const { get_thumbnail, isShowOutOfStockBadge, hapticFeedback } = helpers
import styles from './Styles'
import { appColors } from '../../theme'
import { Text, TapGesture } from '../../components/'
import AppContext from '../../provider'
import Services from '../../services'
const { API } = Services
const {
  orderDarkGray,
  lessDarkGray,
  accountSettingGray,
  addressGrey,
  transparent
} = appColors
import provider from '../../firebase/ProductsProvider'
const { getProductsData } = provider

import { useFocusEffect } from '@react-navigation/native';
import ProductQuantityEdit from '../Products/ProductQuantityEdit';
import ProductDetails from '../ProductDetails';

const Reorder = (props) => {
  const { navigation } = props

  const {
    setIsApiLoaderShowing,
    loginData,
    addToCart,
    cartData,
    isAnyApiLoading,
    setIsAnyApiLoading,
    updateCartId,
  } = useContext(AppContext)

  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
  } else {
    var user_id = null;
    var token = null;
  }

  const [isHideFavorite, setIsHideFavorite] = useState(false)
  const [orderList, setOrderList] = useState([])
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductObj, setSelectedProductObj] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (loginData) {
        GetLatestOrdersProducts();
      }
    }, [])
  );

  const showProductDetails = async (product) => {
    const products = await getProductsData([product.id], setIsAnyApiLoading);
    if (products && products.length) {
      setSelectedProductObj(products[0]);
      setShowDetailsModal(true);
    }
  }

  const GetLatestOrdersProducts = async () => {
    try {
      var res = await API.execute(
        "sale.order",
        "search_read_path",
        [
          [
            ["contact_id", "=", accountInfo.contact_id.id],
            ["state", "=", "paid"],
            ["plr_order_type", "in", ["grocery","combined"]]
          ],
          [
            // Order fields
            "date",
            "number",
            "ecom_state",
            "plr_order_type",

             // Lines from Order Details
            "lines.product_id.name",
            "lines.product_id.code",
            "lines.product_id.image",

            // Lines from Grocery
            "lines.product_id.ecom_select_lot",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.ecom_notif_waiting",
            "lines.product_id.stock_qty_avail",
            "lines.product_id.old_sale_price",
            "lines.product_id.packing_size",
            "lines.product_id.sale_price",
            "lines.product_id.sale_price_order_uom",
            "lines.product_id.sale_invoice_uom_id.name",
            "lines.product_id.sale_uom_id.name",
            "lines.product_id.sale_tax_id",
            "lines.product_id.sale_max_qty",
            "lines.product_id.sale_qty_multiple",
            "lines.product_id.uom_id",
            "lines.product_id.product_origin",
            "lines.product_id.is_favorite",
            "lines.product_id.categ_id",
            "lines.product_id.sold_out",
            "lines.product_id.groups.name",
            "lines.product_id.groups.id",

          ],
        ],
        {
          order: "date desc, number desc",
          limit: 3,
        },
        setIsApiLoaderShowing
      );

      const orderList = res;
      // I recommend using something like this in the rendering
      // console.log('orderList',orderList);

      orderList.forEach((order) => {
        // console.log('line.product_id.code',order);
        order.data = order.lines
          .filter((line) => (line.product_id.code !== "DELIVERY" && line.product_id.code !== "VOUCHER" && line.product_id.code !== "STAFFGROCERIES" && line.product_id.code !== "STAFFVOUCHER" && line.product_id.categ_id !== 390 && line.product_id.categ_id !== 391 && line.product_id.categ_id !== 364 && line.product_id.categ_id !== 396 ))
          .map((line) => ({ ...line.product_id, docId: line.product_id.id, lineId: line.id }));
      });

      setOrderList(orderList);
      setIsHideFavorite(!!orderList.length);
    } catch (err) {
      console.log("err", err);
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

    if ((obj.quantity > max_qty || obj.stock_qty_avail<0) && (obj.ecom_no_order_unavail == true)){
      alert("No more products left in stock");
    } else {
      analytics().logEvent('reorder_addtocart');
      addToCart(obj, obj.quantity, 'grocery_add_to_cart_app');
    }

  }

  const onRepeatOrder = (order_id) => {
    console.log("repeat_order");
    // if (orderDetails.plr_order_type == "combined") {
      // alert("Some of your meals may no longer be on the menu, so we will re-create only your Grocery cart.");
      // var res = confirm("Some of your meals may no longer be on the menu, so we will re-create only your Grocery cart.");
    // } else {
      // alert("This will create a new shopping cart. Are you sure? (please note that not all items might be available and you’ll have to re-select a delivery time.");
      // var res = confirm("This will create a new shopping cart. Are you sure? (please note that not all items might be available and you’ll have to re-select a delivery time)");
    // }
    // if (!res)
      // return;
    copyToCart(order_id);
  }

  const copyToCart = async(order_id) => {
    console.log("repeat_order");

    var append_to_cart = global.cartId;
    console.log('append_to_cart',append_to_cart)

    await API.execute("sale.order","append_to_cart",
      [
        [order_id],
        [append_to_cart]
      ],
      {},
      setIsAnyApiLoading,
      {token, user_id}
      ).then(data=>{
        console.log("data from new cart", data);
        navigation.navigate('CartStack', { screen: 'Cart'})
        /*
        var cart_ids = data.cart_ids;
        if (!cart_ids)
          throw "Missing cart ID";
        console.log("data from new cart", data);
        if (data.grocery_cart_id.cart_id) {
          updateCartId(data.grocery_cart_id.cart_id);
          navigation.navigate('CartStack', { screen: 'Cart'})
        }
        */
        /*
        if (this.props.order_type == "meal") {
          console.log('New Cart ID',res.meal_cart_id.cart_id)
          NF.set_cookie("meal_cart_id", res.meal_cart_id.cart_id);
          NF.set_cookie("meal_cart_has_items",true);
          Router.push("/meal_checkout")
        } else if (this.props.order_type == "grocery") {
          console.log('New Cart ID',res.grocery_cart_id.cart_id)
          NF.set_cookie("grocery_cart_id", res.grocery_cart_id.cart_id);
          NF.set_cookie("grocery_cart_has_items",true);
          Router.push("/grocery_checkout")
        } else if (this.props.order_type == "combined") {
          console.log('New Cart ID',res.meal_cart_id.cart_id)
          console.log('New Cart ID',res.grocery_cart_id.cart_id)
          NF.set_cookie("grocery_cart_id", res.grocery_cart_id.cart_id);
          NF.set_cookie("meal_cart_id", res.meal_cart_id.cart_id);
          NF.set_cookie("grocery_cart_has_items",true);
          NF.set_cookie("meal_cart_has_items",true);
          Router.push("/combined_checkout")
        }
        */
    })
  }

  const renderNoFavorites = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setIsHideFavorite(!isHideFavorite)
        }}
      >
        <View style={styles.notFound}>
          <Text
            smallTitle
            condensedBold
            color={addressGrey}
            textAlign={'center'}
          >
            You have no recent orders.
          </Text>
          <Text
            regular
            textAlign={'center'}
            color={lessDarkGray}
            style={styles.marginText}
          >
            Here you’ll be able to shop items{'\n'} from your previous
            deliveries.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const renderItem = ({item: obj, index, section }) => {

    // Maximum Quantity that can be ordered
    let max_qty = 999;
    if (obj.ecom_no_order_unavail) {
      max_qty = obj.stock_qty_avail;
    }

    if (obj.sale_max_qty && obj.sale_max_qty < max_qty) {
      max_qty = obj.sale_max_qty;
    }

    return (
      <View>
        <TapGesture onSingleTap={() => showProductDetails(obj)}>
          <View
            style={[
              styles.cell,
              {
                borderBottomWidth: section.data.length == index + 1 ? 0 : 1,
                borderTopLeftRadius: index == 0 ? 5 : 0,
                borderTopRightRadius: index == 0 ? 5 : 0,
                borderBottomLeftRadius: section.data.length == index + 1 ? 5 : 0,
                borderBottomRightRadius: section.data.length == index + 1 ? 5 : 0
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
                <Text extSmall color={accountSettingGray}>
                  {obj.name}
                </Text>
                <Text minSmall color={accountSettingGray}>
                  {obj.sale_uom_id ? 'per ' + obj.sale_uom_id?.name : null}
                </Text>
              </View>
            </View>
          </View>
        </TapGesture>
        <Pressable style={{ position: 'absolute', right: 5, top: 5, bottom: 5, width: 110}}>
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
      </View>
    )
  }

  const getOrderDate = (date) => {
    let orderDate = moment(date).format("MMMM Do, YYYY").toString();

    return orderDate ? orderDate : " ";
  };

  const renderSectionHeader = ({section: {date, id}}) => {
    return (
      <View>
        <View style={styles.textRow}>
          <Text smallRegular color={orderDarkGray}>
            {getOrderDate(date)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              hapticFeedback();
              onRepeatOrder(id);
            }}
          >
            <Text small color={addressGrey}>
              Add all to cart
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.Inner}>
          {!isHideFavorite ? (
            renderNoFavorites()
          ) : (
            <SectionList
              style={styles.listBody}
              sections={orderList}
              keyExtractor={(item, index) => item.lineId + item.id + index}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              stickySectionHeadersEnabled={false}
            />
          )}
        </View>
      </View>

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
}

export default Reorder
