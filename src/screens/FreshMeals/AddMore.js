import React from "react";
import { TouchableOpacity } from "react-native";
import { appColors } from "../../theme";
import { Text } from "../../components";
import moment from "moment";
import styles from "./NothingInCartStyles";
const { green } = appColors;

const AddMore = ({item, onClick, isLast=false}) => {
  
  return (
    <TouchableOpacity onPress={() => onClick(item)}>
      <Text
        lineHeight={18.53}
        smallRegular
        color={green}
        textAlign={"center"}
        style={[
          styles.bottomText,
          {
            marginBottom: isLast? 30 : 0,
          },
        ]}
      >
        Add more for {moment(item.delivery_date).format("ddd, Do")}
      </Text>
    </TouchableOpacity>
  );
};

export default AddMore;
