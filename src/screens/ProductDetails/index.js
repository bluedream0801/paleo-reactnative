import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import styles, { detailsTextStyles } from "./Styles";
import { appColors, appImages, appMetrics } from "../../theme";
import { useFocusEffect } from "@react-navigation/native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Text, Button, PopupModal, TapGesture } from "../../components/";
import HTMLView from "react-native-htmlview";
const {
  textDarkGray,
  darkGray,
  black,
  accountSettingGray,
  white,
  orderDarkGray,
  quantityGreen,
  notifyBlue,
  greenButtonOpacity,
} = appColors;
const { screenWidth } = appMetrics;
import provider from "../../firebase/ProductsProvider";
import helpers from "../../helpers";
const { number_format, get_thumbnail, isShowOutOfStockBadge, hapticFeedback } = helpers;
const { getProductsData } = provider;
import FastImage from "react-native-fast-image";
import AppContext from "../../provider";
const {
  add_fav_btn_ic,
  close,
  right_arrow,
  HEART_TRANSPARENT,
  tick_ic,
  HEART_SELECTED_SMALL,
  small_bell_ic,
} = appImages;
import Services from "../../services";
const { API } = Services;
import ProductQuantityEdit from '../Products/ProductQuantityEdit';

const PopupContent = `Pretty big! \n\nOur Regular size meals come in 800ml BPA-free tupperwares and contain a generous amount of protein. For our wild fish dishes, the protein weighs in at 125-150 grams, and in our pastured meat dishes the meat portion alone is around 175-190 grams.
\nOur Jumbo portions contain around double these amounts: wild fish dishes with 250-300 grams of of fish and the meats at 350-380 gram portions, excluding the rest of the meal.
\nMany of our customers purchase our Jumbo meals and share with a partner, their family, or split into multiple sittings.
\nFor the Build your Own meals, the protein portions are given in the menu, and you can choose to order double the protein portion if you like.`;

