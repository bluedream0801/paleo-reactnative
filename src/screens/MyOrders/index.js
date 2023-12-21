import React, { useState, useEffect, useContext} from "react";
import { View, FlatList } from 'react-native'
import styles from './Styles'
import MyOrder from './MyOrder'
import { AccountHeader, Text } from '../../components/'
import { appColors } from '../../theme'
import AppContext from "../../provider";
import Services from "../../services";
const { API } = Services;

const { addressGrey } = appColors

const MyOrders = (props) => {
  const { navigation, route } = props
  const [orderHistory, setOrderHistory] = useState([]);
  const {
    setIsApiLoaderShowing,
    isApiLoaderShowing,
    loginData,
  } = useContext(AppContext);
  const { accountInfo, user_id } = loginData;

  const onBackPress = () => {
    navigation.goBack()
  }
  
  useEffect(() => {
    getOrderHistory();
  }, []);

  const getOrderHistory = async () => {
    setIsApiLoaderShowing(true);
    try {
      var res = await API.execute(
        "sale.order",
        "search_read_path",
        [
          [["contact_id", "=", accountInfo.contact_id.id]],
          [
            "date",
            "number",
            "amount_total",
            "ecom_state",
            "plr_order_type",
            "due_date",
            "delivery_orders.state",
            "delivery_orders.delivered_time",
            "delivery_orders.time_delivered",
          ],
        ],
        {
          order: "date desc, number desc",
        },
        () => {}
      );
      setOrderHistory(res);
      setIsApiLoaderShowing(false);
    } catch (err) {
      setIsApiLoaderShowing(false);
      console.log("err", err);
    }
  };

  const onViewOrderDetails = (obj) => {
    navigation.navigate('OrderDetails', { orderObj: obj })
  }

  const renderOrdersList = () => {
    return (
      <View style={styles.orderList}>
        {(orderHistory.length == 0 && isApiLoaderShowing == false) && (
          <Text
            largeRegularPlus
            color={addressGrey}
            textAlign={'center'}
            style={styles.noOrder}
          >
            You have no recent orders.
          </Text>
        )}
        {(isApiLoaderShowing == true) &&(
          <Text
            largeRegularPlus
            color={addressGrey}
            textAlign={'center'}
            style={styles.noOrder}
          >
            Retrieving your orders.
          </Text>
        )}
        
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          data={orderHistory}
          style={styles.orderListContainer}
          renderItem={({ item, index }) => {
            return (
              <MyOrder
                order={item}
                key={index}
                onViewOrderDetails={() => onViewOrderDetails(item)}
                titleText={item.titleText}
                textColor={item.textColor}
                bgColor={item.bgColor}
                isLastObj={orderHistory.length == index + 1}
              />
            )
          }}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AccountHeader
        title={'All orders'}
        backArrow
        backPress={() => onBackPress()}
      />

      {renderOrdersList()}
    </View>
  )
}

export default MyOrders
