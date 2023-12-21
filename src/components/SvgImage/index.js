import React from 'react'
import { SvgXml } from 'react-native-svg'

const SvgImage = () => {
  const svgMarkup = `<svg width="29" height="26" viewBox="0 0 29 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2988 24.7337C14.6218 24.9549 15.0474 24.9549 15.3704 24.7337C26.1991 17.305 28.2726 13.4909 28.2694 8.40478C28.1859 6.01171 26.9981 3.79283 25.054 2.39802C20.0719 -1.33103 16.3415 3.98547 14.8353 5.69709C13.7788 4.49684 9.77696 -1.46347 4.6171 2.39802C2.80635 3.73853 1.40167 5.96795 1.39845 8.40478C1.39248 13.4909 3.47103 17.305 14.2988 24.7337Z" fill="#DECECC" stroke="#590800" stroke-width="1.275" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `
  const SvgComponent = () => <SvgXml xml={svgMarkup} width="301px" />

  return <SvgComponent />
}

export default SvgImage
