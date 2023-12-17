import AsyncStorage from '@react-native-async-storage/async-storage';
import LineLogin, { BotPrompt } from '@xmartlabs/react-native-line';
import * as Linking from 'expo-linking';
import Services from "../services";
const { API } = Services;

const loginWitthLINE = async (cartData, setIsApiLoaderShowing) => {
  const loginResult = await LineLogin.login({
    botPrompt: BotPrompt.AGGRESSIVE
  });
  const params = [loginResult.accessToken.access_token];

  let send_grocery_cart_id = null;
  if ( cartData && cartData.lines && cartData.lines.length > 0) {
      send_grocery_cart_id = parseInt(global.cartId);
  } else {
    global.cartId = null;
  }

  const ctx = {
    grocery_cart_id: send_grocery_cart_id,
    meal_cart_id: parseInt(global.mealsCartId),
  };

  const data = await API.execute("ecom2.interface", "login_line", params, {context: ctx}, setIsApiLoaderShowing);
  return data;
}

const loginWitthLINE_v2 = async (cartData, setIsApiLoaderShowing) => {
  const loginResult = await LineLogin.login({
    botPrompt: BotPrompt.AGGRESSIVE
  });
  const friendshipStatus = await LineLogin.getBotFriendshipStatus();
  const params = [loginResult.accessToken.access_token];

  let send_grocery_cart_id = null;
  if ( cartData && cartData.lines && cartData.lines.length > 0) {
      send_grocery_cart_id = parseInt(global.cartId);
  } else {
    global.cartId = null;
  }

  const ctx = {
    grocery_cart_id: send_grocery_cart_id,
    meal_cart_id: parseInt(global.mealsCartId),
    line_friendship: friendshipStatus.friendFlag
  };

  const data = await API.execute("ecom2.interface", "login_line_v2", params, {context: ctx}, setIsApiLoaderShowing);
  return data;
}

const createAcccountWithLINE_v2 = async (cartData, ctx, setIsApiLoaderShowing) => {
  const loginResult = await LineLogin.login({
    botPrompt: BotPrompt.AGGRESSIVE
  });
  const friendshipStatus = await LineLogin.getBotFriendshipStatus();
  const params = [loginResult.accessToken.access_token];

  if (ctx) {
    ctx.line_friendship = friendshipStatus.friendFlag;
  }

  const data = await API.execute("ecom2.interface", "create_account_line_v2", params, {context: ctx}, setIsApiLoaderShowing);
  return data;
}

const updateAcccountLINE_v2 = async (ctx, setIsApiLoaderShowing) => {
  const loginResult = await LineLogin.login({
    botPrompt: BotPrompt.AGGRESSIVE
  });
  const friendshipStatus = await LineLogin.getBotFriendshipStatus();
  const params = [loginResult.accessToken.access_token];

  if (ctx) {
    ctx.line_friendship = friendshipStatus.friendFlag;
  }

  const data = await API.execute("ecom2.interface", "update_account_line_v2", params, {context: ctx}, setIsApiLoaderShowing);
  return data;
}

const hasFollowedLINEQA = async () => {
  try {
    const status = await LineLogin.getBotFriendshipStatus();
    return status.friendFlag;
  } catch(e) {
    // TODO: invalid refresh token
    console.log('Line error: ', e);
    return false;
  }
}

const shouldAskLINELinking = async () => {
  const option = await AsyncStorage.getItem('link_LINE_account');
  if (!option) {
    return true;
  }

  return JSON.parse(option);
}

const setShouldAskLINELinking = async (shouldAsk) => {
  await AsyncStorage.setItem('link_LINE_account', JSON.stringify(shouldAsk));
}

const openFollowLINEQA = () => {
  Linking.openURL(`https://line.me/R/ti/p/@paleorobbie`);
}

export default {
  loginWitthLINE,
  loginWitthLINE_v2,
  createAcccountWithLINE_v2,
  updateAcccountLINE_v2,
  shouldAskLINELinking,
  setShouldAskLINELinking,
  openFollowLINEQA,
  hasFollowedLINEQA
}
