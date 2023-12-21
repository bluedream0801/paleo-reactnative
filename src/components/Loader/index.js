import React, { Component, useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import styles from "./LoaderStyles";
import { appColors } from "../../theme";
import AppContext from "../../provider";

const { headerBgColor } = appColors;
const Loader = () => {
  const { isApiLoaderShowing } = useContext(AppContext);

  return (
    isApiLoaderShowing && (
      <View style={styles.modal}>
        <ActivityIndicator size="large" color={headerBgColor} />
      </View>
    )
  );
};

export default Loader;
