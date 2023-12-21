import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { appImages } from '../../theme'

import styles from './Styles'

const ReviewsComponent = (props) => {
  const {
    reviews,
    from
  } = props

  const renderReview = (index, img) => {
    return (
        reviews[index - 1] > 0 && 
            <View style={styles.itemContainer}>
                <Image source={img} resizeMode="contain" style={styles.image}/>
                <Text style={styles.text}>{reviews[index-1]}</Text>
            </View>
    )
  }
  
   const renderReviewDetails = (index, img) => {
    return (
        reviews[index - 1] > 0 && 
            <View style={styles.itemContainerDetails}>
                <Image source={img} resizeMode="contain" style={styles.image}/>
                <Text style={styles.text}>{reviews[index-1]}</Text>
            </View>
    )
  }
  
  if (from == 'main_menu') {
      return (
        <View style={styles.container}>
            {renderReview(1, appImages.emoticon_1)}
            {renderReview(2, appImages.emoticon_2)}
            {renderReview(3, appImages.emoticon_3)}
            {renderReview(4, appImages.emoticon_4)}
        </View>
      )
  } else {
      return (
        <View style={styles.container_details}>
            {renderReviewDetails(1, appImages.emoticon_1)}
            {renderReviewDetails(2, appImages.emoticon_2)}
            {renderReviewDetails(3, appImages.emoticon_3)}
            {renderReviewDetails(4, appImages.emoticon_4)}
        </View>
      )
  }
}

export default ReviewsComponent