import React from 'react'
import appColors from '../../theme/appColors'
import styles from './Styles'
import { Text as RNText } from 'react-native'
import { fontStyles } from '../../theme'
const {
  RegularText,
  BoldText,
  size,
  CondensedText,
  CondensedBoldText,
  FuturaPassataText,
} = fontStyles

const Text = (props) => {
  const setSize = (size) => ({
    fontSize: size,
  })

  const {
    style,
    children,
    noOfLines,
    underlined,
    color = appColors.darkGray,
    bold,
    regular,
    textAlign = 'left',
    extraLarge,
    buttonTextSize,
    small,
    large,
    smallTitle,
    largeTitle,
    largeHeading,
    largeRegular,
    tiny,
    smallRegular,
    regularFonts,
    mini,
    extSmall,
    lineHeight,
    condensed,
    condensedBold,
    regularPlus,
    largeRegularPlus,
    largeRegularBetween,
    largeTitlePlus,
    minSmall,
    minTitle,
    maxMini,
    futuraPassata,
    smallMinTitle,
    ...rest
  } = props

  const compStyles = [{ ...RegularText }]

  if (condensed) compStyles.push(CondensedText)
  if (condensedBold) compStyles.push(CondensedBoldText)
  if (futuraPassata) compStyles.push(FuturaPassataText)
  if (bold) compStyles.push(BoldText)
  if (small) compStyles.push(setSize(size.small))
  if (largeTitlePlus) compStyles.push(setSize(size.largeTitlePlus))
  if (minSmall) compStyles.push(setSize(size.minSmall))
  if (largeRegularBetween) compStyles.push(setSize(size.largeRegularBetween))

  if (minTitle) compStyles.push(setSize(size.minTitle))
  if (regular) compStyles.push(setSize(size.regular))
  if (regularPlus) compStyles.push(setSize(size.regularPlus))
  if (smallMinTitle) compStyles.push(setSize(size.smallMinTitle))

  if (maxMini) compStyles.push(setSize(size.maxMini))

  if (large) compStyles.push(setSize(size.large))
  if (extSmall) compStyles.push(setSize(size.extSmall))
  if (largeRegularPlus) compStyles.push(setSize(size.largeRegularPlus))

  if (largeHeading) compStyles.push(setSize(size.largeHeading))
  if (smallRegular) compStyles.push(setSize(size.smallRegular))
  if (mini) compStyles.push(setSize(size.mini))
  if (smallTitle) compStyles.push(setSize(size.smallTitle))
  if (extraLarge) compStyles.push(setSize(size.extraLarge))
  if (buttonTextSize) compStyles.push(setSize(size.buttonTextSize))
  if (largeTitle) compStyles.push(setSize(size.largeTitle))
  if (largeRegular) compStyles.push(setSize(size.largeRegular))
  if (tiny) compStyles.push(setSize(size.tiny))
  if (underlined) {
    compStyles.push(styles.underlined, { borderBottomColor: color })
  }
  if (lineHeight) {
    compStyles.push({ lineHeight: lineHeight })
  }

  if (color) compStyles.push({ color })

  compStyles.push({ textAlign: textAlign })
  compStyles.push(style)

  return (
    <RNText style={compStyles} numberOfLines={noOfLines} {...rest}>
      {children}
    </RNText>
  )
}

export default Text
