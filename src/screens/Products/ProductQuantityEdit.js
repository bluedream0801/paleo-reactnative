import React, { useCallback, useEffect, useRef, useState, useContext} from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import {
  View,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text } from '../../components';
import { appImages, appColors, appMetrics } from '../../theme';
import { useDebouncedCallback } from 'use-debounce';
import AppContext from "../../provider";
import Services from "../../services";
import helpers from "../../helpers";

const { API } = Services;
const { hapticFeedback } = helpers;
const {
  baseMargin,
} = appMetrics;

const WIDTH = 33;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: 'center',
    borderRadius: 7,
    minWidth: WIDTH,
    height: WIDTH,
    borderColor: appColors.quantityGreen,
    borderWidth: 1,
    justifyContent: "center",
  },
  bellIcon: {
    width: 14,
    height: 18,
    resizeMode: 'contain',
  },
  plusIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain'
  },
  quantityTextContainer: {
    width: WIDTH,
    height: WIDTH,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  quantityText: {
    paddingHorizontal: 4,
    minWidth: 24,
    textAlign: 'center'
  },
  circle: {
    height: 16,
    width: 16,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: appColors.notifyBlue,
    alignItems: "center",
    borderRadius: 8,
    marginRight: baseMargin,
  },
  tick: {
    width: 8,
    height: 8,
    resizeMode: "contain",
    tintColor: appColors.notifyBlue,
  },
  notification: {
    width: "100%",
    backgroundColor: appColors.blueOpacity,
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    zIndex: 7,
    right: 0,
    left: 0,
    top: 0,
  },
  isVertical: {
    flexDirection: "column",
    borderRadius: 7,
  },
})

const defaultProps = {
  isOutOfStock: false,
  quantity: 0,
  disabled: false,
  isVertical: false,
  buttonRightMargin: 10,
  onSelectQuantity: (quantity, callback) => {
    callback(true);
  }
}

