import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import appColors from '../../theme/appColors'
import Text from '../../components/Text'
import styles from './OrderStyles'
import helpers from '../../helpers'
import moment from 'moment'
const { display_status, getOrderColor } = helpers

const { darkGray, accountSettingGray, switchBorder } = appColors
const Order = (props) => {
  const { orderObj, isLastObj, onViewOrderDetails } = props

  const {
    amount_total,
    date,
    delivery_orders,
    due_date,
    ecom_state,
    id,
    number,
    plr_order_type,
  } = orderObj

  const viewOrderDetails = () => {
    onViewOrderDetails(orderObj)
  }

  const getOrderDate = () => {
    let orderDate = moment(date).format('MMMM Do, YYYY').toString()

    return orderDate ? orderDate : ''
  }

  const renderLastOrdersSection = () => {
    const orderStatus = display_status(
      ecom_state,
      plr_order_type,
      delivery_orders,
      date,
    )

    const { textColor, bgColor } = getOrderColor(orderStatus)

    return (
      <TouchableOpacity
        onPress={() => viewOrderDetails()}
        style={styles.orderSection}
      >
        <View>
          <Text
            style={styles.successTitle}
            color={accountSettingGray}
            bold
            lineHeight={20.13}
          >
            {getOrderDate()}
          </Text>
          <Text
            style={styles.priceLine}
            color={accountSettingGray}
            smallRegular
            lineHeight={18.5}
          >
            {number}{' '}
            <Text lineHeight={18.5} color={switchBorder}>
              {' |  '}
            </Text>
            <Text lineHeight={18.5} condensed color={accountSettingGray}>
              ฿{amount_total}
            </Text>
          </Text>
        </View>

        <View>
          {orderStatus && (
            <View style={[styles.greenContainer, { backgroundColor: bgColor }]}>
              <Text style={styles.successTitle} color={textColor} bold small>
                {orderStatus ? orderStatus.toUpperCase() : ''}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { borderBottomWidth: isLastObj ? 0 : 1 }]}>
      {renderLastOrdersSection()}
    </View>
  )
}

export default Order
