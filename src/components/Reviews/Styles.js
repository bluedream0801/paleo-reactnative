import { StyleSheet } from 'react-native'

import { appFonts, appColors } from '../../theme'

export default styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop:3,
    marginBottom: 5,
  },
  
  container_details: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop:0,
    marginBottom: 0,
  },
  
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 0,
    marginRight: 8,
  },
  
  itemContainerDetails: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 5,
    marginRight: 5,
  },
  image: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  text: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 3,
    color: appColors.buttonRed,
    fontFamily: appFonts.GTWalsheim_Bold,
    fontSize: 12,
  }
})
