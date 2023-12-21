import React, { useState, useContext, useEffect, useRef } from 'react'
import { View, TouchableOpacity, ScrollView, Image, SectionList } from 'react-native'
import moment from 'moment'
import AppContext from '../../provider'
import styles from './Styles'
import { appColors, appImages } from '../../theme'
import helpers from '../../helpers'
import Services from '../../services'
const { API } = Services
import InvoicePopup from './InvoicePopup'
const {
  getOrderColor,
  getOrderDate,
  getOrderDay,
  getOrderDetailsDate,
  number_format,
  getOrderDetailsDateTime,
  scheduledDeliveryTime,
  hapticFeedback,
} = helpers

import { AccountHeader, Text, Button } from '../../components/'
const {
  textDarkGray,
  darkGray,
  black,
  lessDarkGray,
  tabTextGrey,
  accountSettingGray,
} = appColors

const getOrderStatus = (
  status,
  plr_order_type,
  delivery_orders,
  order_date
) => {
  if (status == "canceled") {
    return "Canceled";
  }

  if (plr_order_type == "giftcard") {
    if (status == "wait_payment") {
      return "Waiting for Payment";
    }

    if (status == "done") {
      return "Voucher Sent";
    }
  }

  if (
    plr_order_type == "meal" ||
    plr_order_type == "grocery" ||
    plr_order_type == "combined"
  ) {
    if (status == "wait_payment") {
      return "Waiting for Payment";
    }

    // Only do this for new orders
    if (moment(order_date).isSameOrAfter(moment("2021-05-22").format("YYYY-MM-DD"))) {
      var do_delivery_statuses = "";

      var count_delivery_orders = delivery_orders.length;

      if (count_delivery_orders > 0) {
          const deliveredOrders = delivery_orders.filter(order => order.state == "delivered");
          if (deliveredOrders.length) {
            if (deliveredOrders.length == delivery_orders.length) {
              do_delivery_statuses = "Delivered";
            } else {
              do_delivery_statuses = "Partially Delivered";
            }
          } else {
            do_delivery_statuses = "Delivery scheduled";
          }

        return do_delivery_statuses;
      }
    }

    // Fallback for very old orders
    if (status == "wait_delivery") {
      return "Delivery scheduled";
    }

    if (status == "wait_ship") {
      return "Awaiting Shipment";
    }

    if (status == "done") {
      return "Delivered";
    }
  }

  if (plr_order_type == "credit") {
    return "Payed";
  }

  if (plr_order_type == "pickup") {
    if (status == "wait_delivery") {
      return "Scheduled";
    }

    if (status == "wait_ship") {
      return "Scheduled";
    }

    if (status == "wait_packing") {
      return "Scheduled";
    }

    if (status == "done") {
      return "Shipped out";
    }

    return status;
  }

  if (status == "done") {
    return "Delivered";
  }

  return;
};

