import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./SpecialQuantityPopupStyles";
import { appImages, appColors } from "../../theme";
import { Text, Button  } from "../../components/";
const {
  black,
} = appColors;

const SpeicalQuantitySelector = (props) => {
  const {
    showModal,
    setShowPrivacyModal,
    deleteLot,
    addExtraLot,
    CombinedOrMultipleDaysDelivery,
    selectedObject,
  } = props;
  
  const addAnother = () => {
    console.log('Trying to add another Lot',selectedObject);
    addExtraLot(selectedObject)
    setShowPrivacyModal();
  };
  
  const Remove = () => {
    console.log('Trying to delete',selectedObject);
    deleteLot(selectedObject);
    setShowPrivacyModal();
  };
  
  console.log('Quantity Popup Check', selectedObject)

  return (
    <Modal
      onShow={() => {}}
      visible={showModal}
      onRequestClose={() => setShowPrivacyModal()}
      transparent={true}
      animationType={"slide"}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPrivacyModal();
        }}
      >
        <View style={[styles.container]}>
          <View style={[styles.body]}>
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
              Change quantity
            </Text>
            <Text style={styles.description} color={black}>
              This product is sold by weight, {"\n"}so each piece has a unique price.
            </Text>
            <View style={[styles.footer]}>
              <Button
                btnTitle={'Remove'}
                style={styles.remove}
                onPress={Remove}              
              />
              <Button
                btnTitle={'Add another'}
                style={styles.addAnother}
                onPress={addAnother}              
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SpeicalQuantitySelector;