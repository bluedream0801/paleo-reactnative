import React, { useState, useContext, useCallback } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  SectionList,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native'
import analytics from '@react-native-firebase/analytics';
import Modal from "react-native-modal";
import FastImage from 'react-native-fast-image'
import helpers from '../../helpers'
const { get_thumbnail, isShowOutOfStockBadge } = helpers
import styles from './Styles'
import { appColors, appImages, appMetrics } from '../../theme'
const { screenWidth } = appMetrics
import { MarketHeader, Text, TapGesture } from '../../components/'
import AppContext from '../../provider'
import provider from '../../firebase/ProductsProvider'
const { getProductsData} = provider
import Services from '../../services'
const { API } = Services
const {
  lessDarkGray,
  accountSettingGray,
  addressGrey,
  headerBgColor,
  transparent
} = appColors

import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view'
import Reorder from './Reorder'
import FreshMenu from './FreshMenu';
import ProductDetails from '../ProductDetails'
import { useFocusEffect } from '@react-navigation/native';
import ProductQuantityEdit from '../Products/ProductQuantityEdit';
const { heart_selected_ic } = appImages

const Favorites = (props) => {
  const { navigation } = props

  const searchPress = () => {
    navigation.navigate('Search')
  }
  const [isFavoriteSelected, setIsFavoriteSelected] = useState(true)
  const [isHideFavorite, setIsHideFavorite] = useState(false)
  const [favoritesItems, setFavoritesItems] = useState([])
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductObj, setSelectedProductObj] = useState(null);
  const {
    setIsApiLoaderShowing,
    loginData,
    addToCart,
    cartData,
    isAnyApiLoading
  } = useContext(AppContext)

  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
  } else {
    var user_id = null;
    var token = null;
  }

  const getFavProducts = async (ids) => {
    if (ids.length > 0) {
      const array = await getProductsData(ids, setIsApiLoaderShowing);
      if (array.length) {
        setFavoritesItems([{data: array}]);
      } else {
        setFavoritesItems([]);
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (loginData) {
        setFavoriteProducts();
      }
    }, [])
  );

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
      analytics().logEvent('favorites_addtocart');
      addToCart(obj, obj.quantity, 'grocery_add_to_cart_app');
    }
  }

  const setFavoriteProducts = async () => {
    await API.execute(
      'prod.fav',
      'search_read_path',
      [
        [['contact_id.id', '=', accountInfo.contact_id.id]],
        ['product_id.is_favorite'],
      ],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id },
    )
      .then((res) => {
        const ids = []
        for (let index = 0; index < res.length; index++) {
          ids.push(res[index].product_id.id.toString())
        }
        console.log('ids=', ids)
        getFavProducts(ids)
      })
      .catch((err) => {
        alert(err)
      })
  }

  const remove_favorite = async (product_id) => {
    await API.execute(
      'prod.fav',
      'del_fav',
      [product_id, parseInt(accountInfo.contact_id.id)],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id },
    )
      .then((res) => {
        const filtered = favoritesItems[0].data.filter((x) => x.docId !== product_id)
        if (filtered.length === 0) {
          setFavoritesItems([])
        } else {
          setFavoritesItems([{data: filtered}])
        }
      })
      .catch((err) => {
        // alert(err)
      })
  }

  const showProductDetails = (product) => {
    setSelectedProductObj(product);
    setShowDetailsModal(true);
  }

  const getItemQuantity = (item) => {
    if (cartData) {
      const items = cartData.lines;

      if (items && items.length > 0) {
        const cartFilteredArray = items.filter(
          (x) => x.product_id.id == item.docId
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
            No favorites yet.
          </Text>
          <Text
            regular
            textAlign={'center'}
            color={lessDarkGray}
            style={styles.marginText}
          >
            Add to your favorites by double-{'\n'}tapping the product photo.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const renderItem = ({item: obj, index, section }) => {
    const {
      name,
      image_app,
      docId,
      sale_uom_id,
      sale_tax_id,
      stock_qty_avail,
      ecom_no_order_unavail,
      sale_max_qty,
      sale_qty_multiple
    } = obj;
    
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
                <TouchableOpacity
                  style={styles.favContainer}
                  onPress={() => {
                    remove_favorite(docId)
                  }}
                >
                  <Image source={heart_selected_ic} style={styles.favImg} />
                </TouchableOpacity>
                <FastImage
                  source={{ uri: get_thumbnail(image_app, 256) }}
                  style={styles.favorites}
                />
              </View>
              <View style={styles.textContainer}>
                <Text extSmall color={accountSettingGray} noOfLines={2}>
                  {name}
                </Text>
                <Text minSmall color={accountSettingGray}>
                  {'per ' + sale_uom_id.name + ' '}
                </Text>
              </View>
            </View>
          </View>
        </TapGesture>
        <Pressable style={{ position: 'absolute', right: 5, top: 5, bottom: 5, width: 110}}>
          <ProductQuantityEdit
            isVertical
            quantity={getItemQuantity(obj)}
            disabled={isAnyApiLoading}
            isOutOfStock={isShowOutOfStockBadge(
              stock_qty_avail,
              ecom_no_order_unavail,
              sale_max_qty
            )}
            onSelectQuantity={(quantity, callback) => {
              onSelectQuantity(obj, quantity, callback);
            }}
            product_id={docId}
            max_qty={max_qty}
            sale_qty_multiple={sale_qty_multiple}
          />
        </Pressable>
      </View>
    )
  }

  const renderSectionFooter = ({section: {date, id}}) => {
    return (
      <View>
        <Text small style={styles.footerText}>Double-tap the product photo to add or remove favorites.</Text> 
      </View>
    )
  }

  const renderFavoritesList = () => {
    return (
      <View style={styles.flex}>
        <SectionList
          style={styles.listStyle}
          sections={favoritesItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          renderSectionFooter={renderSectionFooter}
          stickySectionHeadersEnabled={false}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MarketHeader
        condensedTitle={'Favorites'}
        searchPress={() => searchPress()}
      />

      <View style={styles.body}>
        <ScrollableTabView
          initialPage={1}
          automaticallyAdjustContentInsets={false}
          scrollWithoutAnimation={true}
          tabBarTextStyle={styles.tabBarTextStyle}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          renderTabBar={() => (
            <ScrollableTabBar
              automaticallyAdjustContentInsets={false}
              underlineStyle={{}}
              style={[styles.ScrollableTabBar, { height: 30, borderWidth: 0 }]}
              activeTextColor={headerBgColor}
              inactiveTextColor={accountSettingGray}
              tabStyle={{ width: screenWidth / 3 }}
            ></ScrollableTabBar>
          )}
        >
          <View style={styles.Inner} tabLabel={'Favorites'}>
            {renderFavoritesList()}
            {favoritesItems.length == 0 && renderNoFavorites()}
          </View>

          <Reorder tabLabel={'Reorder'} navigation={navigation}/>
          {(user_id == 12272) &&
            <FreshMenu tabLabel={'Fresh Menu'} navigation={navigation}/>
          }
        </ScrollableTabView>
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
        onModalHide={() => setFavoriteProducts()}
      >
        <ProductDetails
          addToCart={addToCart}
          navigation={navigation}
          productObj={Object.assign({}, selectedProductObj)}
          setShowDetailsModal={setShowDetailsModal}
        />
      </Modal>
    </View>
  )
}

export default Favorites
