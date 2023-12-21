import React, { useContext, useMemo } from "react";
import { View, TouchableOpacity, ImageBackground} from "react-native";
import styles from "./Styles";
import { appColors, appImages } from "../../theme";
import { Text, TapGesture } from "../../components/";
// import FadeIn from "react-native-fade-in-image";
import helpers from "../../helpers";
const { number_format, get_thumbnail, isShowOutOfStockBadge, hapticFeedback } = helpers;
import FastImage from "react-native-fast-image";
const {
  textDarkGray,
  black,
  accountSettingGray,
  white,
  darkGrey,
} = appColors;
import AppContext from "../../provider";
const { not_available_ic,
HEART_TRANSPARENT,
HEART_SELECTED_SMALL } = appImages;
import ProductQuantityEdit from "./ProductQuantityEdit";
import Services from "../../services";
const { API } = Services;

const ProductItem = ({ obj, onSelectQuantity, onPress }) => {
  if (obj.items) {
    return (
      <View key={docId}>
        <View style={styles.textRow}>
          <Text regular color={accountSettingGray}>
            {obj.name}
          </Text>
        </View>
      </View>
    )
  } 
  
  let {
    stock_qty_avail,
    image_app,
    categ_id,
    ecom_no_order_unavail,
    badge_bgc_app,
    badge_text_app,
    docId,
    name,
    sale_price,
    product_origin,
    sale_tax_id,
    sale_invoice_uom_id,
    sale_uom_id,
    sale_price_order_uom,
    sale_max_qty,
    old_sale_price,
    sale_qty_multiple,
  } = obj;
  sale_invoice_uom_id = sale_invoice_uom_id || {};

  const { 
    cartData, 
    isAnyApiLoading, 
    loginData,
    setIsApiLoaderShowing,
    userDataArray,
    setUserDataArray
  } = useContext(AppContext);
  
  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
  } else {
    var user_id = null;
    var token = null;
  }
  
  const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
  const idEmmojiText = regexExp.test(badge_text_app);

  const getQuantityInCart = () => {
    const items = cartData?.lines;
    let result = 0;
    if (items && items.length > 0) {
      const cartFilteredArray = items.filter((x) => x.product_id.id == docId);
      if (cartFilteredArray.length > 0) {
        result = cartFilteredArray.reduce(
          (prev, current) => prev + current.total_qty,
          0
        );
      }
    }
    return result;
  }

  const quantity = useMemo(getQuantityInCart, [cartData?.lines, docId]);

  const getPrice = (
    sale_invoice_uom_id,
    sale_price,
    sale_price_order_uom,
    old_sale_price
  ) => {
    if (sale_invoice_uom_id && sale_invoice_uom_id.name == "KG") {
      return <>{(old_sale_price) && <Text style={{ textDecorationLine: 'line-through' }}>~฿{number_format(old_sale_price, "0,0")}</Text>} ~฿{number_format(sale_price_order_uom, "0,0")}</>;
    } else {
      return <>{(old_sale_price) && <Text style={{ textDecorationLine: 'line-through' }}>฿{number_format(old_sale_price, "0,0")}</Text>} ฿{number_format(sale_price, "0,0")}</>;
    }
  };

  const getExtraPrice = (sale_tax_id, sale_price, sale_invoice_uom_id) => {
    if (sale_tax_id == "76" || sale_tax_id == "77") {
      if (sale_invoice_uom_id && sale_invoice_uom_id.name) {
        return " (฿" + number_format(sale_price, "0,0") + "/" + sale_invoice_uom_id.name + ")";
      } else {
        return " (฿" + number_format(sale_price, "0,0") + ")";
      }
    } else {
      if (sale_invoice_uom_id && sale_invoice_uom_id.name) {
        return "฿" + number_format(sale_price, "0,0") + "/" + sale_invoice_uom_id.name;
      } else {
        return "฿" + number_format(sale_price, "0,0");
      }
    }
  };

  const isFavorited = userDataArray.productsFavorites.find((favorite) => favorite.product_id == docId);

  const renderTextContent = () => {
    return (
      <View style={styles.rightContainer}>
        <View style={styles.inner}>
          <View>
            <View style={styles.headingRow}>
              <Text extSmall color={textDarkGray} lineHeight={20}>
                {product_origin}
              </Text>
              {isFavorited && <HEART_SELECTED_SMALL height="20" width="20"/>}
            </View>
            <Text
              bold
              smallRegular
              color={accountSettingGray}
              noOfLines={3}
              lineHeight={18.79}
              style={styles.someMargin}
            >
              {name} {/*{docId} {stock_qty_avail} {(ecom_no_order_unavail) && <>ecom_no_order_unavail</>} {(sale_max_qty) && <>sale_max_qty</>} */} 
            </Text>
          </View>

          <View>
            <View style={styles.bottomRow}>
              <View>
                <View style={styles.pricesRow}>
                  <Text
                    condensedBold
                    color={black}
                    style={styles.margin}
                    lineHeight={17}
                  >
                    {getPrice(
                      sale_invoice_uom_id,
                      sale_price,
                      sale_price_order_uom,
                      old_sale_price
                    )}
                    {sale_uom_id &&
                      <Text color={black} bold small>
                        {` per ${sale_uom_id.name} `}
                      </Text>
                    }
                  </Text>
                </View>
                <View
                  style={[
                    styles.taxRow,
                    {
                      marginBottom:
                        stock_qty_avail !== null &&
                        stock_qty_avail < 5 &&
                        stock_qty_avail > 0
                          ? -2
                          : 0,
                    },
                  ]}
                >
                  {(sale_tax_id == "76" || sale_tax_id == "77") && (
                    <Text
                      tiny
                      color={textDarkGray}
                      lineHeight={13.24}
                      style={styles.twoMargin}
                    >
                      {"ex VAT"}
                    </Text>
                  )}
                  {(sale_invoice_uom_id && sale_invoice_uom_id.name == "KG") && (
                    <Text extSmall condensed color={textDarkGray}>
                      {getExtraPrice(
                        sale_tax_id,
                        sale_price,
                        sale_invoice_uom_id
                      )}
                    </Text>
                  )}
                </View>
                {stock_qty_avail !== null &&
                  stock_qty_avail < 5 &&
                  stock_qty_avail > 0 && (
                    <Text
                      extSmall
                      color={darkGrey}
                      style={styles.foureMargin}
                      lineHeight={17.21}
                    >
                      {stock_qty_avail - quantity + " left in stock"}
                    </Text>
                  )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const isShowNotAvailBadge = (categ_id) => {
    let showBadge = false;

    if (categ_id == "394" || categ_id == "406") {
      showBadge = true;
    }
    
    return showBadge;
  };

  const set_favorite = async () => {
    await API.execute(
      "prod.fav",
      "add_fav",
      [parseInt(docId), parseInt(accountInfo.contact_id.id)],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id }
    )
      .then((res) => {
        console.log("set fav--", res, docId);
        
        vals = {
          product_id: docId
        }
        // Setting up the array here instead of rereading it from the server every time productsWithNotifications
        var productsWithFavoritesArray = [...userDataArray.productsFavorites];
        const old = productsWithFavoritesArray.find((favorite) => favorite.product_id == docId);
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

  const remove_favorite = async () => {
    await API.execute(
      "prod.fav",
      "del_fav",
      [docId, parseInt(accountInfo.contact_id.id)],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id }
    )
      .then((res) => {
        console.log("remove--", res);
        
        // What do we do here ... do we read all the products again !?
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

  const onDoubleTap = () => {
    if (loginData) {
      if (isFavorited) {
        remove_favorite();
      } else {
        set_favorite();
      }
    }
  };

  const renderAddToCart = () => {
    var disable_add_to_cart = false;

    // Maximum Quantity that can be ordered
    let max_qty = 999;
    if (ecom_no_order_unavail) {
      max_qty = stock_qty_avail;
    }
    
    if (sale_max_qty && sale_max_qty < max_qty) {
      max_qty = sale_max_qty;
    }

    if (max_qty <= 0) {
      disable_add_to_cart = true;
    }
    return (
      <TouchableOpacity style={styles.addToCart}>
        <ProductQuantityEdit
          quantity={quantity}
          isOutOfStock={
            isShowOutOfStockBadge(
              stock_qty_avail,
              ecom_no_order_unavail,
              sale_max_qty
            )
          }
          disabled={disable_add_to_cart || isAnyApiLoading}
          onSelectQuantity={onSelectQuantity}
          product_id={docId}
          max_qty={max_qty}
          sale_qty_multiple={sale_qty_multiple}
        />
      </TouchableOpacity>
    )
  };

  // console.log('ecom_hide_unavail',ecom_hide_unavail);
  
  // <FadeIn style={styles.imgFadeContainer}> - removed as it seems to slow things down actually. Also FastImage also does preloading
  
  // if (ecom_hide_unavail == true) {
    // return null;
  // } else {
    if (name) {
    return (
      <View key={docId}>
        <TapGesture onSingleTap={onPress} onDoubleTap={onDoubleTap}>
          <View style={[styles.cell]}>
              <View style={styles.ImgContainer}>
                <FastImage
                  source={{
                    uri: get_thumbnail(image_app, 512),
                  }}
                  style={styles.cellImg}
                >
                  {badge_text_app && badge_text_app.length > 2 && (
                    <View
                      style={[
                        styles.bestseller,
                        {
                          backgroundColor: badge_bgc_app,
                          height: idEmmojiText ? 20 : 15,
                        },
                      ]}
                    >
                      <Text
                        minSmall
                        condensed
                        color={white}
                        textAlign="center"
                        lineHeight={15}
                        noOfLines={1}
                        style={{
                          marginTop: idEmmojiText ? 0 : -1.5,
                        }}
                      >
                        {badge_text_app}
                      </Text>
                    </View>
                  )}

                  {isShowNotAvailBadge(categ_id) && (
                    <View style={styles.notAvailable}>
                      <ImageBackground
                        source={not_available_ic}
                        style={styles.notAvailableImg}
                      >
                        <Text condensedBold minSmall color={white}>
                          + 1
                        </Text>
                      </ImageBackground>
                      <Text tiny condensedBold color={white}>
                        Order before 8pm{"\n"}for next day
                      </Text>
                    </View>
                  )}
                  {isShowOutOfStockBadge(
                    stock_qty_avail,
                    ecom_no_order_unavail,
                    sale_max_qty
                  ) && (
                    <TouchableOpacity onPress={() => {}} style={styles.Unavailable}>
                      <Text extSmall condensedBold color={white}>
                        Out of stock
                      </Text>
                      <Text tiny color={white}>
                        Get a notification when back in stock
                      </Text>
                    </TouchableOpacity>
                  )}
                </FastImage>
              </View>
            {renderTextContent()}
          </View>
        </TapGesture>
        {renderAddToCart()}
      </View>
    );
    } else {
      return null;
    }
    
  // }
};

export default ProductItem;