const ProductQuantityEdit = (props) => {

  const {
    setIsApiLoaderShowing,
    loginData,
    userDataArray,
    setUserDataArray
  } = useContext(AppContext);

  const componentProps = {
    ...defaultProps,
    ...props
  };
  const { onSelectQuantity, quantity, isOutOfStock, product_id, isVertical, buttonRightMargin, max_qty, sale_qty_multiple } = componentProps;
  const animationTimerRef = useRef(null);
  const [openQuantityInput, setOpenQuantityInput] = useState(false);

  const [internalQty, setInternalQty] = useState(quantity);
  const quantityWidth = useSharedValue(WIDTH);
  const quantityInputBackground = useSharedValue(quantity > 0 ? appColors.quantityGreen : appColors.white);

  if (loginData) {
    var { token, user_id } = loginData;
  } else {
    var user_id = null;
    var token = null;
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(quantityWidth.value),
      backgroundColor: quantityInputBackground.value
    };
  }, [quantityWidth.value, quantityInputBackground.value]);

  const selectQuantity = (newQuantity) => {
    console.log('Check values newQuantity max_qty',newQuantity, max_qty)
    // Only update up to maximum quantity
    if (newQuantity <= max_qty) {
      hapticFeedback();
      if (newQuantity != internalQty) {
        setInternalQty(newQuantity);
        debouncedOnSelectQuantity(newQuantity, (updated) => {
          console.log('Updated quantity', updated, newQuantity);
        })
      }
      changeQuantity(newQuantity, true, true);
    } else {
      return false;
    }
  }

  const changeQuantity = (newQuantity, updated, expand) => {
    if (expand) {
      setOpenQuantityInput(true);
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      animationTimerRef.current = setTimeout(() => {
        quantityWidth.value = WIDTH;
        setOpenQuantityInput(false);
      }, 2000);
    }
    if (updated) {
      quantityWidth.value = (expand && newQuantity > 0) ? WIDTH * 3 : WIDTH;
      quantityInputBackground.value = withDelay(100, withTiming(newQuantity > 0 ? appColors.quantityGreen : appColors.white));
    }
  }

  const debouncedOnSelectQuantity = useDebouncedCallback(
    useCallback((newQuantity, callback) => {
      onSelectQuantity(newQuantity, callback);
    }, [onSelectQuantity]), 200);

  const notifyMe = () => {
    if (loginData) {
      API.execute("product","add_ecom_notif",
      [[product_id]],
      {},
      setIsApiLoaderShowing,
      { token, user_id }).then(res=>{
          console.log('Product should be subscribed to notifications',res);
          // No error
          if (res == null) {
            vals = {
              product_id: product_id
            }
            // Setting up the array here instead of rereading it from the server every time productsWithNotifications
            var productsWithNotificationsArray = userDataArray.productsWithNotifications;
            productsWithNotificationsArray.push(vals);
            console.log('productsWithNotificationsArray',productsWithNotificationsArray);
            hapticFeedback();
            
            setUserDataArray({ 
                            productsWithNotifications: productsWithNotificationsArray, 
                            productsFavorites: userDataArray.productsFavorites
                          });
          }
      }).catch(err=>{
          alert(err);
      });
    } else {
      alert('You need to login before subscribing to product notifications!');
    }
  }
  
  useEffect(() => {
    setInternalQty(quantity);
  }, [quantity]);

  useEffect(() => {
    quantityInputBackground.value = withDelay(50, withTiming(internalQty > 0 ? appColors.quantityGreen : appColors.white));
  }, [internalQty]);
  
  const productHasNotification = userDataArray.productsWithNotifications.find((notification) => notification.product_id == product_id);

  let containerStyles = [
    styles.container,
  ];

  if (props.style && typeof props.style === 'object') {
    containerStyles = containerStyles.concat(Array.isArray(props.style) ? props.style : [props.style]);
  }

  const buttonStyles = [styles.quantityContainer];
  
  var qty_multiple = 1;
  if (sale_qty_multiple) {
    qty_multiple = sale_qty_multiple;
  }
  
  return (
    <View style={containerStyles}>
      {isOutOfStock ? (
        <>
          {(productHasNotification) ?
            (
              <TouchableOpacity style={[styles.notification, { marginRight: buttonRightMargin }, isVertical && styles.isVertical]}>
                <View style={[styles.circle, {marginRight: isVertical? 0 : baseMargin}]}>
                  <Image source={appImages.tick_ic} style={styles.tick} />
                </View>
                <Text smallRegular condensedBold color={appColors.notifyBlue} textAlign={"center"}>
                  You'll be notified
                </Text>
              </TouchableOpacity>
            )
            :
            (
              <Pressable style={[...buttonStyles, { marginRight: buttonRightMargin, backgroundColor: appColors.white }]}
                onPress={() => notifyMe()}>
                <Image source={appImages.bell_ic} style={[styles.bellIcon]} />
              </Pressable>
            )
          }
        </>
      ) : (
        <Animated.View style={[...buttonStyles, animatedStyle, { borderRadius: 7, marginRight: buttonRightMargin }]}>
          <Pressable
            disabled={componentProps.disabled}
            onPress={() => selectQuantity(internalQty - (1 * qty_multiple))}
            style={[styles.quantityTextContainer, { display: !openQuantityInput ? 'none' : 'flex' }]}
          >
            <Image source={appImages.minus_white_ic} style={styles.plusIcon} />
          </Pressable>
          {
            internalQty > 0 ? (
              <Pressable
                style={[styles.quantityTextContainer]}
                onPress={() => selectQuantity(quantity)}
                hitSlop={openQuantityInput ? 0 : 4}>
                <Text
                  regularPlus
                  color={appColors.white}
                  style={styles.quantityText}
                >
                  {internalQty <= 0 ? '' : internalQty}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                disabled={componentProps.disabled}
                onPress={() => selectQuantity((1 * qty_multiple))}
                style={styles.quantityTextContainer}
                hitSlop={4}
              >
                <Image source={appImages.plus_ic} style={styles.plusIcon} />
              </Pressable>
            )
          }

          <Pressable
            disabled={componentProps.disabled}
            onPress={() => selectQuantity(internalQty + (1 * qty_multiple))}
            style={[styles.quantityTextContainer, { display: !openQuantityInput ? 'none' : 'flex' }]}
          >
            <Image source={appImages.plus_white_ic} style={styles.plusIcon} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  )
}

export default ProductQuantityEdit;