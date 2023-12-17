import { Linking } from "react-native";

export const callUs = () => {
  Linking.openURL('tel:083-002-3607');
}

export const emailUs = () => {
  Linking.openURL('mailto:cx@paleorobbie.com');
}

export const chatUs = () => {
  Linking.openURL('https://line.me/R/oaMessage/@paleorobbie');
}