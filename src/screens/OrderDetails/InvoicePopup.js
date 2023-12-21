import React, { useContext } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Share,PermissionsAndroid
} from 'react-native'
import PDFReader from 'rn-pdf-reader-js'
import RNFetchBlob from 'rn-fetch-blob'
import moment from 'moment'
import { appColors, appImages } from '../../theme'
import Modal from 'react-native-modal'
const { blackOpacity } = appColors
import styles from './InvoiceStyles'
import { Button } from '../../components/'
import AppContext from '../../provider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const InvoicePopup = (props) => {
  const { setShowModal, showModal, invoiceURL } = props
  const { setIsApiLoaderShowing } = useContext(AppContext)

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Invoice',
        message: invoiceURL,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const downloadFile = async () => {
    setShowModal(false)
    setIsApiLoaderShowing(true)

    let url = encodeURI(invoiceURL)
    let dateString = new Date()
    dateString = moment().format('YYYY-MM-DD_ddd_HH-mm-ss');
    dateString = 'Paleo Robbie ' + dateString + '.pdf'
    if (Platform.OS === 'android') {
      // Calling the permission function
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to memory to download the file ',
          },
        )
        console.log("granted---",granted)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const { config, fs } = RNFetchBlob
          let DownloadDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
          let options = {
             
            appendExt: 'pdf',
       
             fileCache: false,

            addAndroidDownloads: {
              useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
              notification: true,
               path: `${DownloadDir}/${dateString}`,
              // this is the path where your downloaded file will live in
              description: 'Downloading File',
            },
          }
          console.log("granted---2",options)
          config(options)
            .fetch('GET', url)
            .then((res) => {
                setIsApiLoaderShowing(false)
              alert('File downloaded', '')
            }).catch((err) => {
              setIsApiLoaderShowing(false)
              console.warn(err)
            })
        } else {
          setIsApiLoaderShowing(false)
          alert(
            'Permission Denied!',
            'You need to give storage permission to download the file',
          )
        }
      } catch (err) { 
        setIsApiLoaderShowing(false)
        console.warn(err)
      }
    } else {
      
      const { config, fs } = RNFetchBlob
      let DownloadDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
      let options = {
        fileCache: true,
        	appendExt: 'pdf',
                
        addAndroidDownloads: {
          useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification: true,
          path: `${DownloadDir}/${dateString}`, // this is the path where your downloaded file will live in
          description: 'Downloading File',
        },
      }
   
   
      try {
        config(options)
          .fetch('GET', url)
          .then((res) => {
          setIsApiLoaderShowing(false)
          RNFetchBlob.ios.openDocument(res.data);
          })
      } catch (err) {
        setIsApiLoaderShowing(false)
        console.warn(err)
      }
    }
  }

  const insets = useSafeAreaInsets();
  return (
    <Modal
      testID={'modal'}
      isVisible={showModal}
      backdropColor={blackOpacity}
      style={{ margin: 0 }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={() => {
        setShowModal(false)
        //  setIsAnyPopupOpened(false)
      }}
      useNativeDriverForBackdrop
      swipeDirection={['down']}
    >
      <TouchableWithoutFeedback>
        <View style={[styles.container]}>
          <View style={[styles.body, { height: '95%' }]}>
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => setShowModal(false)}
            >
              <Image
                source={appImages.close}
                style={styles.crossImg}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <View style={styles.subContainer}>
              <PDFReader
                source={{
                  uri: invoiceURL,
                }}
              />
            </View>
            <Button
              onPress={() => {
                // onShare()
                downloadFile()
              }}
              style={[styles.btn, { marginBottom: insets.bottom + 22 }]}
              small
              btnTitle={'Download'}
              textStyle={styles.text}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default InvoicePopup
