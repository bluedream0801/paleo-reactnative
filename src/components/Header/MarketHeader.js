import React, { useContext } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { appColors, appMetrics } from '../../theme'
import styles from './MarketHeaderStyles'
import appImages from '../../theme/appImages'
import Text from '../Text'
import AppContext from '../../provider'
const { black, darkGrey } = appColors
const { black_back_ic, search_large_ic, calander_ic, thick_arrow } = appImages

export const PLEASE_SELECT = 'Please select';

const AccountHeader = (props) => {
  const insets = useSafeAreaInsets()
  const { isAnyPopupOpened, isNotificationShowing } = useContext(AppContext)
  const {
    backArrow,
    crossBtn,
    onPressDropDown,
    condensedTitle,
    title,
    calenderImg,
    searchEnabled,
    titleStyle,
    hasNotificationBar
  } = props
  const compStyles = [{ ...styles.container }]
  const textStyles = [{ ...styles.title }]
  const titleStyles = [{ ...styles.margin }]
  textStyles.push({ color: appColors.black })

  titleStyles.push(titleStyle)

  const topOffset = hasNotificationBar ? 0 : insets.top;

  return (
    <View style={[...compStyles, { paddingTop: topOffset, height: appMetrics.headerHeight + topOffset }]}>
      {/* <View
        style={{
          width: '100%',
          height: 1,
          position: 'absolute',
          bottom: 18,
          backgroundColor: 'red',
        }}
      />
      <View
        style={{
          width: '100%',
          height: 1,
          position: 'absolute',
          bottom: 29,
          backgroundColor: 'red',
          zIndex: 7,
        }}
      /> */}

      <TouchableOpacity
        style={[styles.leftBtn, { top: topOffset }]}
        activeOpacity={0.7}
        onPress={props.backPress}
      >
        {backArrow && (
          <Image
            source={black_back_ic}
            style={styles.backImg}
            resizeMode={'contain'}
          />
        )}
      </TouchableOpacity>

      {title && (
        <TouchableOpacity style={styles.centerRow} onPress={onPressDropDown}>
          {calenderImg && (
            <Image
              source={calander_ic}
              style={styles.calenderImg}
              resizeMode={'contain'}
            />
          )}
          <Text style={titleStyles} regular color={title === PLEASE_SELECT ? darkGrey : black}>
            {title}
          </Text>
          <Image
            source={thick_arrow}
            style={styles.arrowImg}
            resizeMode={'contain'}
          />
          {/* <View
            style={{
              height: 1,
              backgroundColor: 'black',
              position: 'absolute',
              width: 300,
            }}
          /> */}
        </TouchableOpacity>
      )}
      {!!condensedTitle && (
        <Text
          condensedBold
          largeRegularPlus
          color={black}
          style={styles.largeHeading}
        >
          {condensedTitle}
        </Text>
      )}

      {searchEnabled && (
        <TouchableOpacity
          style={[styles.rightBtn, { top: topOffset }]}
          activeOpacity={0.7}
          onPress={props.searchPress}
        >
          {/* {crossBtn && (
          <Image
            source={crossBtn}
            style={styles.crossImg}
            resizeMode={'contain'}
          />
        )} */}
          <Image
            source={search_large_ic}
            style={styles.searchImg}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )}

      {isAnyPopupOpened && <View style={styles.overLay} />}
    </View>
  )
}

export default AccountHeader
