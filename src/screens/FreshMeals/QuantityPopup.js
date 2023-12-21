import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import styles from "./QuantityPopupStyles";
import { appImages, appColors } from "../../theme";
import { Text } from "../../components/";
import { useFocusEffect } from "@react-navigation/native";

import helpers from "../../helpers/";

const {
  white,
  accountSettingGray,
  quantityGreen,
  black,
  blackOpacity,
} = appColors;

const { hapticFeedback} = helpers;
const { white_tick } = appImages;

const QuantitySelector = (props) => {
  const {
    setShowPrivacyModal,
    setSelectQuantity,
    showModal,
    selectedObject,
    selectedQuantityObject,
  } = props;

  var dataList = [];
  for(i=0;i<11;i++) {
    // console.log('selectedQuantityObject.qty_mult',selectedQuantityObject.qty_mult);
    var qty_mult = 1;
    if (selectedQuantityObject.qty_mult) {
      qty_mult = selectedQuantityObject.qty_mult;
    }
    if ((i * qty_mult) <= selectedQuantityObject.max_qty) {
      var vals = {
          quantity: (i * qty_mult),
          isSelected: false,
        }
      dataList.push(vals);
    } else {
      break;
    }
  }

  const [quantities, setQuantityList] = useState(dataList);

  const setSelectSlotObject = (obj) => {
    setSelectQuantity(obj, selectedObject);
    setShowPrivacyModal();
  };

  useFocusEffect(
    React.useCallback(() => {
      const arrayQuantities = Object.assign([], quantities);
      for (let index = 0; index < arrayQuantities.length; index++) {
        if (selectedQuantityObject.quantity == arrayQuantities[index].quantity) {
          arrayQuantities[index].isSelected = true;
        } else {
          arrayQuantities[index].isSelected = false;
        }
      }
      setQuantityList(arrayQuantities);
    }, [])
  );

  const selectQuantity = (i) => {
    hapticFeedback();
    const array = Object.assign([], quantities);
    for (let index = 0; index < quantities.length; index++) {
      if (i == index) {
        setSelectSlotObject(quantities[index]);
        quantities[index].isSelected = !quantities[index].isSelected;
      } else {
        quantities[index].isSelected = false;
      }
    }
    setQuantityList(array);
  };

  const renderListCell = (obj, index) => {
    return (
      <View
        style={[
          styles.slotContainer,
          {
            borderBottomWidth: index == 0 ? 1 : 1,
          },
        ]}
        key={index}
      >
        <TouchableOpacity
          onPress={() => {
            selectQuantity(index);
          }}
          style={[styles.timeRow]}
        >
          <Text color={accountSettingGray} largeRegularBetween>
            {obj.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => {
              selectQuantity(index);
            }}
            style={[
              styles.box,
              {
                backgroundColor: obj.isSelected ? quantityGreen : white,
                borderWidth: obj.isSelected ? 0 : 1,
              },
            ]}
          >
            <Image source={white_tick} style={styles.tick} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuantityList = () => {
    return (
      <View style={styles.listContainer}>
        {quantities.map((item, index) => renderListCell(item, index))}
      </View>
    );
  };

  console.log('Quantity Popup Check 2', selectedObject, selectedObject.index)

  return (
    <Modal
      backdropColor={blackOpacity}
      isVisible={showModal}
      onRequestClose={() => setShowPrivacyModal()}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={() => {
        setShowPrivacyModal();
      }}
      statusBarTranslucent
      useNativeDriverForBackdrop
      swipeDirection={["down"]}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPrivacyModal();
        }}
      >
        <View style={[styles.container]}>
          <View style={[styles.body, { height: 530 }]}>
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => setShowPrivacyModal()}
            >
              <Image
                source={appImages.close}
                style={styles.crossImg}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
            <Text condensedBold minTitle style={styles.margin} color={black}>
              Quantity
            </Text>
            <ScrollView style={styles.scrollView}>
              <View style={styles.subContainer}>{renderQuantityList()}</View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default QuantitySelector;