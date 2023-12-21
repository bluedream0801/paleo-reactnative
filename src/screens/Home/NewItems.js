import styles from './NewItemsStyles'
import React, { useContext, useState } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native'
import analytics from '@react-native-firebase/analytics'
import helpers from '../../helpers'
import Modal from 'react-native-modal'
const { get_thumbnail } = helpers
import { appColors, appImages } from '../../theme'
import FastImage from 'react-native-fast-image'
import AppContext from '../../provider'
import { Text } from '../../components/'
import ProductDetails from '../ProductDetails'
import provider from '../../firebase/ProductsProvider'
import ProductItem from '../Products/ProductItem'
const { getProductsGroupsData, getProductsData } = provider

const {
  vertical_overlay,
} = appImages
const {
  darkGray,
  black,
  white,
  extraDarkBlue,
  green,
  transparent,
} = appColors

const NewItems = (props) => {
  const { homeDataObj, navigation } = props
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const {
    cartData,
    setIsApiLoaderShowing,
    addToCart
  } = useContext(AppContext)
  const [selectedProductObj, setSelectedProductObj] = useState(null)

  const getProductsRouteParams = async (item) => {
    const catesArray = global.categoriesArray;
    return getProductByParentId(item, catesArray)
  }

  const getProductByParentId = (objectItem, catesArray) => {
    let [item] = catesArray.filter((x) => x[0] == objectItem.id)
    const [id, itemObj] = item || [];
    let heading = ''
    let filtered = []
    if (itemObj.parent_id == '113') {
      filtered = catesArray.filter((x) => x[1].parent_id == id)
      heading = itemObj.name
    } else {
      filtered = catesArray.filter((x) => {
        if (x[0] == itemObj.parent_id) {
          heading = x[1].name
        }
        return x[1].parent_id == itemObj.parent_id
      })
    }

    filtered = filtered.sort(function (a, b) {
      return a[1].sequence - b[1].sequence
    })

    let tabIndex = 0
    for (let index = 0; index < filtered.length; index++) {
      if (parseInt(filtered[index][0]) == id) {
        tabIndex = index
        break
      }
    }
    
    // We have subcategories
    if (filtered.length) {
      var parent_id = itemObj.parent_id;
    // We dont
    } else {
      var parent_id = objectItem.id;
    }

    return {
      categoriesArray: filtered,
      selectedTab: tabIndex,
      headingTitle: heading,
      parentId: parent_id,
      parentObj: item,
    }
  }

  const navigateToProducts = async (productGroup, productID) => {
    if (productGroup || productID) {
      try {
        if (productGroup) {
          const routeParams = await getProductsRouteParams(productGroup);
          navigation.navigate("Products", {...routeParams});
        } else {
          // Get product data
          const [product] = await getProductsData([productID], () => {});
          if (product) {
            setSelectedProductObj(product);
            setShowDetailsModal(true);
          }
        }
      } catch(ex) {
        console.log(ex);
      }
    } else {
      navigation.navigate("MarketStack");
    }
  }

  const renderWeekContainer = () => {
    return (
      <View
        style={[
          styles.weekContainer,
          {
            backgroundColor: homeDataObj ? homeDataObj.prom_bg_color : "",
          },
        ]}
      >
        <Text color={black} condensedBold largeTitle textAlign="center">
          {homeDataObj ? homeDataObj.prom_headline : ""}
        </Text>
        <Text
          color={darkGray}
          regular
          textAlign={"center"}
          lineHeight={21}
          style={styles.weekDescription}
        >
          {homeDataObj ? homeDataObj.prom_body : ""}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigateToProducts({ id: homeDataObj.prom_link_group }, homeDataObj.prom_link_product);
          }}
        >
          <Text color={black} regularPlus textAlign={"center"}>
            {homeDataObj ? homeDataObj.prom_link_text : ""}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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

  const selectQuantity = (obj, callback = () => {}) => {

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
      addToCart(obj, obj.quantity, 'grocery_add_to_cart_app');
    }

  };

  const onSelectQuantity = (item, quantity, callback) => {
    selectQuantity({ ...item, quantity }, callback);
  };

  const renderListItem = (obj, index) => {
    return (
      <ProductItem
        obj={obj}
        onPress={() => {
          setSelectedProductObj(obj);
          setShowDetailsModal(true)
        }}
        onSelectQuantity={(quantity, callback) => {
          onSelectQuantity(obj, quantity, callback)
          analytics().logEvent('home_add_to_cart_featured');
        }}
      />
    )
  }

  const renderPopularCategories = () => {
    return (
      <View>
        <Text
          condensedBold
          minTitle
          color={extraDarkBlue}
          style={styles.popularText}
        >
          {homeDataObj.popu_headline}
        </Text>
        <ScrollView horizontal={true}>
          {(homeDataObj.popu_groups || []).map((obj, i) => {
            return (
              <TouchableOpacity
                style={styles.categeoryCell}
                key={i}
                onPress={() => {
                  analytics().logEvent('home_click_featuredcategories');
                  navigateToProducts(obj);
                }}
              >
                <FastImage
                  source={{ uri: get_thumbnail(obj.image, 512) }}
                  style={styles.imgCategory}
                >
                  <Image source={vertical_overlay} style={styles.overlay} />

                  <Text
                    color={white}
                    minTitle
                    condensedBold
                    style={styles.categoryTitle}
                  >
                    {obj.text}
                  </Text>
                </FastImage>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  return (
    <>
      {renderWeekContainer()}
      <View style={styles.container}>
        <Text
          minTitle
          condensedBold
          color={extraDarkBlue}
          style={styles.boldText}
        >
          {homeDataObj.feat_headline}
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={homeDataObj.feat_products || []}
          style={styles.listStyle}
          renderItem={({ item, index }) => renderListItem(item, index)}
        />
        <TouchableOpacity
          style={styles.seeAllTouch}
          onPress={() => {
            navigateToProducts({ id: homeDataObj.feat_link_group.toString() })
          }}
        >
          <Text color={green} regular lineHeight={21}>
            {homeDataObj.feat_link_text}
          </Text>
        </TouchableOpacity>

        {renderPopularCategories()}

        <Modal
          style={{ margin: 0 }}
          testID={'modal'}
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
    </>
  )
}

export default NewItems
