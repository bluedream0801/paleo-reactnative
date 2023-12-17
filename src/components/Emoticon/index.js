import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { appImages } from '../../theme'

import styles from './Styles'

const EmoticonComponent = (props) => {
  const {
    addReview,
    item,
    default_emoticon
  } = props

  const [expanded, setExpanded] = useState(false)
  var widthanimvalue = default_emoticon>0?36:38;
  const widthAnim = useRef(new Animated.Value(widthanimvalue)).current
  const [currentEmoticon, setCurrentEmoticon] = useState(default_emoticon)

  const handleToggle = (selectedEmoticon = 0) => {
    Animated.timing(widthAnim, {
        toValue: expanded?(selectedEmoticon>0?36:38):191,
        duration: 200,
        useNativeDriver: false,
    }).start(() => setExpanded(!expanded))
    setExpanded(!expanded)
  }

  return (
    <View style={styles.container}>
        <Animated.View style={[{width: widthAnim}]}>
            {!expanded &&
                <TouchableOpacity style={styles.emoticonContainer} onPress={handleToggle}>
                    { currentEmoticon > 0 &&
                        <TouchableOpacity style={styles.emoticonImage} onPress={handleToggle}>                               
                            {currentEmoticon == 1 && <Image source={appImages.emoticon_1} resizeMode="contain"/>}
                            {currentEmoticon == 2 && <Image source={appImages.emoticon_2} resizeMode="contain"/>}
                            {currentEmoticon == 3 && <Image source={appImages.emoticon_3} resizeMode="contain"/>}
                            {currentEmoticon == 4 && <Image source={appImages.emoticon_4} resizeMode="contain"/>}
                        </TouchableOpacity>
                    }
                    { currentEmoticon == 0 &&
                        <>
                            <TouchableOpacity style={styles.emoticonImageSmall} onPress={handleToggle}>
                                <Text style={styles.emoticonText}>+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.emoticonImageSmall} onPress={handleToggle}>
                                <Image source={appImages.emoticon} resizeMode="contain"/>
                            </TouchableOpacity>
                        </>
                    }
                </TouchableOpacity>
            }
            {expanded && (
                <View style={styles.emoticonContainer}>
                    <TouchableOpacity style={styles.emoticonImage} onPress={() => handleToggle(currentEmoticon)}>
                        <Text style={styles.emoticonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setCurrentEmoticon(1), handleToggle(1), addReview(item.docId, item.lineId, 1) }} style={styles.emoticonImage}>
                        <Image source={appImages.emoticon_1} resizeMode="contain"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setCurrentEmoticon(2), handleToggle(2), addReview(item.docId, item.lineId,2) }} style={styles.emoticonImage}>
                        <Image source={appImages.emoticon_2} resizeMode="contain"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setCurrentEmoticon(3), handleToggle(3), addReview(item.docId, item.lineId,3) }} style={styles.emoticonImage}>
                        <Image source={appImages.emoticon_3} resizeMode="contain"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setCurrentEmoticon(4), handleToggle(4), addReview(item.docId, item.lineId,4) }} style={styles.emoticonImage}>
                        <Image source={appImages.emoticon_4} resizeMode="contain"/>
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    </View>
  )
}

export default EmoticonComponent