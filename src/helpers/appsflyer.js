import appsFlyer from 'react-native-appsflyer';
import { Platform } from 'react-native';

const initOptions = {
  devKey: 'eXgNBxV5xLraunhuZP74XZ',
  isDebug: true,
  appId: '1597443504',
  onInstallConversionDataListener: true, //Optional
  onDeepLinkListener: true, //Optional
  timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
}

const setDeepLinkListener = (listener) => {
  return appsFlyer.onDeepLink(listener);
}

const initSDK = () => {
  appsFlyer.setAppInviteOneLinkID('cFgG');
  appsFlyer.setOneLinkCustomDomains(['click.paleorobbie.com'], (result) => {
    console.log(result);
  }, (error) => {
    console.log(error);
  })
  return new Promise((resolve) => {
    appsFlyer.initSdk(
      initOptions,
      (result) => {
        console.log(result);
        resolve();
      },
      (error) => {
        console.error(error);
        resolve();
      }
    );
    });
}

const logEvent = (eventName, eventValues) => {
  appsFlyer.logEvent(eventName, eventValues, (res) => {
    console.log('log event success', eventName, res);
  }, (err) => {
    console.log('log event failed', eventName, err);
  })
}

const updateServerUninstallToken = (firebaseToken) => {
  if (Platform.OS === 'android') {
    appsFlyer.updateServerUninstallToken(firebaseToken, (success) => {
      console.log('Successfully updated firebase token for measuring app uninstalls', success);
    });
  }
}

const generateInviteLink = (userID, channel = 'gmail', campaign = 'invite', customParams = null) => {
  return new Promise((resolve, reject) => {
    appsFlyer.generateInviteLink({
      channel: channel,
      campaign: campaign,
      customerID: userID,
      userParams: customParams
    }, resolve, reject);
  });
}

export const AppsFyler = {
  initSDK,
  logEvent,
  updateServerUninstallToken,
  generateInviteLink,
  setDeepLinkListener
};