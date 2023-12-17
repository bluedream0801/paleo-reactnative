import React, { useState, useContext, useCallback, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  Image,
} from 'react-native'
import { Emoticon, Text } from "../../components";
import styles from "./FreshMenuStyles";
const {
  green,
  black,
  lessDarkGray,
  accountSettingGray,
  dragShadow,
  blackOpacity,
  orderDarkGray,
  mealsGrey,
  addressGrey,
} = appColors;
import helpers from '../../helpers'
const { get_thumbnail, isShowOutOfStockBadge, hapticFeedback } = helpers
import AppContext from '../../provider'
import Services from '../../services'
const { API } = Services
import { useFocusEffect } from '@react-navigation/native';
const { bell_ic, right_arrow, notified, success_ic } = appImages;

const FreshMenu = (props) => {
  
  const { navigation } = props

  const {
    setIsApiLoaderShowing,
    loginData,
    cartData,
    isAnyApiLoading,
    setIsAnyApiLoading,
    updateCartId,
  } = useContext(AppContext)
  
  const [animationValue, setAnimationValue] = useState(new Animated.Value(1));
  
  const [hasPastOrders, setHasPastOrders] = useState(false);
  const [ordersDataArray, setOrdersDataArray] = useState([]);
  
  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
  } else {
    var user_id = null;
    var token = null;
  }
  
  useFocusEffect(
    useCallback(() => {
      if (loginData) {
        GetLatestOrdersProducts();
      }
    }, [])
  );

  const animationStart = () => {
    Animated.spring(animationValue, {
      toValue: 0.9,
      friction: 1.5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => {
    Animated.spring(animationValue, {
      toValue: 1.11,
      friction: 1.5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  /*
  useEffect(() => {
    let sections = [];
    sections.push({
        time: true
    });
    sections.push({
        title: "BYO: Plate",
        shortTitle: "Plate",
        uomID: "Build your own",
        text: "Expand details",
        image: "https://backend.paleorobbie.com/static/db/plr/files/IMG_8471 (1),V82zMfsG37I=.jpg",
        price: 438,
        time: false,
        adMore: false,
        borderBottomWidth: 1,
        key: 1,
        section: 2,
        delivery_date: "2023-10-23",
        delivery_slot_id: 3,
        id: 2611398,
        qty: 1,
        isActive: true,
        product_id: {
            "byo_plate_id": {
                "dressings": [{"id": 109418, "product_id": {"id": 18763, "name": "Chimichurri"}, "qty": 1}], 
                "id": 19657, 
                "premium_addons": [{"id": 109421, "product_id": {"id": 18754, "name": "Fresh blueberries"}, "qty": 1}], 
                "proteins": [{"id": 109417, "product_id": {"id": 27011, "name": "Grass-fed rump steak"}, "qty": 1}], 
                "sides": [{"id": 109419, "product_id": {"id": 28494, "name": "Spinach with crunchy almond butter & chili"}, "qty": 1}, {"id": 109420, "product_id": {"id": 32158, "name": "Pak choi in Garlic sauce"}, "qty": 1}]
            },
            "byo_salad_id": null, 
            "ecom_short_title": null, 
            "id": 36671, 
            "image": "IMG_8471 (1),V82zMfsG37I=.jpg", 
            "name": "BYO: Plate"
        },
        expanded: false,
        notified: false,
    });
    sections.push({"adMore": false, "borderBottomWidth": 1, "delivery_date": "2023-10-23", "delivery_slot_id": 3, "expanded": false, "id": 2611405, "image": "https://backend.paleorobbie.com/static/db/plr/files/IMG_9464,zjDeOS9t7Fo=.jpg", "key": 2, "price": 399, "product_id": {"byo_plate_id": null, "byo_salad_id": null, "ecom_short_title": "Italian pork meatballs", "id": 27217, "image": "IMG_9464,zjDeOS9t7Fo=.jpg", "name": "Baked Pork Meatballs in Amatriciana Sauce"}, "qty": 1, "isActive": false, "section": 2, "shortTitle": "Italian pork meatballs", "text": "", "time": false, "title": "Baked Pork Meatballs in Amatriciana Sauce", "uomID": "Jumbo", "notified": false});
    sections.push({"adMore": false, "borderBottomWidth": 1, "delivery_date": "2023-10-23", "delivery_slot_id": 3, "expanded": false, "id": 2611406, "image": "https://backend.paleorobbie.com/static/db/plr/files/IMG_9915,9nDW3iqKKZ8=.jpg", "key": 3, "price": 399, "product_id": {"byo_plate_id": null, "byo_salad_id": null, "ecom_short_title": "Cacciatore Stew", "id": 16029, "image": "IMG_9915,9nDW3iqKKZ8=.jpg", "name": "Chicken Cacciatore Stew"}, "qty": 1, "isActive": false, "section": 2, "shortTitle": "Cacciatore Stew", "text": "", "time": false, "title": "Chicken Cacciatore Stew", "uomID": "Jumbo", "notified": false});
    setOrdersDataArray(sections);
  }, [])
  */
  
  const GetLatestOrdersProducts = async () => {
    try {
      var res = await API.execute(
        "sale.order",
        "search_read_path",
        [
          [
            ["contact_id", "=", accountInfo.contact_id.id],
            ["state", "=", "paid"],
            ["plr_order_type", "in", ["meal","combined"]]
          ],
          [
            // Order fields
            "date",
            "number",
            "ecom_state",
            "plr_order_type",

             // Lines from Order Details
            "lines.product_id.name",
            "lines.product_id.ecom_short_title",
            "lines.product_id.ecom_short_subtitle",
            
            "lines.product_id.code",
            "lines.product_id.image",
            
            "lines.product_id.ecom_subscribing",

            // Lines from Grocery
            "lines.feedback2.comments",
            "lines.feedback2.rating_id.name",
            "lines.product_id.ecom_no_order_unavail",
            "lines.product_id.ecom_notif_waiting",
            "lines.product_id.sale_uom_id.name",
            "lines.product_id.uom_id",
            "lines.product_id.is_favorite",
            "lines.product_id.categ_id",
            "lines.product_id.sold_out",
            
          ],
        ],
        {
          order: "date desc, number desc",
          limit: 10,
        },
        setIsApiLoaderShowing,
        {token: token, user_id: user_id}
      );

      const orderList = res;
      // I recommend using something like this in the rendering
      // console.log('orderList',orderList);
      
      let sections = [];
      
      if (orderList.length) {
        
        sections.push({
            time: true
        });
        
        var pushed_ids = [];
      
        orderList.forEach((order) => {
          // console.log('line.product_id.code',order);
          order.lines.forEach((line) => {
              // console.log('line', line);
            // if (line.product_id.code !== "DELIVERY" && line.product_id.code !== "VOUCHER" && line.product_id.code !== "STAFFGROCERIES" && line.product_id.code !== "STAFFVOUCHER" && line.product_id.categ_id !== 364 ) {
              if (line.product_id) {
                if (line.product_id.categ_id == 390 || line.product_id.categ_id == 391 || line.product_id.categ_id == 396) {
                  
                  console.log('line.product_id.id',line.product_id.id, pushed_ids.includes(current_product_id));
                  
                  var current_product_id = line.product_id.id;
                  
                  if (pushed_ids.includes(current_product_id) ) {
                      // Do nothing
                  } else {
                      
                      pushed_ids.push(line.product_id.id);
                      
                      var current_notified = false;
                      if (line.product_id.ecom_subscribing) {
                          current_notified = true;
                      }
                      console.log('current_product_notified',line.product_id.id, line.product_id.ecom_subscribing, current_notified);
                      line = {...line.product_id, docId: line.product_id.id, lineId: line.id, "text": "", expanded: false, notified: current_notified, feedback2:line.feedback2};
                      sections.push(line);
                      // pushed_ids.push(line.product_id.id);
                  }
                  
                }
              }
            // }
          });
        });

        setOrdersDataArray(sections);
        setHasPastOrders(!!sections.length);
      
      }
      
      console.log('sections',sections);
      
    } catch (err) {
      console.log("err", err);
    }
  };
  
  const addReview = async (product_id, line_id, rating) => {
    
    var correct_rating = '';
    if (rating == 1) {
      correct_rating = 'fire';
    }
    if (rating == 2) {
      correct_rating = 'thumbs_up';
    }
    if (rating == 3) {
      correct_rating = 'sad';
    }
    if (rating == 4) {
      correct_rating = 'spicy';
    }
    
    var opts={
        product_id: product_id,
        related_id: "sale.order.line," + line_id,
        rating: correct_rating,
    };
    
    try {
      var res = await API.execute(
        "feedback2",
        "save_rating",
        [],
        opts,
        setIsApiLoaderShowing,
        {token: token, user_id: user_id}
      );
      // console.log('sections',sections);      
    } catch (err) {
      console.log("err", err);
    }
    
  };
  
  const notifyMe = (product_id, notify) => {
    
    var action = "remove_ecom_subscribe";
    if (notify == true) {
        action = "add_ecom_subscribe";
    }
    
    console.log('testing action', product_id, notify, action);
    
    if (loginData) {
      API.execute("product",action,
      [[product_id]],
      {},
      setIsApiLoaderShowing,
      { token, user_id }).then(res=>{
          console.log('Product should be subscribed to notifications',res);
          // No error
      }).catch(err=>{
          alert(err);
      });
    } else {
      alert('You need to login before subscribing to product notifications!');
    }
  }

  const renderListItem = (obj, index) => {
    const isActive = false;
    
    console.log('obj',obj);

    if ( obj.time ) {
        return (
            <>
            <View
                style={[
                styles.textRow,
                { marginTop: index == 0 ? 14 : 21, marginBottom: 6 },
                ]}
            >
                <Text smallRegular color={orderDarkGray} lineHeight={18.53}>
                    Past ordered meals
                </Text>
                <Text small color={addressGrey}>
                    Notify me
                </Text>
            </View>
            </>
        );
    } else {
      
      var default_emoticon = 0;
      
      if (obj.feedback2[0]) {
        if (obj.feedback2[0].rating_id) {
          if (obj.feedback2[0].rating_id.name == 'fire') {
            default_emoticon = 1;
          }
          if (obj.feedback2[0].rating_id.name == 'thumbs_up') {
            default_emoticon = 2;
          }
          if (obj.feedback2[0].rating_id.name == 'sad') {
            default_emoticon = 3;
          }
          if (obj.feedback2[0].rating_id.name == 'spicy') {
            default_emoticon = 4;
          }
        }
      }
      
      return (
        <>
          <Animated.View
            style={[
              ,
              styles.itemContainerCell,
              {
                shadowColor: isActive ? dragShadow : "rgba(0, 0, 0, 0,1)",
                shadowOffset: { width: 0, height: isActive ? 0 : 0 },
                shadowOpacity: isActive ? 0.8 : 0,
                shadowRadius: isActive ? 14 : 0,
                elevation: isActive ? 5 : 0,
                transform: [
                  { scale: isActive ? animationValue : new Animated.Value(1) },
                ],
              },
            ]}
          >
            <TouchableOpacity
              onPressIn={() => {
                handlePressIn();
              }}
              onPressOut={() => {
                animationStart();
              }}
              onPress={() => {
                if (obj.text == "Expand details") {
                  obj.expanded = !obj.expanded;
                  setOrdersDataArray([...ordersDataArray]);
                }
              }}
              style={[
                styles.itemCell,
                {
                  borderRadius: isActive ? 5 : 0,
                  borderBottomWidth: ordersDataArray.length == index + 1 ? 0 : 1,
                  borderTopLeftRadius: index == 0 ? 5 : 0,
                  borderTopRightRadius: index == 0 ? 5 : 0,
                  borderBottomLeftRadius: ordersDataArray.length == index + 1 ? 5 : 0,
                  borderBottomRightRadius: ordersDataArray.length == index + 1 ? 5 : 0
                },
              ]}
            >
              <View style={styles.cellRowrow}>
                <View style={styles.imgContainerCell}>
                  <Image source={{ uri: get_thumbnail(obj.image, 256) }} style={styles.favouries} />
                  {/*
                  {!obj.isActive && <View style={styles.Unavailable}>
                    <Text style={styles.Unavailable_Text}>Unavailable</Text>
                  </View>}
                  */}
                </View>
                <View style={styles.textContainer}>
                  <Text color={accountSettingGray} noOfLines={2}>
                    <Text condensedBold minSmall lineHeight={14} color={accountSettingGray} style={{textTransform: 'uppercase'}}>
                      {obj.sale_uom_id ? obj.sale_uom_id?.name + ' | ' : null}
                    </Text>
                    <Text small lineHeight={14} color={accountSettingGray}>{obj.ecom_short_title} {obj.ecom_short_subtitle}</Text>
                  </Text>
                  <View style={styles.dropDownRow}>
                    <Text
                      extSmall
                      noOfLines={1}
                      color={accountSettingGray}
                      style={styles.detailsText}
                    >
                      {obj.expanded && obj.text == "Expand details"
                        ? "Collapse details"
                        : obj.text}
                    </Text>

                    {obj.text == "Expand details" && (
                      <Image
                        source={right_arrow}
                        style={[
                          styles.smallArrow,
                          {
                            transform: obj.expanded
                              ? [{ rotate: "-90deg" }]
                              : [{ rotate: "90deg" }],
                          },
                        ]}
                      />
                    )}
                    {obj.text != "Expand details" &&
                        <Emoticon item={obj} addReview={addReview} default_emoticon={default_emoticon}/>
                    }
                  </View>
                </View>
              </View>
              {obj.text != "Expand details" &&
                <View style={styles.delRow}>
                    <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                        notifyMe(obj.id, !obj.notified);
                        obj.notified = !obj.notified;
                        setOrdersDataArray([...ordersDataArray]);
                    }}
                    >
                        <Image source={obj.notified?success_ic:bell_ic} style={obj.notified?styles.OkImg:styles.delImg} />
                    </TouchableOpacity>
                </View>
              }
            </TouchableOpacity>
            
            {/*
            {(obj.expanded && obj.text == "Expand details") &&
               renderExpendedDetailsNew(obj.product_id)
            }
            */}
          </Animated.View>
        </>

      );
    }
  }
  
  /* FROM Reorder */
  /*
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
  */
  
  /*
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
  */
  
  /*
  // Not needed as we don't show BYO's - keep for the future if needed
  const renderExpendedDetailsNew = (product_id) => {
    
    return (
      <>
        {(product_id && product_id.byo_salad_id && product_id.byo_salad_id!==null) &&
          <View style={styles.expendedDetails}>
            {(product_id.byo_salad_id.salad_mix !=null && product_id.byo_salad_id.salad_mix.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Salad mix:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_salad_id.salad_mix[0].product_id.name}
                </Text>
              </Text>
            }
            {(product_id.byo_salad_id.proteins !=null && product_id.byo_salad_id.proteins.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Protein:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_salad_id.proteins[0].product_id.name}
                </Text>
              </Text>
            }
            
            {(product_id.byo_salad_id.dressings !=null && product_id.byo_salad_id.dressings.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Dressing:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_salad_id.dressings[0].product_id.name}
                </Text>
              </Text>
            }
            
            {(product_id.byo_salad_id.premium_addons !=null && product_id.byo_salad_id.premium_addons.length>0) &&
              <>
              {product_id.byo_salad_id.premium_addons.map((item_details,i)=>{
                return <Text extSmall color={orderDarkGray} lineHeight={17} key={i}>
                          Add-ons:
                          <Text extSmall color={accountSettingGray}>
                            {" "}
                            ({item_details.qty}) {item_details.product_id.name}
                          </Text>
                        </Text>
              })}
              </>
            }
            
          </View>
        }        
        {(product_id && product_id.byo_plate_id && product_id.byo_plate_id!==null) &&
          <View style={styles.expendedDetails}>
            {(product_id.byo_plate_id.proteins !=null && product_id.byo_plate_id.proteins.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Protein:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_plate_id.proteins[0].product_id.name}
                </Text>
              </Text>
            }
            {(product_id.byo_plate_id.dressings !=null && product_id.byo_plate_id.dressings.length>0) &&
              <Text
                extSmall
                color={orderDarkGray}
                lineHeight={17}
                style={styles.marginBottom}
              >
                Sauce:
                <Text extSmall color={accountSettingGray}>
                  {" "}
                  {product_id.byo_plate_id.dressings[0].product_id.name}
                </Text>
              </Text>
            }
            
            {(product_id.byo_plate_id.sides !=null && product_id.byo_plate_id.sides.length>0) &&
              <>
              {product_id.byo_plate_id.sides.map((item_details,i)=>{
                return <Text extSmall color={orderDarkGray} lineHeight={17} key={i}>
                          Side
                          <Text extSmall color={accountSettingGray}>
                            {" "}
                            ({item_details.qty}) {item_details.product_id.name}
                          </Text>
                        </Text>
              })}
              </>
            }
            
            {(product_id.byo_plate_id.premium_addons !=null && product_id.byo_plate_id.premium_addons.length>0) &&
              <>
              {product_id.byo_plate_id.premium_addons.map((item_details,i)=>{
                return <Text extSmall color={orderDarkGray} lineHeight={17} key={i}>
                          Add-ons:
                          <Text extSmall color={accountSettingGray}>
                            {" "}
                            ({item_details.qty}) {item_details.product_id.name}
                          </Text>
                        </Text>
              })}
              </>
            }
          </View>
        }
        <View style={styles.expendedDetails}>
            <TouchableOpacity
            style={styles.saveBtn}
            >
                <Text style={{color: '#FFF'}}>Save this plate</Text>
            </TouchableOpacity>
        </View>
      </>
    )
    
  };
  */

  const renderCartItems = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.flex}>
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={ordersDataArray}
            style={styles.listStyle}
            renderItem={({ item, index }) => renderListItem(item, index)}
          />          
          <Text small style={{textAlign: 'center', marginTop: 5}} color={orderDarkGray} lineHeight={18.53}>
            Our Fresh menu rotates every 3 days! Hit the bell button to be notified when your favorite meals are back on the menu.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView scrollEnabled={true} style={{ flex: 1 }}>
        {hasPastOrders ? (
          renderCartItems()
        ) : (
          <View>
            <View style={styles.nothing}>
                <Text
                  condensedBold
                  largeRegularBetween
                  color={mealsGrey}
                  lineHeight={31}
                >
                  You haven’t any Past Orders yet.
                </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
  
  /* From Reorder */
  /*
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
    </View>
  );
  */
}

export default FreshMenu
