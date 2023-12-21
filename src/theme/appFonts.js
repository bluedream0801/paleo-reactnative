import appColors from './appColors'

export default appFonts = {
  FuturaPassata_Display: 'FuturaPassata-Display',
  GTWalsheim_Regular: 'GT-Walsheim-Pro-Regular-Regular',
  GTWalsheim_Regular_Oblique: 'GT-WalsheimRegular-Oblique',
  GTWalsheim_Condensed_Regular: 'GT-Walsheim-Pro-Condensed-Regular',
  GTWalsheim_Bold: 'GT-Walsheim-Pro-Bold-Regular',
  GTWalsheim_Bold_Oblique: 'GTWalsheim-Bold-Oblique',
  GTWalsheim_Condensed_Bold_Oblique: 'GTWalsheim-Condensed-Bold-Oblique',
  GTWalsheim_Condensed_Bold: 'GT-Walsheim-Pro-Condensed-Bold',
  GT_Walsheim_Pro_Medium_Regular: 'GT-Walsheim-Pro-Medium-Regular',
}

const BaseText = {
  fontSize: 15,
  color: appColors.blackOpacity,
  fontFamily: appFonts.GTWalsheim_Regular,
}

const RegularText = {
  ...BaseText,
}

const BoldText = {
  ...BaseText,
  fontFamily: appFonts.GTWalsheim_Bold,
}
const FuturaPassataText = {
  ...BaseText,
  fontFamily: appFonts.FuturaPassata_Display,
}
const CondensedText = {
  ...BaseText,
  fontFamily: appFonts.GTWalsheim_Condensed_Regular,
}
const CondensedBoldText = {
  ...BaseText,
  fontFamily: appFonts.GTWalsheim_Condensed_Bold,
}

const size = {
  mini: 8,
  maxMini: 9,
  tiny: 10,
  minSmall: 11, //
  small: 12, //

  extSmall: 13, //
  smallRegular: 14,
  regular: 16, //
  regularPlus: 17, //
  largeRegular: 18, //
  largeRegularBetween: 19,
  largeRegularPlus: 20, //
  smallMinTitle: 21, //
  minTitle: 23, ///
  smallTitle: 25, ///

  largeTitle: 26,
  largeTitlePlus: 27, //
  large: 30,
  largeHeading: 36,
  extraLarge: 40,
}

export const fontStyles = {
  RegularText,
  BoldText,
  size,
  CondensedText,
  CondensedBoldText,
  FuturaPassataText,
}
