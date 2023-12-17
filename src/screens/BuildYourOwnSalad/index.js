import React, { useState, createRef, useContext, useCallback } from 'react'
import {
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native'
import AppContext from '../../provider'
import { appImages, appColors, appMetrics } from '../../theme'
import Services from '../../services'
const { API } = Services

import helpers from "../../helpers";
// Clear whatever is not used from the helpers
const {
  getCartType,
  number_format,
  get_thumbnail,
  meal_cart_total_qty,
  getDefaultDateForFreshMeals,
  hapticFeedback,
} = helpers;

import { useFocusEffect } from '@react-navigation/native'

const { screenWidth } = appMetrics
const {
  black,
  darkGray,
  accountSettingGray,
  addressGrey,
  headerBgColor,
  greenShaded,
  textDarkGray,
  greenButtonOpacity,
  quantityGreen,
} = appColors
const {
  close,
  delete_ic,
  circle_animation,
} = appImages
import { Button, Text, PopupModal } from '../../components/'
import styles from './Styles'
import saladsStyles from './SaladsStyles'
import Salads from './Salads'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const PupupContent = 'Only 1 dressing is allowed.'

import moment from "moment";
import { CUTOFF_TIME } from "../../common/constants";
import * as momenttz from 'moment-timezone';

const SaladsList = [
  {
    title: 'Salad mixes',
    heading: 'Salad mix (0/1)',
    smallTitle: false,
    index: 0,
    data: [
    ],
    numColumns: 2,
    cellWidth: (screenWidth - 34) / 2,
    height: 150,
    imgHeight: 83,
  },
  {
    title: 'Proteins',
    smallTitle: ' Optional.',
    heading: 'Protein (0/1)',
    index: 1,
    data: [
    ],
    numColumns: 3,
    cellWidth: (screenWidth - 44) / 3,
    height: 160,
    imgHeight: 83,
  },
  {
    title: 'Dressings',
    heading: 'Dressing (0/1)',
    smallTitle: ' Optional, served on the side.',
    index: 2,
    data: [
    ],
    numColumns: 4,
    cellWidth: (screenWidth - 54) / 4,
    height: 128,
    imgHeight: 66,
  },
  {
    title: 'Premium add-ons',
    smallTitle: ' Optional, maximum 2 total.',
    heading: 'Premium add-ons (0/2)',
    index: 3,
    data: [
    ],
    numColumns: 4,
    cellWidth: (screenWidth - 54) / 4,
    height: 160,
    imgHeight: 83,
  },
]

const BuildYourOwnSalad = (props) => {
  const { navigation } = props
  const [currentTab, setCurrentTab] = useState(0)
  const tabRef = createRef()

  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const {
    loginData,

    // Cart Related Context
    // Grocery Cart
    cartData,
    setCartData,
    // Meal Cart
    mealsCartData,
    setMealsCartData,
    setIsAnyApiLoading,

    setIsAnyPopupOpened,
    
  } = useContext(AppContext)

  const defaultDate = getDefaultDateForFreshMeals();
  const { formattedTomorrow } = defaultDate;


  if (loginData) {
    var { accountInfo, token, user_id } = loginData;
    var { contact_id } = accountInfo;
    var { default_address_id, addresses } = contact_id;
  } else {
    var user_id = null;
    var token = null;
  }

  const [selectedItems, setselectedItems] = useState([])
  const [saladArray, setSaladArray] = useState(SaladsList)

  const [isAddToCartProcessing, setIsAddToCartProcessing] = useState(false)

  const [routes] = React.useState([
    { key: 'first', title: 'Salad mixes' },
    { key: 'first', title: 'Proteins' },
    { key: 'second', title: 'Dressings' },
    { key: 'third', title: 'Premium' },
  ])

  useFocusEffect(
    useCallback(() => {

      API.execute("byo.component","search_read_path",[
          ["byo_type","=","salad"],
          [
            "comp_type",
            "price",
            "product_id.name",
            "product_id.ecom_short_title",
            "product_id.ecom_short_subtitle",

            "product_id.sale_price",
            "product_id.image",
            "product_id.sale_invoice_uom_id.name",
            "product_id.sale_uom_id.name",
            "product_id.description",
            "product_id.packing_size",

            "product_id.nutrition_id.calories",
            "product_id.nutrition_id.protein_g",
            "product_id.nutrition_id.lipid_tot_g",
            "product_id.nutrition_id.carbohydrt_g",
          ]
        ],
        {},
        setIsAnyApiLoading,
        {token, user_id}
        ).then(data=>{
          console.log("byo data", data);

          var newSaladArray =[];

          var salad_mix_section = {};
          var salad_mix_products=[];

          var proteins_section = {};
          var proteins_products=[];

          var dressing_section = {};
          var dressing_products=[];

          var addon_section = {};
          var addon_products=[];

          var counter = 0;

          (data || []).forEach((meal,i) => {

            counter++;

            var product_line = {};

            if (meal.comp_type == 'salad_mix') {
              product_line =
              {
                section: 'salad_mix',
                heading: meal.product_id.ecom_short_title+' '+meal.product_id.ecom_short_subtitle, // 'Grass fed NZ rump steak 90g serving' // meal.product_id.ecom_short_subtitle
                price: meal.product_id.sale_price, // '฿339',
                product_id: meal.product_id.id,
                calories: meal.product_id.nutrition_id.calories,
                protein_g: meal.product_id.nutrition_id.protein_g,
                lipid_tot_g : meal.product_id.nutrition_id.lipid_tot_g,
                carbohydrt_g : meal.product_id.nutrition_id.carbohydrt_g,
                image: {uri: get_thumbnail(meal.product_id.image, 512)},
                key: counter,
                QuantityAdded :0,
                cellWidth: (screenWidth - 34) / 2,
              }
              salad_mix_products.push(product_line);
              console.log('salad_mix_products',salad_mix_products);
            }


            if (meal.comp_type == 'protein') {
              product_line =
              {
                section: 'protein',
                heading: meal.product_id.ecom_short_title+' '+meal.product_id.ecom_short_subtitle, // 'Grass fed NZ rump steak 90g serving' // meal.product_id.ecom_short_subtitle
                price: meal.product_id.sale_price, // '฿339',
                product_id: meal.product_id.id,
                calories: meal.product_id.nutrition_id.calories,
                protein_g: meal.product_id.nutrition_id.protein_g,
                lipid_tot_g : meal.product_id.nutrition_id.lipid_tot_g,
                carbohydrt_g : meal.product_id.nutrition_id.carbohydrt_g,
                image: {uri: get_thumbnail(meal.product_id.image, 512)},
                key: counter,
                QuantityAdded :0,
                cellWidth: (screenWidth - 34) / 2,
              }
              proteins_products.push(product_line);
              console.log('proteins_products',proteins_products);
            }

            if (meal.comp_type == 'dressing') {
              product_line =
              {
                section: 'dressing',
                heading: meal.product_id.ecom_short_title, // 'Grass fed NZ rump steak 90g serving' // meal.product_id.ecom_short_subtitle
                price: meal.product_id.sale_price, // '฿339',
                product_id: meal.product_id.id,
                calories: meal.product_id.nutrition_id.calories,
                protein_g: meal.product_id.nutrition_id.protein_g,
                lipid_tot_g : meal.product_id.nutrition_id.lipid_tot_g,
                carbohydrt_g : meal.product_id.nutrition_id.carbohydrt_g,
                image: {uri: get_thumbnail(meal.product_id.image, 512)},
                key: counter,
                QuantityAdded :0,
                cellWidth: (screenWidth - 54) / 4,
              }
              dressing_products.push(product_line);
              console.log('dressing_products',dressing_products);
            }

            if (meal.comp_type == 'addon') {
              product_line =
              {
                section: 'addon',
                heading: meal.product_id.ecom_short_title, // 'Grass fed NZ rump steak 90g serving' // Removed as per jON'S REQUEST +' '+meal.product_id.ecom_short_subtitle
                price: meal.product_id.sale_price, // '฿339',
                product_id: meal.product_id.id,
                calories: meal.product_id.nutrition_id.calories,
                protein_g: meal.product_id.nutrition_id.protein_g,
                lipid_tot_g : meal.product_id.nutrition_id.lipid_tot_g,
                carbohydrt_g : meal.product_id.nutrition_id.carbohydrt_g,
                image: {uri: get_thumbnail(meal.product_id.image, 512)},
                key: counter,
                QuantityAdded :0,
                cellWidth: (screenWidth - 54) / 4,
              }
              addon_products.push(product_line);
              console.log('addon_products',addon_products);
            }

          });

          salad_mix_section = {
            title: 'Salad mixes',
            smallTitle: false,
            index: 0,
            data: salad_mix_products,
            numColumns: 2,
            cellWidth: (screenWidth - 34) / 2,
            height: 150,
            imgHeight: 83,
          }

          console.log('salad_mix_section',salad_mix_section);

          newSaladArray.push(salad_mix_section);

          proteins_section = {
            title: 'Proteins',
            smallTitle: 'Optional.',
            index: 0,
            data: proteins_products,
            numColumns: 3,
            cellWidth: (screenWidth - 44) / 3,
            height: 160,
            imgHeight: 83,
          }

          console.log('proteins_section',proteins_section);

          newSaladArray.push(proteins_section);

          dressing_section = {
            title: 'Dressing',
            smallTitle: ' Optional, served on the side.',
            index: 1,
            data: dressing_products,
            numColumns: 4,
            cellWidth: (screenWidth - 54) / 4,
            height: 128,
            imgHeight: 66,
          }

          console.log('dressing_section',dressing_section);

          newSaladArray.push(dressing_section);

          addon_section = {
            title: 'Premium add-ons',
            smallTitle: ' Optional, maximum 2 total.',
            index: 3,
            data: addon_products,
            numColumns: 4,
            cellWidth: (screenWidth - 54) / 4,
            height: 160,
            imgHeight: 83,
          }

          console.log('addon_section',addon_section);

          newSaladArray.push(addon_section);

          console.log('newSaladArray',newSaladArray);

          setSaladArray(newSaladArray);
      })

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const ongoBack = () => {
    navigation.goBack()
  }

  const addItemInTopList = (itemObj, i, j) => {

    let currentSaladArray = Object.assign([], saladArray)

    console.log('checking 0',i, j, itemObj);

    if (itemObj.section == 'salad_mix') {
      console.log('checking 1');
      // Check if it already exists. If it does remove it.
      if (currentSaladArray[j].data[i]['QuantityAdded'] == 1) {
        currentSaladArray[j].data[i]['QuantityAdded'] = 0;
        console.log('checking 2');
      } else {
        // Make sure we first set any other items to 0 and add the currently selected protein
        for (k=0;k<currentSaladArray[j].data.length;k++) {
          currentSaladArray[j].data[k]['QuantityAdded'] = 0;
          console.log('checking 3');
        }
        currentSaladArray[j].data[i]['QuantityAdded'] = 1;
        console.log('checking 4');
      }
    }

    if (itemObj.section == 'protein') {
      console.log('checking 1');
      // Check if it already exists. If it does remove it.
      if (currentSaladArray[j].data[i]['QuantityAdded'] == 1) {
        currentSaladArray[j].data[i]['QuantityAdded'] = 0;
        console.log('checking 2');
      } else {
        // Make sure we first set any other items to 0 and add the currently selected protein
        for (k=0;k<currentSaladArray[j].data.length;k++) {
          currentSaladArray[j].data[k]['QuantityAdded'] = 0;
          console.log('checking 3');
        }
        currentSaladArray[j].data[i]['QuantityAdded'] = 1;
        console.log('checking 4');
      }
    }

    if (itemObj.section == 'dressing') {
      console.log('checking 1');
      // Check if it already exists. If it does remove it.
      if (currentSaladArray[j].data[i]['QuantityAdded'] == 1) {
        currentSaladArray[j].data[i]['QuantityAdded'] = 0;
        console.log('checking 2');
      } else {
        // Make sure we first set any other items to 0 and add the currently selected protein
        for (k=0;k<currentSaladArray[j].data.length;k++) {
          currentSaladArray[j].data[k]['QuantityAdded'] = 0;
          console.log('checking 3');
        }
        currentSaladArray[j].data[i]['QuantityAdded'] = 1;
        console.log('checking 4');
      }
    }

    if (itemObj.section == 'addon') {
      console.log('checking 1');
      // Maximum of 2
      // Get Addons total quantity
      var total_addons = 0;
      for (k=0;k<currentSaladArray[j].data.length;k++) {
        total_addons += currentSaladArray[j].data[k]['QuantityAdded'];
      }

      if (total_addons < 2) {
        currentSaladArray[j].data[i]['QuantityAdded'] +=1;
        console.log('checking 2');
      } else {
        alert('You can only have 2 Premium Addons per salad.');
      }

    }

    console.log('currentSaladArray[j].data[i]',currentSaladArray[j].data[i]);

    console.log('currentSaladArray[j].data[i]QQ',currentSaladArray[j].data[i]['QuantityAdded']);

    console.log('currentSaladArray[j].data',currentSaladArray[j].data)

    setSaladArray(currentSaladArray)

  }

  const deletItemFromTopList = (item, index) => {
    let currentSaladArray = Object.assign([], saladArray)

    for (j=0;j<4;j++) {
      for (k=0;k<currentSaladArray[j].data.length;k++) {
        if (currentSaladArray[j].data[k]['product_id'] == item.product_id) {
          currentSaladArray[j].data[k]['QuantityAdded'] = 0;
        }
      }
    }
    setSaladArray(currentSaladArray)
  }

  const insets = useSafeAreaInsets();

  const renderHeader = () => {

    let currentSaladArray = Object.assign([], saladArray)
    var current_selected_items = [];

    for (j=0;j<4;j++) {
      for (k=0;k<currentSaladArray[j].data.length;k++) {
        if (currentSaladArray[j].data[k]['QuantityAdded'] > 0) {
          current_selected_items.push(currentSaladArray[j].data[k]);
        }
      }
    }

    console.log('current_selected_items',current_selected_items);

    return (
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headingRow}>
          <Text condensedBold minTitle color={black}>
            Build your own salad
          </Text>
          <TouchableOpacity
            style={styles.leftBtn}
            activeOpacity={0.7}
            onPress={() => {
              ongoBack()
            }}
          >
            <Image
              source={close}
              style={styles.crossImg}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>

        <Text
          extSmall
          color={accountSettingGray}
          lineHeight={17.21}
          style={styles.chooseText}
        >
          Choose a base salad mix and then customize as you like.
        </Text>

        {current_selected_items.length == 0 ? renderDraggingView() : renderListView(current_selected_items)}
      </View>
    )
  }

  const renderDraggingView = () => {
    return (
      <View style={styles.dottedContainer}>
        <Text condensedBold minTitle color={addressGrey} largeRegular>
          Your selections will appear here
        </Text>
      </View>
    )
  }

  const renderListView = (current_selected_items) => {
    return (
      <View style={saladsStyles.listItems}>
        <ScrollView horizontal={true}>
          {current_selected_items.map((item, index) => {
            return (
              <TouchableOpacity
                disabled={item.price !== ''}
                style={[
                  saladsStyles.mixAddedCell,
                  saladsStyles.addedCell,
                  {
                    width: item.cellWidth,

                    marginBottom: item.marginBottom ? 30 : 0,
                  },
                ]}
              >
                <ImageBackground
                  style={[
                    saladsStyles.mixImg,
                    { height: 83, width: item.cellWidth },
                  ]}
                  source={item.image}
                >
                  <TouchableOpacity
                    style={saladsStyles.delContainer}
                    onPress={() => {
                      deletItemFromTopList(item, index)
                    }}
                  >
                    <Image source={delete_ic} style={saladsStyles.delImg} />
                  </TouchableOpacity>
                </ImageBackground>
                <View style={saladsStyles.addedTexContainer}>
                  <Text
                    small
                    textAlign={'center'}
                    color={accountSettingGray}
                    lineHeight={14}
                    style={saladsStyles.cellText}
                    noOfLines={2}
                  >
                    {item.QuantityAdded} x {item.heading}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    )
  }

  const renderTabs = () => {
    return (
      <Salads
        saladArray={saladArray}
        addItemInlList={addItemInTopList}
      />
    )
  }

  const isEnableCheckoutButton = () => {

    let currentSaladArray = Object.assign([], saladArray)

    let baseItemAdded = false
    var count_salad_mixes = 0;
    var count_dressings = 0;

    for (j=0;j<4;j++) {
      for (k=0;k<currentSaladArray[j].data.length;k++) {
        if (currentSaladArray[j].data[k]['QuantityAdded'] > 0) {
          if (currentSaladArray[j].data[k]['section'] == 'salad_mix') {
            baseItemAdded = true;
            count_salad_mixes +=currentSaladArray[j].data[k]['QuantityAdded'];
          }
          if (currentSaladArray[j].data[k]['section'] == 'dressing') {
            count_dressings +=currentSaladArray[j].data[k]['QuantityAdded'];
          }

        }
      }
    }

    return { baseItemAdded, no_sides: count_dressings }
  }

  const showConfirmDialog = () => {
    return Alert.alert(
      "Are you sure?",
      "You have not selected a dressing (free).",
      [
        {
          text: "Yes",
          onPress: () => {
            AddToCart()
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  const getDefaultAddress = () => {
    if (addresses.length > 1) {
      let defaultObj = null;
      if (default_address_id && default_address_id.id) {
        const otherAddresses = addresses.filter((x) => {
          if (x.id == default_address_id.id) {
            defaultObj = x;
          }
          return x.id !== default_address_id.id;
        });

        return defaultObj;
      } else {
        return getOrderHistory();
      }
    } else {
      if (addresses.length == 1) {
        return addresses[0];
      }
    }
  };

  const checkIsPastCutOffTime = () => {
    let isPastCutOffTime = false;
    if (global.freshMealsTimeSlotNew) {
      const selectedDate = moment(global.freshMealsTimeSlotNew.completeDate);
      const today = momenttz.tz('Asia/Bangkok').format('YYYY-MM-DD');
      const tomorrow = momenttz.tz('Asia/Bangkok').add(1, "days").format('YYYY-MM-DD');
	  // If it's the same or before as today  or if it is tommorow/but it's past cut off time (so it's today after 8pm)
      if ((selectedDate.isSameOrBefore(today, "day")) || (selectedDate.isSame(tomorrow, "day") && momenttz.tz('Asia/Bangkok').hour() >= CUTOFF_TIME)) {
        isPastCutOffTime = true;
      }
    } else {
      isPastCutOffTime = true;
    }
    return isPastCutOffTime;
  };

  const AddToCart = async () => {

    setIsAddToCartProcessing(true);

    let currentSaladArray = Object.assign([], saladArray)

    console.log('Checking', checkIsPastCutOffTime());

    // console.log('Checking the Salad Components', currentSaladArray);

    if (checkIsPastCutOffTime() == true) {
      var selected_date = formattedTomorrow;
      var selected_interval = 3;
    } else {
      // Not sure why we need the if here ... debug later
      var selected_date = global.freshMealsTimeSlotNew.completeDate;
      var selected_interval = global.freshMealsTimeSlotNew.slotId;;
    }

    console.log('Checking 1', selected_date, selected_interval);

    // Zone Checkup
    var selected_address = "";
    var user_zone_id = "";

    // Scenarios
    // If user has addresses under his account then we use the normal flow
    if (loginData) {
      if(contact_id.addresses.length>0) {
        // Normal flow
        const defaultAddress = getDefaultAddress();
        if (defaultAddress) {
          const { zone_id, id } = defaultAddress;
          selected_address = id;
          user_zone_id = zone_id;
        }

      } else if (contact_id.zone_id!==null){
        // Zone_id flow
        selected_address = null;
        user_zone_id = contact_id.zone_id;
      }
    } else {
      selected_address = null;
      // We assume they are in Bangkok
      user_zone_id = 31;
    }

    console.log('Checking 2', selected_address, user_zone_id);

    // Trigger Popus
    if ( selected_address == "" || user_zone_id == "" || user_zone_id == null || user_zone_id == "null" || user_zone_id == 32 || user_zone_id == 34) {
      alert("Your default address is out of our Delivery Area. Please add another address.");
    } else {

      // this.setState({loading: true});

      // CREATING THE PRODUCT FIRST
      console.log('Adding to Cart');
      // Create the salad
      var salad_id = 0;
      var vals={};
      await API.execute("byo.salad", "create", [vals],{},setIsAnyApiLoading, {token, user_id}).then(res=>{
        console.log('Salad id created',res)
        salad_id = res;
      }).catch(err=>{
        alert(err)
      });

      // Add the selected options to the salad
      for (j=0;j<4;j++) {
        for (k=0;k<currentSaladArray[j].data.length;k++) {
          if (currentSaladArray[j].data[k]['QuantityAdded'] > 0) {
            // Add the salad mix
            if (currentSaladArray[j].data[k]['section'] == 'salad_mix') {
              vals={type:"salad_mix",product_id:currentSaladArray[j].data[k]['product_id'],qty:1,salad_id:salad_id}
              await API.execute("byo.plate.product", "create", [vals],{},setIsAnyApiLoading, {token, user_id}).then(res=>{
                console.log('Salad Mix Created',res)
              }).catch(err=>{
                alert(err)
              });
            }

            // Add the protein if one was selected
            if (currentSaladArray[j].data[k]['section'] == 'protein') {
              vals={type:"protein",product_id:currentSaladArray[j].data[k]['product_id'],qty:1,salad_id:salad_id}
              await API.execute("byo.plate.product", "create", [vals],{},setIsAnyApiLoading, {token, user_id}).then(res=>{
                console.log('Protein Created',res)
              }).catch(err=>{
                alert(err)
              });
            }

            // Add the dressing
            if (currentSaladArray[j].data[k]['section'] == 'dressing') {
              vals={type:"dressing",product_id:currentSaladArray[j].data[k]['product_id'],qty:1,salad_id:salad_id}
              await API.execute("byo.plate.product", "create", [vals],{},setIsAnyApiLoading, {token, user_id}).then(res=>{
                console.log('Dressing Created',res)
              }).catch(err=>{
                alert(err)
              });
            }

            // Add the addons
            if (currentSaladArray[j].data[k]['section'] == 'addon') {
              vals={type:"premium_addon",product_id:currentSaladArray[j].data[k]['product_id'],qty:currentSaladArray[j].data[k]['QuantityAdded'],salad_id:salad_id}
              await API.execute("byo.plate.product", "create", [vals],{},setIsAnyApiLoading, {token, user_id}).then(res=>{
                console.log('Premium Addon',res)
              }).catch(err=>{
                alert(err)
              });
            }

          }
        }
      }

      // Create the FG Product
      await API.execute("byo.salad", "update_fg_product", [[salad_id]],{},setIsAnyApiLoading, {token, user_id}).then(res=>{
        console.log('FG product created',res)
      }).catch(err=>{
        alert(err)
      });

      var final_salad_product_id = 0;
      await API.execute("byo.salad", "search_read_path", [["id", "=", salad_id ], ['product_id.id']],{},setIsAnyApiLoading, {token, user_id}).then(res=>{
        console.log('FG product details',res)
        console.log('The ID',res[0].product_id.id);
        final_salad_product_id = res[0].product_id.id;
      }).catch(err=>{
        alert(err)
      });

      // ADDING TO CART

      var id = final_salad_product_id;

      var selected_quantity = 1;

      var cart_qty=0;

      var meal_cart = mealsCartData;
      if (meal_cart) {
        meal_cart.lines.map((d) => {
          if (id == d.product_id.id && selected_date == d.delivery_date) {
            cart_qty = d.qty;
          }
        });
      }

      var product_quantity = parseInt(selected_quantity) + parseInt(cart_qty);
      console.log("Product Quantity To be Added", product_quantity);

      API.meal_cart_set_qty_simple(
        selected_date,
        id,
        product_quantity,
        selected_address,
        selected_interval,
        setMealsCartData,
        setCartData,
        'meal',
        setIsAnyApiLoading,
        { token, user_id },
        'mealcart_add_to_cart_app',
        (err) => {}
      ).then(() => {

        // console.log('Do we have the error here');
        // APP automations
        // If we have a grocery cart (we always do, even if with no lines)
        if (cartData) {
          // Sometimes there might not be a Grocery Cart ?! // Double check this scenario.

          // Review this as it gives an error in the console
          var number_of_meal_delivery_days = 0;
          var selected_date_is_in_cart = false;

          if (mealsCartData) {

            number_of_meal_delivery_days = Object.keys(mealsCartData.ship_addresses_days).length;

            var order_by_date={};
            mealsCartData.lines.forEach(l => {
              var order=order_by_date[l.delivery_date];
              if (!order) {
                order={lines:[]};
                order_by_date[l.delivery_date]=order;
              }
              order.lines.push(l);
            })
            var delivery_dates=Object.keys(order_by_date);
            delivery_dates.sort();

            console.log('number_of_meal_delivery_days',number_of_meal_delivery_days,delivery_dates.includes(selected_date))

            selected_date_is_in_cart = delivery_dates.includes(selected_date);

          }

          // var grocery_ship_address_id = cartData.ship_address_id? cartData.ship_address_id.id : null;
          // var grocery_delivery_date = cartData.delivery_date || null;
          // var grocery_delivery_slot_id = cartData.delivery_slot_id? cartData.delivery_slot_id.id : null;


          // console.log('number_of_meal_delivery_days',number_of_meal_delivery_days,selected_date_is_in_cart,selected_date,selected_interval, grocery_delivery_date, grocery_delivery_slot_id)

          // If our meal cart has 1 day worth of meals or is just created, then we also update the grocery cart if the delivery details on the grocery cart are not the same as on the mealplan cart
          if (
              ((number_of_meal_delivery_days == 0) && (selected_date_is_in_cart == false)) ||
              ((number_of_meal_delivery_days == 1) && (selected_date_is_in_cart == true)) ||
              (meal_cart_total_qty(mealsCartData)==0)
            ) {

            console.log('Automation scenario 1');

            var grocery_ship_address_id = cartData.ship_address_id? cartData.ship_address_id.id : null;
            var grocery_delivery_date = cartData.delivery_date || null;
            var grocery_delivery_slot_id = cartData.delivery_slot_id? cartData.delivery_slot_id.id : null;

            if ((grocery_delivery_date == null) || (grocery_delivery_slot_id ==null) || (grocery_ship_address_id ==null) || (grocery_delivery_date!==selected_date) || (grocery_delivery_slot_id!==selected_interval)  || (grocery_ship_address_id !==selected_address) ){
              //  || (grocery_ship_address_id == null) || (grocery_ship_address_id!==selected_address) - Readd this condition after we redo the address logic
              var vals = {
                delivery_date: selected_date,
                delivery_slot_id: selected_interval,
                ship_address_id: selected_address,
              }
              var cartType = getCartType(cartData, mealsCartData);
              API.grocery_cart_write(
                vals,
                setMealsCartData,
                setCartData,
                cartType,
                'yes',
                { token, user_id },
                'grocery_slot_and_address_change_app'
              );
            }

          }

          // If our meal cart has multiple days or we just added a second day worth of meals, then we reset the grocery cart to null if they aren't already reset - BUT DO NOT RESET THE ADDRESS
          // if ((number_of_meal_delivery_days > 1) || ((delivery_dates.includes(selected_date) == false) && (meal_cart_total_qty(mealsCartData)>1))) {
          // Scenario for only one reset when we just add the second days worth of meals to avoid reseting if the user has specifically set up a grocery cart address - Confirm with Jon
          if ((number_of_meal_delivery_days == 1) && (selected_date_is_in_cart == false)) {

            console.log('Automation scenario 2');

            var grocery_ship_address_id = cartData.ship_address_id? cartData.ship_address_id.id : null;
            var grocery_delivery_date = cartData.delivery_date || null;
            var grocery_delivery_slot_id = cartData.delivery_slot_id? cartData.delivery_slot_id.id : null;

            if ((grocery_delivery_date != null) && (grocery_delivery_slot_id !=null)) {
              var vals = {
                delivery_date: null,
                delivery_slot_id: null,
              }
              var cartType = getCartType(cartData, mealsCartData);
              API.grocery_cart_write(
                vals,
                setMealsCartData,
                setCartData,
                cartType,
                'yes',
                { token, user_id },
                'grocery_slot_change_app'
              );

            }
          }
        }

        // Clear all the items
        let clearSaladArray = Object.assign([], saladArray)
        for (j=0;j<4;j++) {
          for (k=0;k<clearSaladArray[j].data.length;k++) {
            clearSaladArray[j].data[k]['QuantityAdded'] = 0;
          }
        }
        setSaladArray(clearSaladArray);
        // Clear all the items

        setIsAddToCartProcessing(false);

        navigation.navigate( 'FreshMeals', { BYO:true , fromHome: false})

      });

    }

  };

  const renderFooter = () => {
    const { baseItemAdded, no_sides } = isEnableCheckoutButton()

    let currentSaladArray = Object.assign([], saladArray)

    var calories = 0;
    var proteins = 0;
    var fat = 0;
    var carbs = 0;
    var final_price = 0;

    for (j=0;j<4;j++) {
      for (k=0;k<currentSaladArray[j].data.length;k++) {
        if (currentSaladArray[j].data[k]['QuantityAdded'] > 0) {
          calories+= (currentSaladArray[j].data[k]['QuantityAdded'] * currentSaladArray[j].data[k]['calories']);
          proteins+= (currentSaladArray[j].data[k]['QuantityAdded'] * currentSaladArray[j].data[k]['protein_g']);
          fat+= (currentSaladArray[j].data[k]['QuantityAdded'] * currentSaladArray[j].data[k]['lipid_tot_g']);
          carbs+= (currentSaladArray[j].data[k]['QuantityAdded'] * currentSaladArray[j].data[k]['carbohydrt_g']);

          final_price+= (currentSaladArray[j].data[k]['QuantityAdded'] * currentSaladArray[j].data[k]['price']);

        }
      }
    }

    return (
      <View style={styles.footer}>
        <View style={styles.infoBlock}>
          <View style={styles.infoRow}>
            <Text condensed extSmall color={greenShaded} lineHeight={19} style={styles.infoNumber}>
              {number_format(calories, "0,0")}
            </Text>
            <Text condensed extSmall color={greenShaded} lineHeight={19} style={styles.infoLabel}>
              Calories
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text condensed extSmall color={greenShaded} lineHeight={19} style={styles.infoNumber}>
              {number_format(fat, "0,0")}g
            </Text>
            <Text condensed extSmall color={greenShaded} lineHeight={19} style={styles.infoLabel}>
              Fat
            </Text>
          </View>
        </View>
        <View style={styles.infoBlock}>
          <View style={styles.infoRow}>
            <Text condensed extSmall color={greenShaded} lineHeight={19} style={styles.infoNumber}>
              {number_format(proteins, "0,0")}g
            </Text>
            <Text condensed extSmall color={greenShaded} lineHeight={19} style={styles.infoLabel}>
              Protein
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text condensed extSmall color={greenShaded} lineHeight={19} style={styles.infoNumber}>
              {number_format(carbs, "0,0")}g
            </Text>
            <Text condensed extSmall color={greenShaded} lineHeight={19} style={styles.infoLabel}>
              Carbs
            </Text>
          </View>
        </View>
        <View style={styles.bottomPrice}>
          <Text condensedBold extSmall color={black}>
            Total:
          </Text>

          <Text condensedBold largeRegularPlus olor={black}>
            ฿{number_format(final_price, "0,0")}
          </Text>

          <Text tiny bold color={textDarkGray}>
            ex VAT
          </Text>
        </View>
        <Button
          disabled={!baseItemAdded}
          onPress={() => {
            hapticFeedback();
            if (no_sides == 0) {
              showConfirmDialog();
            } else {
              AddToCart();
            }
          }}
          small
          style={[
            styles.addBtn,
            {
              backgroundColor: !baseItemAdded
                ? greenButtonOpacity
                : quantityGreen,
            },
          ]}
          textStyle={styles.textStyles}
          btnTitle="Add to cart"
        ></Button>
      </View>
    )
  }

  const renderProcessingView = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.processingContainer}
      >
        <View style={styles.processingContainer}>
          <Image source={circle_animation} style={styles.processingImg} />
          <Text
            condensedBold
            largeTitle
            color={black}
            textAlign={'center'}
            style={styles.processHeading}
            lineHeight={30.92}
          >
            Preparing your plate.
          </Text>
          <Text
            condensedBold
            color={black}
            largeRegularBetween
            textAlign={'center'}
            lineHeight={24}
            style={styles.topMarginProcessing}
          >
            Processing time may take a few seconds.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  if (isAddToCartProcessing) {
    return  renderProcessingView()
  } else  {

    return (
      <View style={styles.container}>
        {renderHeader()}

        {renderTabs()}
        {renderFooter()}

        {showPremiumModal && (
          <View style={styles.modalContain}>
            <PopupModal
              heading={"You can't add more premium add-ons."}
              content={'Only 2 premium add-ons are allowed.'}
              showPrivacyModal={showPremiumModal}
              contentHeight={141}
              contentStyle={styles.contentStyle}
              setShowPrivacyModal={() => {
                setShowPremiumModal(false)
                setIsAnyPopupOpened(false)
              }}
            />
          </View>
        )}

      </View>
    )

  }
}

export default BuildYourOwnSalad