const ProductDetails = (props) => {
  const { navigation, route, setShowDetailsModal, productObj, addToCart } =
    props;
  const {
    image,
    name,
    sale_price,
    stock_qty_avail,
    description,
    product_origin,
    packing_size,
    image_app,
    nutrition_id,
    sale_invoice_uom_id,
    sale_uom_id,
    related_products,
    components,
    sale_price_order_uom,
    images,
    ecom_no_order_unavail,
    id,
    docId,
    sale_max_qty,
    old_sale_price,
  } = productObj;

  const [isShowDropDown, setIsShowDropDown] = useState(true);
  const [isShowBundleDropDown, setIsShowBundleDropDown] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [productsInThisBundle, setProductsInThisBundle] = useState([]);
  const [nutritionArray, setNutritionArray] = useState([]);
  const scrollRef = React.useRef();
  const [activeSlide, setActiveSlide] = useState(0);
  const [notifications, setNotifications] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  const {
    setIsAddToOrderPopup,
    setIsAddressNotificationShowing,
    setIsNotificationShowing,
    setIsAnyPopupOpened,
    setIsApiLoaderShowing,
    loginData,
    cartData,
    isAnyApiLoading,
    userDataArray,
    setUserDataArray
  } = useContext(AppContext);
  
  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
  } else {
    var user_id = null;
    var token = null;
  }
  
  const productHasNotification = userDataArray.productsWithNotifications.find((notification) => notification.product_id == docId);
  
  
  const getRecommendedProducts = async () => {
    if (related_products && related_products.length > 0) {
      var ids = related_products.map((p) => String(p.id));
      
      var array = await getProductsData(ids, setIsApiLoaderShowing);
      
      var updateArray = [];
      for (let index = 0; index < array.length; index++) {
        updateArray.push({
          ...array[index],
          quantity: 0,
        });
      }

      setRecommendedProducts(updateArray);
    } else {
      setRecommendedProducts([]);
    }
  };

  // TODO: Lucian can connect it to product type: bundles
  const getProductsInThisBundle = async () => {
    
    if (components && components.length > 0) {
      
      var ids = components.map((p) => String(p.component_id));
      
      var array = await getProductsData(ids, setIsApiLoaderShowing);

      var updateArray = [];
      for (let index = 0; index < array.length; index++) {
        updateArray.push({
          ...array[index],
          quantity: 0,
        });
      }

      setProductsInThisBundle(updateArray);
    } else {
      setProductsInThisBundle([]);
    }
  };
  
  const onSelectQuantity = (item, quantity, callback) => {
    selectQuantity({ ...item, quantity }, callback);
    hapticFeedback();
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

  const checkIsItemFavorite = async () => {
    
    const isFavorited = userDataArray.productsFavorites.find((favorite) => favorite.product_id == docId);
    console.log('isFavorited',isFavorited, docId);
    if (isFavorited) {
      setIsFavorited(true);
    }
    
  };

  const set_favorite = async (product_id) => {
    await API.execute(
      "prod.fav",
      "add_fav",
      [parseInt(product_id), parseInt(accountInfo.contact_id.id)],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id }
    )
      .then((res) => {
        console.log("set fav--", res);
        setIsFavorited(true);
        var productsWithFavoritesArray = [...userDataArray.productsFavorites];
        const old = productsWithFavoritesArray.find((favorite) => favorite.product_id == product_id);
        if (!old) {
          productsWithFavoritesArray.push(vals);
          hapticFeedback();
          setUserDataArray({ 
                            productsWithNotifications: userDataArray.productsWithNotifications, 
                            productsFavorites: productsWithFavoritesArray
                          });
        }
      })
      .catch((err) => {
        // alert(err)
      });
  };

  const remove_favorite = async (product_id) => {
    await API.execute(
      "prod.fav",
      "del_fav",
      [product_id, parseInt(accountInfo.contact_id.id)],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id }
    )
      .then((res) => {
        console.log("remove--", res);
        setIsFavorited(false);
        var productsWithFavoritesArray = userDataArray.productsFavorites.filter((favorite) => favorite.product_id != docId);
        hapticFeedback();
        setUserDataArray({ 
                            productsWithNotifications: userDataArray.productsWithNotifications, 
                            productsFavorites: productsWithFavoritesArray
                          });
      })
      .catch((err) => {
        // alert(err)
      });
  };

  const buildNutritionArray = () => {
    const array = [];
    const {
      calories,
      carbohydrt_g,
      protein_g,
      lipid_tot_g,
      fiber_td_g,
    } = nutrition_id || {};

    if (calories) {
      array.push({ title: "Calories", grams: calories });
    }
    if (lipid_tot_g) {
      array.push({ title: "Total Fat", grams: lipid_tot_g + " g" });
    }
    if (protein_g) {
      array.push({ title: "Total Protein", grams: protein_g + " g" });
    }
    if (carbohydrt_g) {
      array.push({ title: "Total Carbohydrates", grams: carbohydrt_g + " g" });
    }
    if (fiber_td_g) {
      array.push({ title: "Total Fiber", grams: fiber_td_g + " g" });
    }

    setNutritionArray(array);
  };

  useEffect(() => {
    buildNutritionArray();
    getRecommendedProducts();
    getProductsInThisBundle();
    if (loginData) {
      checkIsItemFavorite();
    }
  }, []);

  useFocusEffect(useCallback(() => {}, [productObj]));

  const renderTextContent = () => {
    const source = {
      html: `
        ${description}
       `,
    };
    let htmlContent = description;

    htmlContent = "<div>" + htmlContent + "</div>";

    return (
      <View style={styles.textContainer}>
        <View style={styles.fromContainer}>
          <TouchableHighlight>
            <Text
              minSmall
              condensed
              color={white}
              style={styles.fromContainerText}
            >
              {product_origin}
            </Text>
          </TouchableHighlight>
        </View>

        <Text minTitle condensedBold color={black} style={styles.textMargin}>
          {name} 
        </Text>

        <Text condensedBold color={orderDarkGray} style={styles.padding}>
          {packing_size}
        </Text>

        <View style={styles.line} />
        <View style={styles.textSubContainer}>
          <HTMLView
            addLineBreaks={false}
            value={htmlContent}
            stylesheet={detailsTextStyles}
          />
        </View>
      </View>
    );
  };

  const renderNutrition = () => {
    
    var nutrition_name ='';
    
    if (nutrition_id && nutrition_id.nutrition_uom_id && nutrition_id.nutrition_uom_id.name) {
       nutrition_name = nutrition_id.nutrition_uom_id.name;
    }
     
    return (
      <View
        style={[
          styles.nutrition,
          { marginBottom: recommendedProducts.length == 0 ? 20 : 0 },
        ]}
      >
        <View
          style={[
            styles.subContainer,
            {
              paddingBottom: isShowDropDown ? 35 : 0,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setIsShowDropDown(!isShowDropDown);
              if (isShowDropDown) {
                setTimeout(() => {
                  scrollRef.current.scrollToEnd();
                }, 10);
              }
            }}
            style={styles.row}
          >
            <Text smallRegular color={accountSettingGray}>
              Nutrition
            </Text>
            <Image
              source={right_arrow}
              style={[
                styles.arrow,
                {
                  transform: [{ rotate: isShowDropDown ? "90deg" : "0deg" }],
                },
              ]}
            />
          </TouchableOpacity>
          {isShowDropDown && (
            <View style={styles.slotContainer}>
              <Text color={darkGray} bold>
                Per {nutrition_name}
              </Text>
              {nutritionArray.map((obj, j) => {
                return (
                  <TouchableOpacity
                    onPress={() => {}}
                    key={j}
                    style={[
                      styles.timeRow,
                      {
                        marginBottom: j == 4 ? 30 : 0,
                        borderTopWidth: j == 0 ? 1 : 0,
                        marginTop: j == 0 ? 10 : 0,
                      },
                    ]}
                  >
                    <Text color={darkGray} extSmall>
                      {obj.title}
                    </Text>
                    <Text color={darkGray} extSmall>
                      {obj.grams}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderRightContent = (obj, index) => {
    const {
      docId,
      name,
      sale_price,
      sale_tax,
      sale_tax_id,
      sale_uom_id,
      sale_invoice_uom_id,
      sale_price_order_uom,
      ecom_no_order_unavail,
      stock_qty_avail,
      sale_max_qty,
      old_sale_price,      
      sale_qty_multiple,
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
      <View style={styles.rightContainer}>
        <View style={styles.inner}>
          <View>
            <Text bold extSmall color={accountSettingGray} noOfLines={2}>
              {name}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.priceRow}>
              <Text condensedBold color={black} style={styles.margin}>
                {getRecommendedItemPrice(
                  sale_invoice_uom_id.name,
                  sale_price,
                  sale_price_order_uom,
                  old_sale_price,
                )}
                <Text color={black} bold tiny>
                  {" per " + sale_uom_id.name}
                </Text>
              </Text>

              {(sale_tax_id == "76" || sale_tax_id == "77") && (
                <Text tiny color={textDarkGray}>
                  {"ex VAT"}
                </Text>
              )}
            </View>
            
            <ProductQuantityEdit
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
              sale_qty_multiple={sale_qty_multiple}
            />
            
          </View>
        </View>
      </View>
    );
  };

  const renderListItem = (obj, index, bgColor = appColors.white) => {
    const { image_app } = obj;
    return (
      <TouchableOpacity
        key={obj.docId}
        disabled={true}
        onPress={() => {
          navigation.navigate("ProductDetails");
        }}
      >
        <View
          key={index}
          style={[
            styles.cell,
            {
              marginLeft: index == 0 ? 0 : 10,
              marginRight: index == 3 ? 10 : 0,
              backgroundColor: bgColor,
            },
          ]}
        >
          <View style={styles.ImgContainer}>
            <ImageBackground
              source={{ uri: get_thumbnail(image_app, 256) }}
              style={styles.cellImg}
            ></ImageBackground>
          </View>
          {renderRightContent(obj, index)}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommended = () => {
    return (
      <View style={styles.listContainer}>
        <Text color={orderDarkGray} smallRegular>
          We recommend with
        </Text>
        <ScrollView horizontal style={{marginBottom: 20, marginTop: 10}}>
          {recommendedProducts.map((obj, i) => renderListItem(obj, i))}
        </ScrollView>
      </View>
    );
  };

  const renderInThisBundle = () => {
    return (
      <View
      style={[
        styles.nutrition,
        { marginBottom: productsInThisBundle.length == 0 ? 20 : 0 },
      ]}
    >
      <View
        style={[
          styles.subContainer,
          {
            paddingBottom: isShowBundleDropDown ? 35 : 0,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setIsShowBundleDropDown(!isShowBundleDropDown);
            if (isShowBundleDropDown) {
              setTimeout(() => {
                scrollRef.current.scrollToEnd();
              }, 10);
            }
          }}
          style={styles.row}
        >
          <Text smallRegular color={accountSettingGray}>
            In this bundle
          </Text>
          <Image
            source={right_arrow}
            style={[
              styles.arrow,
              {
                transform: [{ rotate: isShowBundleDropDown ? "90deg" : "0deg" }],
              },
            ]}
          />
        </TouchableOpacity>
        {isShowBundleDropDown && (
          <View style={[styles.slotContainer, {paddingHorizontal: 0, marginHorizontal: 10}]}>
            <View>
              <ScrollView horizontal>
                {productsInThisBundle.map((obj, i) => renderListItem(obj, i, appColors.lightGrey))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </View>

      
    );
  };

  const getPrice = () => {
    if (sale_invoice_uom_id.name == "KG") {
      return <>{(old_sale_price) && <Text style={{ textDecorationLine: 'line-through' }}>~฿{number_format(old_sale_price, "0,0")}</Text>} ~฿{number_format(sale_price_order_uom, "0,0")}</>;
    } else {
      return <>{(old_sale_price) && <Text style={{ textDecorationLine: 'line-through' }}>฿{number_format(old_sale_price, "0,0")}</Text>} ฿{number_format(sale_price, "0,0")}</>;
    }
  };

  const getRecommendedItemPrice = (
    sale_invoice_uom_name,
    sale_price,
    sale_price_order_uom,
    sale_uom_name
  ) => {
    if (sale_invoice_uom_name == "KG") {
      return <>{(old_sale_price) && <Text style={{ textDecorationLine: 'line-through' }}>~฿{number_format(old_sale_price, "0,0")}</Text>} ~฿{number_format(sale_price_order_uom, "0,0")}</>;
    } else {
      return <>{(old_sale_price) && <Text style={{ textDecorationLine: 'line-through' }}>฿{number_format(old_sale_price, "0,0")}</Text>} ฿{number_format(sale_price, "0,0")}</>;
    }
  };

  const getTag = () => {
    return "per " + sale_uom_id.name;
  };

  const getItemQuantity = (item) => {
    if (cartData) {
      const items = cartData.lines;

      if (items && items.length) {
        const cartFilteredArray = items.filter((x, i) => {
          if (x.product_id.id == item.docId) {
            return x;
          }
        });

        if (cartFilteredArray.length > 0) {
          let quantity = 0;
          for (let index = 0; index < cartFilteredArray.length; index++) {
            quantity = quantity + cartFilteredArray[index].total_qty;
          }

          return quantity;
        } else {
          return 0;
        }
      }
    } else {
    }
    return 0;
  };
  
  const notifyMe = () => {
    API.execute("product","add_ecom_notif",
    [[docId]],
    {},
    setIsApiLoaderShowing, 
    { token, user_id }).then(res=>{
        console.log('Product should be subscribed to notifications',res);
        // No error
        if (res == null) {
          vals = {
            product_id: docId
          }
          // Setting up the array here instead of rereading it from the server every time productsWithNotifications
          var productsWithNotificationsArray = userDataArray.productsWithNotifications;
          productsWithNotificationsArray.push(vals);
          console.log('productsWithNotificationsArray',productsWithNotificationsArray);
          setUserDataArray({ 
                            productsWithNotifications: productsWithNotificationsArray, 
                            productsFavorites: userDataArray.productsFavorites
                          });
        }
    }).catch(err=>{
        alert(err); 
    });
  }
              
  const renderAddToCart = () => {
    if (isShowOutOfStockBadge(stock_qty_avail,
                ecom_no_order_unavail,
                sale_max_qty)) {
      return (
        <View style={styles.cartNotifyContainer}>
          <View style={styles.notifyItemPrice}>
            <Text smallMinTitle condensedBold color={black}>
              {getPrice()}
            </Text>
            <Text color={black} condensed>
              {getTag()}
            </Text>
          </View>
          {(productHasNotification) ? (
            <TouchableOpacity
              disabled={true}
              style={styles.notification}
            >
              <View style={styles.circle}>
                <Image source={tick_ic} style={styles.tick} />
              </View>
              <Text smallRegular condensedBold color={notifyBlue}>
                You'll be notified
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.notifyRow}>
              <View style={styles.itemPriceRow}>
                <Text regularPlus condensedBold color={black}>
                  Out of stock
                </Text>
                <Text
                  tiny
                  color={black}
                  textAlign={"right"}
                  style={styles.notifyText}
                >
                  Get a notification{"\n"} when back in stock
                </Text>
              </View>

              <TouchableOpacity
                style={styles.notifyBtn}
                onPress={() => {
                  notifyMe();
                }}
              >
                <Image source={small_bell_ic} style={styles.bell} />
                <Text regularPlus color={quantityGreen}>
                  Notify me
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    } else
      return (
        <View style={styles.cartContainer}>
          <View style={styles.itemPrice}>
            <Text smallMinTitle condensedBold color={black}>
              {getPrice()}
            </Text>
            <Text color={black} condensed>
              {getTag()}
            </Text>
          </View>
          <Button
            disabled={
              isShowOutOfStockBadge(stock_qty_avail,
                ecom_no_order_unavail,
                sale_max_qty) ||
              isAnyApiLoading
            }
            onPress={() => {
              // setIsAddToOrderPopup(true)

              // setIsAddressNotificationShowing(false)
              // setIsNotificationShowing(true)
              hapticFeedback();
              addToCart(productObj, getItemQuantity(productObj) + 1);
            }}
            btnTitle={
              isAnyApiLoading
                ? "Adding..."
                : getItemQuantity(productObj) > 0
                ? "Add another \n (" + getItemQuantity(productObj) + " in cart)"
                : "Add to cart"
            }
            style={[
              styles.cartBtn,
              {
                backgroundColor:
                  (isShowOutOfStockBadge(stock_qty_avail,
                    ecom_no_order_unavail,
                    sale_max_qty) ||
                  isAnyApiLoading)
                    ? greenButtonOpacity
                    : quantityGreen,
              },
            ]}
          />
        </View>
      );
  };

  const renderTopHeader = (item) => {
    return (
      <TapGesture onDoubleTap={() => {
        if (loginData) {
          if (isFavorited) {
            remove_favorite(docId);
          } else {
            set_favorite(docId);
          }
        }
      }}>
        <View style={styles.headerTop}>
          <FastImage
            source={{ uri: get_thumbnail(item, 512) }}
            style={styles.itemImg}
          ></FastImage>
        </View>
      </TapGesture>
    );
  };

  const dataImage = (!images || images.length == 0) ? [image_app] : [image_app, ...images.map(i => i.image)];
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
        <ScrollView bounces={true} ref={scrollRef}>
          <View style={styles.imgSection}>
            <View>
              {(loginData) &&
                <TouchableOpacity
                  onPress={() => {
                    //setIsFavorited(!isFavorited)
                    if (isFavorited) {
                      remove_favorite(docId);
                    } else {
                      set_favorite(docId);
                    }
                  }}
                  style={styles.heartContainer}
                >
                  {isFavorited ? <HEART_SELECTED_SMALL /> : <HEART_TRANSPARENT />}
                </TouchableOpacity>
              }
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
          {renderTextContent()}
          {nutritionArray.length > 0 && renderNutrition()}
          {productsInThisBundle.length > 0 && renderInThisBundle()}
          {recommendedProducts.length > 0 && renderRecommended()}
        </ScrollView>
        <TouchableOpacity
          onPress={() => {
            setShowDetailsModal(false);
            //navigation.goBack()
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
            content={PopupContent}
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

export default ProductDetails;
