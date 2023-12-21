import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { appColors, appImages } from "../../theme";
import Text from "../../components/Text";
import styles from "./MyOrderStyles";
import moment from "moment";
import helpers from "../../helpers";
const { display_status, getOrderColor } = helpers;
const { textDarkGray, darkGray } = appColors;
const Order = (props) => {
  const {
    titleText,
    textColor,
    bgColor,
    isLastObj,
    onViewOrderDetails,
    order,
  } = props;
  const {
    amount_total,
    date,
    delivery_orders,
    due_date,
    ecom_state,
    id,
    number,
    plr_order_type,
  } = order;

  const getOrderDate = () => {
    let orderDate = moment(date).format("MMMM Do, YYYY").toString();

    return orderDate ? orderDate : " ";
  };

  const renderLastOrdersSection = () => {
    const orderStatus = display_status(
      ecom_state,
      plr_order_type,
      delivery_orders,
      date
    );

    const { textColor, bgColor } = getOrderColor(orderStatus);

    return (
      <View style={styles.orderSection}>
        <View style={styles.row}>
          <Text color={appColors.darkGray} bold>
            {getOrderDate()}
          </Text>
          <View>
            {orderStatus && orderStatus !== undefined ? (
              <View
                style={[styles.greenContainer, { backgroundColor: bgColor }]}
              >
                <Text
                  color={textColor}
                  bold
                  small
                  noOfLines={1}
                  style={{ maxWidth: 150 }}
                  textAlign={"center"}
                >
                  {orderStatus ? orderStatus.toUpperCase() : " "}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.textRow}>
          <View style={styles.innerTextRow}>
            <View style={styles.smallTextRow}>
              <Text color={textDarkGray} small bold>
                ORDER NUMBER
              </Text>
              <Text regular color={darkGray}>
                {number}
              </Text>
            </View>
            <View style={styles.smallViewRow}>
              <Text color={textDarkGray} small bold style={styles.total}>
                TOTAL
              </Text>
              <Text style={styles.price} regular color={darkGray} condensed>
                ฿{amount_total}
              </Text>
            </View>
          </View>
          <Image style={styles.arrow} source={appImages.right_arrow} />
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={onViewOrderDetails}
      style={[
        styles.container,
        {
          borderBottomWidth: isLastObj ? 0 : 1,
          marginBottom: isLastObj ? 30 : 0,
        },
      ]}
    >
      {renderLastOrdersSection()}
    </TouchableOpacity>
  );
};

export default Order;