const OrderDetails = (props) => {
  const { navigation, route } = props
  const { orderObj } = route.params
  console.log('orderObj--', orderObj)
  const [orderDetails, setOrderDetails] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [invoiceURL, setInvoiceURL] = useState(null)
  const mainSectionsViewRef = useRef();

  const { setIsApiLoaderShowing, loginData, setIsAnyApiLoading, updateCartId} = useContext(AppContext)
  const {
    amount_total,
    date,
    delivery_orders,
    due_date,
    ecom_state,
    id,
    number,
    plr_order_type,
    plr_use_credit_amount,
  } = orderObj

  const { titleText, bgColor, textColor } = orderObj
  const { accountInfo, token, user_id } = loginData

  const onBackPress = () => {
    navigation.goBack()
  }

  const getRepeatOrderBtnText = (orderStatus) => {
    if (orderStatus == 'Awaiting Shipment') return 'Add to this order'
    return 'Repeat order'
  }

  useEffect(() => {
    getOrderDetails()
  }, [])
  
  
  /*
  const onTestSurvey = () => {
    CheckRedirectLogic();
    // navigation.navigate('MarketStack', { screen: 'Influencers', params: { sale_id: parseInt(1) }})
  }
  
  const CheckRedirectLogic = () => {
    
    if ((accountInfo.contact_id.plr_survey1_completed == null || accountInfo.contact_id.plr_survey1_completed == false) && (accountInfo.contact_id.plr_survey1_denied == null || accountInfo.contact_id.plr_survey1_denied == false)) {
      var shown = accountInfo.contact_id.plr_survey1_first_screen_shown;
      shown ??= 0;
      if (shown < 3) {
        navigation.navigate("CartStack", {screen:'CheckoutSuccessSurvey', params: {sale_id: id}});
      } else if (accountInfo.contact_id.plr_survey1_second_screen_shown == null || accountInfo.contact_id.plr_survey1_second_screen_shown == false) {
        navigation.navigate("CartStack", {screen:'CheckoutSuccessShare', params: {sale_id: id}});
      } else if (accountInfo.contact_id.plr_survey1_third_screen_shown == null || accountInfo.contact_id.plr_survey1_third_screen_shown == false) {
        navigation.navigate("CartStack", {screen:'CheckoutSuccessInvite', params: {sale_id: id}});
      }
    } else {
      if (accountInfo.contact_id.plr_survey1_second_screen_shown == null || accountInfo.contact_id.plr_survey1_second_screen_shown == false) {
        navigation.navigate("CartStack", {screen:'CheckoutSuccessShare', params: {sale_id: id}});
      } else if (accountInfo.contact_id.plr_survey1_third_screen_shown == null || accountInfo.contact_id.plr_survey1_third_screen_shown == false) {
        navigation.navigate("CartStack", {screen:'CheckoutSuccessInvite', params: {sale_id: id}});
      }
    }
    
  }
  */

  const getOrderDetails = async () => {
    var order_id = parseInt(id)

    var data,
      error = null
    try {
      var res = await API.execute(
        'sale.order',
        'read_path',
        [
          [order_id],
          [
            'date',
            'number',
            'amount_total',
            'ecom_state',
            'auto_cancel_time',
            'latest_cancel_time',

            'is_paid',
            'delivery_slot_id.name',
            'delivery_orders.time_delivered',
            'delivery_orders.state',
            'delivery_orders.slot_id.name',
            'delivery_orders.due_date',
            'delivery_orders.address_id.address',
            'delivery_date',
            'due_date',
            'ship_address_id.address',
            'invoices.number',

            'pay_method_id.name',
            'pay_method_id.type',
            'pay_method_id.instructions',
            /*
            "pay_trans_id.btc_address",
            "pay_trans_id.btc_amount",
            "pay_trans_id.btc_rate",
            */

            'lines.packaging_id.name',
            'lines.cutlery',
            'lines.product_id.name',
            'lines.product_id.code',
            'lines.product_id.image',
            'lines.product_id.nutrition_id.calories',
            'lines.product_id.nutrition_id.lipid_tot_g',
            'lines.product_id.nutrition_id.protein_g',
            'lines.product_id.nutrition_id.carbohydrt_g',
            'lines.product_id.nutrition_id.fiber_td_g',
            'lines.product_id.nutrition_id.calcium_mg',
            'lines.product_id.nutrition_id.copper_mg',
            'lines.product_id.nutrition_id.iron_mg',
            'lines.product_id.nutrition_id.magnesium_mg',
            'lines.product_id.nutrition_id.phosphorus_mg',
            'lines.product_id.nutrition_id.potassium_mg',
            'lines.product_id.nutrition_id.selenium_ug',
            'lines.product_id.nutrition_id.sodium_mg',
            'lines.product_id.nutrition_id.zinc_mg',
            'lines.product_id.nutrition_id.choline_tot_mg',
            'lines.product_id.nutrition_id.folate_tot_ug',
            'lines.product_id.nutrition_id.niacin_mg',
            'lines.product_id.nutrition_id.panto_acid_mg',
            'lines.product_id.nutrition_id.riboflavin_mg',
            'lines.product_id.nutrition_id.thiamin_mg',
            'lines.product_id.nutrition_id.vit_a_rae',
            'lines.product_id.nutrition_id.vit_b12_ug',
            'lines.product_id.nutrition_id.vit_b6_mg',
            'lines.product_id.nutrition_id.vit_c_mg',
            'lines.product_id.nutrition_id.vit_d_ug',
            'lines.product_id.nutrition_id.vit_e_mg',
            'lines.product_id.nutrition_id.vit_k_ug',
            'lines.qty',
            'lines.unit_price',
            'lines.amount',
            'lines.due_date',
            'lines.feedback.rating',
            'lines.feedback.comments',
            'lines.delivery_slot_id.name',
            'lines.ship_address_id.address',
            'lines.product_id.type',
            'lines.lot_id.weight',

            'lines.plr_price_tax_incl', // : fields.Float('Price Include Tax',function="_get_plr_price_tax_incl",function_multi=True),
            'lines.plr_price_per_unit_tax_incl', // : fields.Float('Price Per Unit Include Tax',function="_get_plr_price_tax_incl",function_multi=True),
            'lines.plr_tax_amt', // : fields.Float('Tax',function="_get_plr_price_tax_incl",function_multi=True),

            'plr_pay_error',
            'plr_use_credit_amount',
            'plr_due_amount',
            'plr_pay_for',
            'plr_payment_amount',
            'plr_transfer_amount_rec',
            'plr_can_cancel',
            'plr_can_cancel_reason',
            'plr_can_edit',
            'plr_order_type',
            'plr_is_first_meal_order',
            'plr_is_first_grocery_order',

            'contact_id.card_tokens.mask_card',
            'contact_id.card_tokens.exp_month',
            'contact_id.card_tokens.exp_year',
            'contact_id.receivable_credit',

            'sale_plan_id',
            'sale_plan_id.name',
            'sale_plan_id.credit_amount',

            'max_payment_date',

            'amount_tax',
            // "amount_ship",
            'amount_total',
            'voucher_id.code',

            'payment_qr',
            'payment_qr_date',
          ],
        ],
        {},
        setIsApiLoaderShowing,
      )
      if (!res.length) {
        return
      }
      [data] = res
      setOrderDetails(data)
      if (data?.ecom_state != 'wait_payment') {
        // alert('payment ')
        // return
      }

      var meth_id = data.pay_method_id ? data.pay_method_id.id : null
      var pay_method
      if (meth_id == 2) {
        pay_method = 'paypal'
      } else if (meth_id == 11) {
        pay_method = 'bitcoin'
      } else if (meth_id == 1) {
        pay_method = 'bank'
      } else if (meth_id == 8) {
        pay_method = 'credit_card'
      } else if (meth_id == 13) {
        pay_method = 'credit_card_amex'
      } else {
        pay_method = null
      }

      console.log(data, pay_method)
    } catch (err) {
      error = err
      //alert("Failed to read order data: "+err.message);
      console.log(error)
      if (error) {
        // Router.push("/orders")
      }
    }
    return
  }
  
  const onRepeatOrder = () => {
    console.log("repeat_order");
    if (orderDetails.plr_order_type == "combined") {
      // alert("Some of your meals may no longer be on the menu, so we will re-create only your Grocery cart.");
      // var res = confirm("Some of your meals may no longer be on the menu, so we will re-create only your Grocery cart.");
    } else {
      // alert("This will create a new shopping cart. Are you sure? (please note that not all items might be available and you’ll have to re-select a delivery time.");
      // var res = confirm("This will create a new shopping cart. Are you sure? (please note that not all items might be available and you’ll have to re-select a delivery time)");
    }
    // if (!res)
      // return;
    hapticFeedback();
    copyToCart();
  }
  
  const copyToCart = async() => {
    console.log("repeat_order");
    
    var append_to_cart = global.cartId;
    console.log('append_to_cart',append_to_cart)
    
    await API.execute("sale.order","append_to_cart",
      [
        [orderDetails.id],
        [append_to_cart]
      ],
      {},
      setIsAnyApiLoading,
      {token, user_id}
      ).then(data=>{
        console.log('data',data);
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

  const getDeliveryTime = (time_delivered) => {
    return moment(time_delivered).format('HH:MM a on DD MMMM');
  }

  const onPayForSo = () => {
    props.navigation.navigate('CartStack', { screen: 'CheckoutSO', params: { sale_id: parseInt(id) }})
    // props.navigation.navigate('AccountStack', { screen: 'DeliveryAddresses'})
  }

  const downLoadInvoice = async () => {
    const openLink =
      'https://backend.paleorobbie.com/render_page_pdf?page_id=48&active_id=' +
      orderDetails.invoices[0].id +
      '&database=plr&user_id=' +
      user_id +
      '&company_id=1&token=' +
      token +
      '&lang=en_US&no_download=1'

    setInvoiceURL(openLink)
    setShowModal(true)
  }

  const scrollToProductsSection = (sectionIndex) => {
    if (mainSectionsViewRef.current) {
      mainSectionsViewRef.current.scrollToLocation({
        sectionIndex: sectionIndex + 1,
        itemIndex: 0
      });
    }
  }

  const renderDetails = () => {
    const orderStatus = getOrderStatus(
      ecom_state,
      plr_order_type,
      orderDetails.delivery_orders,
      date,
    );

    const { textColor, bgColor } = getOrderColor(orderStatus);
    const order = (orderDetails.delivery_orders || [])[0];
    const orderDate = order ? (order.time_delivered || order.due_date) : orderDetails.date;
    const orderTime = order ? (order.slot_id || {}).name : (orderDetails.delivery_slot_id || {}).name;

    const showOrderStatusDate = !['canceled'].includes(ecom_state);

    const hasMultiDeliveries = orderDetails.delivery_orders.length > 1;
    return (
      <View style={styles.detailsSection}>
        <View style={styles.row}>
          <Text color={appColors.darkGray} bold>
            {getOrderDate(orderDate)}
            {/*
            <Button
              style={styles.btn}
              small
              btnTitle={'Test Survey'}
              textStyle={styles.text}
              onPress={onTestSurvey}
            />
            */}
          </Text>
          <View>
            {orderStatus && (
              <View
                style={[styles.greenContainer, { backgroundColor: bgColor }]}
              >
                <Text color={textColor} bold small>
                  {orderStatus ? orderStatus.toUpperCase() : ''}
                </Text>
              </View>
            )}
          </View>
        </View>

        {hasMultiDeliveries ? (
          <>
            <View
              style={[
                styles.uperTextRow,
                {
                  justifyContent:
                    orderDetails.ecom_state == 'wait_ship'
                      ? 'flex-start'
                      : 'space-between',
                },
              ]}
            >
              {orderDetails.ecom_state == "wait_payment" &&
                <Button
                  style={styles.btn}
                  small
                  textStyle={styles.text}
                  btnTitle={"Pay for this order"}
                  onPress={onPayForSo}
                />
              }
              {((orderDetails.ecom_state !='wait_payment') && (orderDetails.plr_order_type!='meal') && (orderDetails.plr_order_type!='pickup')) &&
                <Button
                  style={styles.btn}
                  small
                  btnTitle={'Repeat order'}
                  textStyle={styles.text}
                  onPress={onRepeatOrder}
                />
              }
              {(parseInt(orderDetails.plr_use_credit_amount) >0) &&
                <View style={styles.totalContainer}>
                  <Text color={textDarkGray} small bold>
                    PALEO CREDITS USED
                  </Text>
                  <Text regular color={accountSettingGray} condensed>
                    ฿{orderDetails.plr_use_credit_amount}
                  </Text>
                </View>
              }
              <View style={styles.totalContainer}>
                <Text color={textDarkGray} small bold>
                  TOTAL {orderDetails.plr_use_credit_amount}
                </Text>
                <Text regular color={accountSettingGray} condensed>
                  ฿{amount_total}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View
              style={[
                styles.uperTextRow,
                {
                  justifyContent:
                    orderStatus == 'Awaiting Shipment'
                      ? 'flex-start'
                      : 'space-between',
                },
              ]}
            >
              {orderDetails.ecom_state == "wait_payment" &&
                <Button
                  style={styles.btn}
                  small
                  textStyle={styles.text}
                  btnTitle={"Pay for this order"}
                  onPress={onPayForSo}
                />
              }
              {((orderDetails.ecom_state !='wait_payment') && (orderDetails.plr_order_type!='meal') && (orderDetails.plr_order_type!='pickup')) &&
                <Button
                  style={styles.btn}
                  small
                  btnTitle={'Repeat order'}
                  onPress={onRepeatOrder}
                />
              }
              {showOrderStatusDate ? (
                  <View style={styles.dateSection}>
                    <Text small>
                      {orderStatus === 'Delivered' ? 'Delivered at' : 'Scheduled for'}
                    </Text>
                    <Text small>
                      {orderStatus === 'Delivered' ? getDeliveryTime(orderDate) : scheduledDeliveryTime(orderDate, orderTime) }
                    </Text>
                  </View>
              ) : null}
            </View>

            <View style={styles.textRow}>
              <View style={{ flex: 1 }}>
                <Text small color={textDarkGray} bold>
                  SHIPPING ADDRESS
                </Text>
                <Text color={accountSettingGray} style={styles.addressText}>
                  {order?.address_id?.address || orderDetails.ship_address_id?.address}
                </Text>
              </View>
              
              <View style={styles.totalContainer}>
                {(parseInt(orderDetails.plr_use_credit_amount) >0) &&
                  <>
                    <Text color={textDarkGray} small bold>
                      CREDITS USED
                    </Text>
                    <Text regular color={accountSettingGray} condensed>
                      ฿{orderDetails.plr_use_credit_amount}
                    </Text>
                  </>
                }
                  
                <Text color={textDarkGray} small bold>
                  TOTAL
                </Text>
                <Text regular color={accountSettingGray} condensed>
                  ฿{amount_total}
                </Text>
              </View>
            </View>
          </>
        )}
        </View>
    )
  }

  const renderDeliveryStatuses = () => {
    if (orderDetails.delivery_orders.length > 1) {
      // sort delivery orders by date
      const sortedDeliveryOrders = orderDetails.delivery_orders.sort((a, b) => {
        const date1 = a.time_delivered || a.due_date || '';
        const date2 = b.time_delivered || b.due_date || '';
        const timeSlot1 = a.slot_id?.name || '';
        const timeSlot2 = b.slot_id?.name || '';
        return (`${date1} ${timeSlot1}`.localeCompare(`${date2} ${timeSlot2}`));
      });
      return (
        <View style={[styles.orderSection, {marginTop: 0, marginBottom: 0}]}>
          <View style={styles.orderSubSections}>
            <Text smallRegular color={lessDarkGray}>
              Delivery Status
            </Text>
          </View>
          <View style={styles.deliveryStatusesWrapper}>
            {sortedDeliveryOrders.map((delivery, index, arr) => {
              const orderStatus = getOrderStatus(ecom_state, plr_order_type, [delivery], date);
              const { textColor, bgColor } = getOrderColor(orderStatus);
              return (
                <View style={styles.deliveryStatusSection} key={delivery.id}>
                  <View style={styles.deliveryDayWrapper}>
                    <View style={styles.deliveryDay}>
                      <Text>{getOrderDay(delivery.time_delivered || delivery.due_date)}</Text>
                    </View>
                    {(arr.length !== index + 1) && (
                    <View style={styles.deliveryLine}>
                      <Image source={appImages.dashedLine} resizeMode="repeat" style={styles.dashedLine}/>
                      <Image source={appImages.downArrow} resizeMode="contain" style={styles.downArrow}/>
                    </View>
                    )}
                  </View>
                  <View style={{flex: 1, paddingBottom: 10 }}>
                    <Text>{getOrderDate(delivery.time_delivered || delivery.due_date, 'DD MMMM')}</Text>
                    {delivery.address_id && (
                      <Text style={styles.deliveryAddressText}>{delivery.address_id.address}</Text>
                    )}
                    <Button style={[styles.viewProductsBtn, { marginTop: orderDetails.ship_address_id ? 5 : 25 }]}
                      textStyle={styles.viewProductsBtnText}
                      btnTitle={'View Products'}
                      onPress={() => scrollToProductsSection(index)} />
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end', paddingBottom: 10}}>
                    <View style={{marginTop: 26, alignItems: 'flex-end'}}>
                      <Text>
                        {orderStatus === 'Delivered' ? 'Delivered at' : 'Scheduled for'}
                      </Text>
                      <Text>
                        {orderStatus === 'Delivered' ? getDeliveryTime(delivery.time_delivered) : scheduledDeliveryTime(delivery.due_date, delivery.slot_id.name) }
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.greenContainer, styles.multiDeliveryStatus, { backgroundColor: bgColor }]}>
                    <Text color={textColor} bold small>
                      {orderStatus ? orderStatus.toUpperCase() : ''}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      )
    } else {
      return null;
    }
  }

  if (!orderDetails) {
    return null;
  } else {
    const orderStatus = getOrderStatus(
      ecom_state,
      plr_order_type,
      delivery_orders,
      date,
    )
    const linesGroupByDueDate = orderDetails.lines.reduce((result, line) => {
      result[line.due_date] = result[line.due_date] || [];
      result[line.due_date].push(line);
      return result;
    }, {});

    let linesGroup = [];
    if (orderDetails.delivery_orders && orderDetails.delivery_orders.length > 0) {
      linesGroup = orderDetails.delivery_orders.map(order => {
        return {
          title: order.due_date,
          data: linesGroupByDueDate[order.due_date] || []
        }
      }).sort((a, b) => a.title > b.title);
    } else {
      linesGroup = Object.keys(linesGroupByDueDate).map(due_date => {
        return {
          title: due_date,
          data: linesGroupByDueDate[due_date] || []
        }
      }).sort((a, b) => a.title > b.title);
    }
    
    const sections = [
      {
        title: 'main',
        data: []
      },
      ...linesGroup
    ];

    return (
      <View style={styles.container}>
        <AccountHeader
          title={'Order #' + number}
          backArrow
          backPress={() => onBackPress()}
        />
        <View style={styles.subContainer}>
          <SectionList showsVerticalScrollIndicator={false}
            ref={mainSectionsViewRef}
            sections={sections}
            stickySectionHeadersEnabled={false}
            keyExtractor={(item, index) => item + index}
            renderItem={({item, index, section}) => (
              <TouchableOpacity
                disabled={true}
                style={[
                  styles.myAccountCell,
                  {
                    borderBottomWidth: section.data.length == index + 1 ? 0 : 1,
                    borderTopLeftRadius: index == 0 ? 5 : 0,
                    borderTopRightRadius: index == 0 ? 5 : 0,
                    borderBottomLeftRadius: section.data.length == index + 1 ? 5 : 0,
                    borderBottomRightRadius: section.data.length == index + 1 ? 5 : 0
                  },
                ]}
                key={index}
              >
                <View style={styles.nameText}>
                  <Text color={accountSettingGray} style={styles.nameText}>
                    {item.product_id ? item.product_id.name : ''}
                  </Text>
                  <Text color={darkGray} regular condensed>
                    ฿{number_format(item.plr_price_tax_incl, '0,0')}
                  </Text>                  
                </View>

                <Text regular color={textDarkGray} condensed>
                  ฿{number_format(item.plr_price_per_unit_tax_incl, '0,0')}{' '} x
                  {item.qty}
                </Text>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title, index } }) => (
              <>
                {title === "main" ? (
                  <>
                    {renderDetails()}
                    <View style={styles.btnRow}>
                      {orderStatus == 'Awaiting Shipment' && (
                        <Button
                          style={styles.repeatBtn}
                          textStyle={styles.invoiceBtnText}
                          btnTitle={'Repeat order'}
                        />
                      )}
                      {orderDetails &&
                        orderDetails.invoices.length != 0 &&
                        orderDetails.ecom_state != 'wait_payment' &&
                        orderDetails.ecom_state != 'canceled' && (
                          <Button
                            onPress={() => {
                              downLoadInvoice()
                            }}
                            style={styles.invoiceBtn}
                            textStyle={styles.invoiceBtnText}
                            btnTitle={'Download invoice'}
                          />
                        )}
                    </View>
                    {renderDeliveryStatuses()}
                  </>
                ) : (
                  <View style={styles.orderSubSections}>
                    <Text smallRegular color={lessDarkGray}>
                      {linesGroup.length > 1 ? moment(title).format('DD MMMM') : 'Products'}
                    </Text>
                  </View>
                )}
              </>
            )}>
          </SectionList>
        </View>

        <InvoicePopup
          showModal={showModal}
          orderDetails={orderDetails}
          invoiceURL={invoiceURL}
          token={token}
          user_id={user_id}
          setShowModal={() => {
            setShowModal(false)
          }}
        />
      </View>
    )
  }
}

export default OrderDetails
