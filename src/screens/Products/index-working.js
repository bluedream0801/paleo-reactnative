import React, { useState, useContext, useEffect, useCallback, createRef } from "react";
import { View, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { sub, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated";
import Modal from "react-native-modal";
import ScrollableTabView, { ScrollableTabBar } from "react-native-scrollable-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Styles";
import { appColors } from "../../theme";
import { MarketHeader, Text } from "../../components/";
import ProductDetails from "../ProductDetails";
import ProductItem from "./ProductItem";
import SwipePageGuideAlert from "../../components/SwipePageGuideAlert";
const { accountSettingGray, white, headerBgColor, addressGrey, transparent } = appColors;
import AppContext from "../../provider";
import * as momenttz from 'moment-timezone';
import provider from "../../firebase/ProductsProvider";
const {
  getProductsData,
  getAllProductsDataFromGroup
} = provider;

const Products = (props) => {
  const { navigation, route } = props;
  const tabRef = createRef();
  let {
    categoriesArray, // The subcategories .... already here // SAME AS subCategories
    selectedTab,
    headingTitle,
    parentId, // parent category id
    parentObj,
    subCategoryID, // sub category id to show correct tab
    items,
  } = route.params;

  const {
    productsRoutesData,
    cartData,
    addToCart,
  } = useContext(AppContext);
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductObj, setSelectedProductObj] = useState(null);
  const [showSwipeGuideNotification, setShowSwipeGuideNotification] = useState(false);
  
  const getSubcategoriesByParentId = (id) => {
    let filtered = global.categoriesArray.filter((x) => x[1].parent_id == id);

    filtered = filtered.sort(function (a, b) {
      const first = a[1].sequence || Number.MAX_SAFE_INTEGER;
      const second = b[1].sequence || Number.MAX_SAFE_INTEGER;
      return first - second;
    });

    return filtered;
  };
  
  // Review all of these states and the way they are applied bellow  
  const [shouldChangeTab, setShouldChangeTab] = useState(false);
  const [title, setTitle] = useState(headingTitle);
  const [currentTab, setCurrentTab] = useState(selectedTab);
  const [productsArray, setProductsArray] = useState([]);
  const [routes, setRoutes] = useState([]);
  // const [subCategories, setSubCategories] = useState(categoriesArray || []);
  const [subCategories, setSubCategories] = useState(getSubcategoriesByParentId(parentId));
  
  // Animations related stuff ... review but not as important
  const fadeAnim = useSharedValue(0);
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value
    }
  }, [fadeAnim.value]);

  useEffect(() => {
    let componentMounted = true;
    (async () => {
      let visitCount = await AsyncStorage.getItem('visit-count');
      visitCount = visitCount ? Number.parseInt(visitCount, 10) : 0;
      if (visitCount < 2) {
        componentMounted && setShowSwipeGuideNotification(true);
        visitCount++;
        await AsyncStorage.setItem('visit-count', String(visitCount));
      }
    })();
    return () => {
      componentMounted = false;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (showSwipeGuideNotification) {
      fadeAnim.value = withSequence(
        withTiming(1, { duration: 1000 }),
        withDelay(5000, withTiming(0, { duration: 1000}))
      );
      setTimeout(() => {
        if (isMounted) {
          setShowSwipeGuideNotification(false);
        }
      }, 7000);
    }

    return () => {
      isMounted = false;
    }
  }, [showSwipeGuideNotification]);
  
  // The FUN part
  /*
  // Don't think is needed
  useEffect(() => {
    if (tabRef && tabRef.current !== null && currentTab !== undefined && shouldChangeTab && routes.length) {
      setTimeout(() => {
        console.log('Change Tab', shouldChangeTab, currentTab, routes.length);
        if (tabRef && tabRef.current !== null && shouldChangeTab && currentTab < routes.length) {
          tabRef.current.goToPage(currentTab);
          setShouldChangeTab(false);
        }
      }, 300);
    }
  }, [currentTab, shouldChangeTab, tabRef, routes]);
  */
  
  /*
  // Might be needed for deeplinks, review later
  useEffect(() => {
    let targetTabIndex = subCategories.findIndex(([categoryID]) => categoryID == subCategoryID);
    targetTabIndex = targetTabIndex < 0 ? 0 : targetTabIndex;
    setCurrentTab(targetTabIndex);
    setShouldChangeTab(true);
  }, [route.params.deepLinkHash]);
  */
  
  // Product Listing Related functions
  const getSubcategoriesArray = (id, cateArray) => {
    let filtered = cateArray.filter((x) => x[1].parent_id == id);
    filtered.sort((a, b) => a[1].sequence_app - b[1].sequence_app);
    return filtered;
  };

  // Maybe combine the 2 functions bellow togheter in the future.
  const getProducts = async (parentId, subcategoriesItemIds) => {

    const updateArray = [];
    
    console.log('Start', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'))
    const productsArray = await getAllProductsDataFromGroup(parentId);
    console.log('End', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'))
    console.log('ProductsArray', productsArray)
    
    for (let index = 0; index < productsArray.length; index++) {
      updateArray.push({
        ...productsArray[index],
        // recommendedItems: remoteArray[index].related_products.map(p => p.id),
        quantity: 0,
      });
    }
    
    // Not sure if this is still necessary but leave it here in case there are issues
    // const ids = subcategoriesItemIds
      // .sort((a, b) => a.sequence - b.sequence)
      // .map((item) => item.product_id.toString());

    const categoryData = { data: updateArray, pId: parentId };
    // console.log('categoryData',categoryData);
    return categoryData;
  };

  const getProductsWithSubcategories = async (parentId, subcategoriesIds) => {

    let productGroupArray = global.categoriesArray;
    let allCategories = Object.assign([], productGroupArray);
    
    var dataArray = [];
    if (parentId== 321) {
      // console.log('parentId',parentId);
    }
    
    let number_of_subcategories = subcategoriesIds.length;
    for (let j = 0 ; j< number_of_subcategories; j++) {
      // if (parentId== 321) {
        // console.log('subcategoriesIds[j][0]',subcategoriesIds[j][0]);
        // console.log('subcategoriesIds[j][1]',subcategoriesIds[j][1]);
      // }

      let subcategoriesItemIds = subcategoriesIds[j][1].items;
      let code = subcategoriesIds[j][1].code;

      let remoteArray=[];

      subcategoriesItemIds.forEach((item) => {
        // console.log('item',item, item.product_id);
        let item_details = global.groceryProductsArray.find((x) => x.docId == item.product_id);
        // console.log('item_details',item_details);
        remoteArray.push(item_details)
      })

      // Not sure if this is still necessary but leave it here in case there are issues
      // let prodIdsData = subcategoriesItemIds
      //  .sort((a, b) => a.sequence - b.sequence)
      //  .map((item) => item.product_id.toString());

      // remoteArray = remoteArray.sort((a, b) => {
        // return prodIdsData.indexOf(a.docId) - prodIdsData.indexOf(b.docId);
      // });

      
      // We now also check for subsubcategories and products in those sub subcategories
      var subsubcategoriesIds = getSubcategoriesArray(subcategoriesIds[j][0], allCategories);
      // if (parentId== 321) {
        // console.log('subsubcategoriesIds',subsubcategoriesIds);
      // }
      
      if (subsubcategoriesIds[0] && subsubcategoriesIds[0][1] && subsubcategoriesIds[0][1].items) {
        
        let number_of_subsubcategories = subsubcategoriesIds.length;
        for (let j = 0 ; j< number_of_subsubcategories; j++) {
          
          // console.log('subcategoriesIds[j][0]',subsubcategoriesIds[j][0]);
          // console.log('subcategoriesIds[j][1]',subsubcategoriesIds[j][1]);

          let subsubcategoriesItemIds = subsubcategoriesIds[j][1].items;
          let subcode = subsubcategoriesIds[j][1].code;

          // let remoteArray=[];
          // remoteArray.push(subcategoriesIds[j][1].name);
          // let subsubcategoryName = Object.assign([], subsubcategoriesIds[j][1].name);
          remoteArray.push(subsubcategoriesIds[j][1]);

          subsubcategoriesItemIds.forEach((item) => {
            // console.log('item',item, item.product_id);
            let item_details = global.groceryProductsArray.find((x) => x.docId == item.product_id);
            // console.log('item_details',item_details);
            // console.log('item_details',item_details);
            remoteArray.push(item_details)
          })
          
          // console.log('remoteArray',remoteArray);
        }        
      }
      
      var updateArray = [];
      for (let index = 0; index < remoteArray.length; index++) {
        updateArray.push({
          ...remoteArray[index],
          quantity: 0,
        });
      }
      
      // if (parentId== 321) { 
        // console.log('updateArray',updateArray);
      // }

      dataArray.push({ code: code, dataArray: updateArray });
      // if (parentId== 321) { 
        // console.log('dataArray',dataArray);
      // }

      // console.log('dataArray',dataArray);

    }
    

    let categoryData = {};
    categoryData = { data: dataArray, pId: parentId };
    // console.log('categoryData',categoryData);
    return categoryData;
  };
  
  
  
  
  
  
  
  // Redone Simplified Logic
  useEffect(() => {
    
    let productGroupArray = global.categoriesArray;
    let allCategories = Object.assign([], productGroupArray);
    
    var localProductRoute = [];
    
    // if (productsRoutesData.length == 0) {
      let dataProductsArray = [];
      
          // Gets Subcategories of the current Category
          const subcategoriesIds = getSubcategoriesArray(parentObj[0], allCategories);
          // console.log('subcategoriesIdS',subcategoriesIdS);
          let arrayCats = {};
          // If we have categories and subcategories
          if (subcategoriesIds[0] && subcategoriesIds[0][1] && parentObj[1].items.length == 0) { //  && subcategoriesIds[0][1].items
            arrayCats = getProductsWithSubcategories(parentObj[0], subcategoriesIds);
            dataProductsArray.push(arrayCats);
          // Only categories
          } else if (parentObj[1].items.length > 0) {
            arrayCats = getProducts(parentObj[0], parentObj[1].items);
            dataProductsArray.push(arrayCats);
          }
        
      Promise.all(dataProductsArray).then((content) => {
        console.log('productsRoutesData Check',content);
        localProductRoute = content;
        // setProductsRoutesData(content);
      });
    // }
    
    
    /*
    const categories = subCategories;
    const categoriesCount = categories.length;
    const maxTabIndex = categoriesCount > 0 ? (categoriesCount - 1) : 0;
    
    console.log('parentId',parentId);
    // console.log('Check categoryData Top',categoryData);
    // console.log('Check categoryData Details',categoryData[0].data);
    // console.log('Moment tz currentTime 1', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'))
    if (categories.length) {
      const categoryDataArray = localProductRoute.find((x) => x.pId == parentId);
      const categoryData = categoryDataArray.data;
      // console.log('categoryData',categoryData[0].dataArray);
      console.log('We HAVE Subcategories');
      
      const array = [];
      for (let i = 0; i <= maxTabIndex; i++) {
        
        let tabCode = categories.length ? categories[i][1].code : '';
        console.log('tabCode check',tabCode);
        
        const dataObj = categories[i][1];
        const { name, code } = dataObj;

        let arrayData = [];
        const dataArray = categoryData.find((x) => x.code == code);
        if (dataArray) {
          // console.log('dataArray.dataArray',dataArray.dataArray);
          arrayData = Object.assign([], dataArray.dataArray);
        }
        
        // console.log('arrayData',arrayData);
        
        // Not sure if this is necessary as items should be sorted automatically from Firebase
       
        // if (arrayData.length > 0) {
          // arrayData.sort((a, b) => {
            // const itemA = route.items.find((item) => item.product_id == a.docId);
            // const itemB = route.items.find((item) => item.product_id == b.docId);
            // return itemA.sequence - itemB.sequence;
          // });
        // }
       
        // 
        array.push({ key: code, title: name, products: arrayData,  ...dataObj });
      }
      // console.log('Routes Array Check', array);
      // console.log('Moment tz currentTime 2', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'))
      setRoutes(array);
      // console.log('Moment tz currentTime 3', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'))
    } else {
      // console.log('Moment tz currentTime 2', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'))
      console.log('We DO NOT HAVE Subcategories');
      const categoryDataArray = localProductRoute.filter((x) => x.pId == parentId);
      setProductsArray(Object.assign([], categoryDataArray[0].data));
      // console.log('Moment tz currentTime 3', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'))
    }
    */
    
  }, []);
  // The FUN part END
  
  
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

  const searchPress = () => {
    navigation.navigate("Search");
  };

  const backPress = () => {
    navigation.goBack();
  };

  const onSelectProduct = (item) => {
    setSelectedProductObj(item);
    setShowDetailsModal(true);
  };

  const onSelectQuantity = (item, quantity, callback) => {
    selectQuantity({ ...item, quantity }, callback);
  };  
  
  // console.log('productsRoutesData Check TEST',productsRoutesData);
  // console.log('routes',routes);
  
  if (routes.length >0 || productsArray.length>0) {
  return (
    <View style={styles.container}>
      <MarketHeader
        searchEnabled={true}
        backArrow
        backPress={() => backPress()}
        condensedTitle={title}
        searchPress={() => searchPress()}
      />

      <View
        style={[
          styles.body,
          {
            backgroundColor: routes.length > 0 ? transparent : white,
            marginTop: routes.length > 0 ? 0 : 30,
          },
        ]}
      >
        {subCategories.length == 0 && (
          <View style={styles.container} key={0}>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              data={productsArray}
              style={styles.listStyle}
              renderItem={({ item }) => (
                <ProductItem
                  obj={item}
                  onPress={() => onSelectProduct(item)}
                  onSelectQuantity={(quantity, callback) =>
                    onSelectQuantity(item, quantity, callback)
                  }
                />
              )}
            />
          </View>
        )}
        {subCategories.length > 0 && (
          <ScrollableTabView
            prerenderingSiblingsNumber={1}
            initialPage={selectedTab}
            automaticallyAdjustContentInsets={true}
            scrollWithoutAnimation={true}
            tabBarTextStyle={styles.tabBarTextStyle}
            tabBarUnderlineStyle={[styles.tabBarUnderlineStyle, {}]}
            ref={tabRef}
            onScroll={(position) => {
              if (position < -0.3) {
                // start swiping the first slide to the right
                backPress();
              }
            }}
            renderTabBar={() => (
              <ScrollableTabBar
                prerenderingSiblingsNumber={Infinity}
                automaticallyAdjustContentInsets={true}
                style={[styles.ScrollableTabBar, { height: 30, borderWidth: 0}]}
                activeTextColor={headerBgColor}
                inactiveTextColor={accountSettingGray}
                tabStyle={[styles.tabStyle]}
              />
            )}
          >
            {routes.map((obj, index) => {
              const savedProducts = obj.products;
              // console.log('obj.products',obj.products);
              // console.log('Moment tz currentTime 4', momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD hh:mm:ss'))
              return (
                <View
                  tabLabel={obj.title}
                  style={[styles.listContainer, {}]}
                  key={index}
                >
                  <View style={{ flex: 1 }}>
                    {savedProducts.length == 0 && (
                      <View
                        tabLabel={obj.title}
                        style={styles.notFoundContainer}
                      >
                        <Text
                          largeRegularPlus
                          color={addressGrey}
                          textAlign={"center"}
                        >
                          Products not found for the {routes[currentTab].title}{" "}
                        </Text>
                      </View>
                    )}
                    <FlatList
                      key={index}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      data={savedProducts}
                      style={[styles.listStyle, {}]}
                      renderItem={({ item }) => (
                        <ProductItem
                          obj={item}
                          onPress={() => onSelectProduct(item)}
                          onSelectQuantity={(quantity, callback) =>
                            onSelectQuantity(item, quantity, callback)
                          }
                        />
                      )}
                    />
                  </View>
                </View>
              );
            })}
          </ScrollableTabView>
        )}
        {showSwipeGuideNotification && (
          <Animated.View style={[styles.swipeGestureGuideView, animatedStyles]}>
            <SwipePageGuideAlert></SwipePageGuideAlert>
          </Animated.View>
        )}
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
          addToCart={addToCart}
          navigation={navigation}
          productObj={Object.assign({}, selectedProductObj)}
          setShowDetailsModal={setShowDetailsModal}
        />
      </Modal>
    </View>
  );
  } else {
    return null;
  }
};

export default Products;
