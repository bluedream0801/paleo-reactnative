import React, { useState, useContext } from "react";
import { TouchableOpacity, Image, View, ScrollView, Pressable, Linking } from "react-native";
import { appImages } from "../../theme";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { AccountHeader, Text } from "../../components/";
import styles from "./Styles";
import AboutUsPopup from "./AboutUsPopup";
import AppContext from "../../provider";
import { chatUs } from '../../helpers/contact';

const {
  aboutUsMission,
  aboutUsPromise1,
  aboutUsPromise2,
  aboutUsPromise3,
  aboutUsPromise4,
  aboutUsPromise5,
  aboutUsBlog,
  aboutUsInstagram,
  aboutUsNoThanks,
  aboutUsLine,
} = appImages;

const AboutUs = (props) => {
  const { navigation } = props;
  const { setIsAnyPopupOpened } = useContext(AppContext);
  const [isOpenAboutUsPopUp, setIsOpenAboutUsPopUp] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AccountHeader
        title={"About us"}
        backArrow
        backPress={() => onBackPress()}
      />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.missionSection}>
          <Image
            source={aboutUsMission}
            style={styles.mission}
            resizeMode={"cover"}
          />
          <View style={styles.textView}>
            <Text minTitle condensedBold style={styles.title}>
              Our mission? {"\n"}Trust your food again.
            </Text>
            <Text bold regularPlus style={styles.subTitle}>
              Food is big business.{" "}
            </Text>
            <Text regular style={styles.description}>
              And big business usually means producing the most, at the lowest
              cost. Sometimes that’s great - but when it comes to food, it’s
              usually not.
            </Text>
          </View>
        </View>
        <View style={styles.secondSection}>
          <Text regular style={styles.secondSectionText}>
            Today’s supermarkets are full of processed “food products” with
            ingredients your grandmother wouldn’t recognize - and meats & fish
            from a factory farming system that puts volume and profits before
            your health, animal welfare, and sustainability.
          </Text>
          <Text regular style={styles.secondSectionText}>
            Fortunately, it’s not all like that! There are plenty of great
            producers focused on making food in a way that’s better for your
            health, your tastebuds, and the planet.
          </Text>
          <Text regular style={styles.secondSectionText}>
            That’s where we come in.
          </Text>
          <Text regular style={styles.secondSectionText}>
            We love to obsess about ingredient quality and supplier integrity -
            so you don’t have to. And we pride ourselves on having the highest
            standards in the industry.
          </Text>
          <Text regular style={styles.secondSectionText}>
            Learn more about our standards below.
          </Text>
        </View>
        <View style={styles.promiseSection}>
          <Text style={styles.promiseSectionTitle}>
            <Text largeRegularPlus condensedBold style={styles.promiseSectionTitle}>Our food standards - {"\n"}aka our{" "}</Text>
            <Text largeRegularPlus futuraPassata style={styles.promiseSectionTitleFood}>
              real food
            </Text>
            <Text largeRegularPlus condensedBold style={styles.promiseSectionTitle}>{" "}promise to you:</Text>
          </Text>
          <ScrollView
            horizontal={true}
            style={styles.promiseScrollTab}
          >
            <View style={styles.promiseSlide}>
              <Image
                source={aboutUsPromise1}
                style={styles.promiseSlideImage}
                resizeMode={"cover"}
              />
              <View style={styles.textView}>
                <Text regularPlus bold style={styles.promiseTitle}>
                  Rule #1: It must taste amazing!
                </Text>
                <Text regular style={styles.promiseDescription}>
                  Flavor is first - because without that, nothing else matters.
                </Text>
                <Text regular style={styles.promiseDescription}>
                  Our team of foodies & chefs try everything we carry & cook,
                  and if it doesn’t taste great, we’re not selling it.
                </Text>
                <Text regular style={styles.promiseDescription}>
                  Pretty simple...like most great food! (Swipe ➡️)
                </Text>
              </View>
            </View>
            <View style={styles.promiseSlide}>
              <Image
                source={aboutUsPromise2}
                style={styles.promiseSlideImage}
                resizeMode={"cover"}
              />
              <View style={styles.textView}>
                <Text regularPlus bold style={styles.promiseTitle}>
                  No antibiotics or growth{"\n"}hormones in your meats or fish.
                </Text>
                <Text regular style={styles.promiseDescription}>
                  We carry (and cook with) only:
                </Text>
                <Text regular style={styles.promiseDescription}>
                  ● 100% grass-fed beef{"\n"}
                  ● wild-caught fish{"\n"}
                  ● free-range pork & poultry
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentTab(1);
                    setIsOpenAboutUsPopUp(true);
                    setIsAnyPopupOpened(true);
                  }}
                >
                  <Text regular style={styles.promiseDescription}>
                    Read more
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.promiseSlide}>
              <Image
                source={aboutUsPromise3}
                style={styles.promiseSlideImage}
                resizeMode={"cover"}
              />
              <View style={styles.textView}>
                <Text regularPlus bold style={styles.promiseTitle}>
                  No cheap, highly-procesed{"\n"}seed or “vegetable” oils.
                </Text>
                <Text regular style={styles.promiseDescription}>
                  Super-cheap industrial oils like canola, soybean, or other
                  seed or “vegetable” oils require heavy processing to make. Not
                  a good sign.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentTab(2);
                    setIsOpenAboutUsPopUp(true);
                    setIsAnyPopupOpened(true);
                  }}
                >
                  <Text regular style={styles.promiseDescription}>
                    Read more
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.promiseSlide}>
              <Image
                source={aboutUsPromise4}
                style={styles.promiseSlideImage}
                resizeMode={"cover"}
              />
              <View style={styles.textView}>
                <Text regularPlus bold style={styles.promiseTitle}>
                  Local, certified organic{"\n"}produce as often as possible.
                </Text>
                <Text regular style={styles.promiseDescription}>
                  We source our produce from a trusted group of farms and
                  suppliers who are committed to growing the market for
                  pesticide-free produce in Thailand.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentTab(3);
                    setIsOpenAboutUsPopUp(true);
                    setIsAnyPopupOpened(true);
                  }}
                >
                  <Text regular style={styles.promiseDescription}>
                    Read more
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.promiseSlide}>
              <Image
                source={aboutUsPromise5}
                style={styles.promiseSlideImage}
                resizeMode={"cover"}
              />
              <View style={styles.textView}>
                <Text regularPlus bold style={styles.promiseTitle}>
                  No weird stuff, period.
                </Text>
                <Text regular style={styles.promiseDescription}>
                  The modern food industry is a lot more concerned with cost,
                  extreme taste, or shelf life than your health.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentTab(4);
                    setIsOpenAboutUsPopUp(true);
                    setIsAnyPopupOpened(true);
                  }}
                >
                  <Text regular style={styles.promiseDescription}>
                    Read more
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.noThanksSection}>
          <View style={styles.noThanksTop}>
            <View style={{ width: "55%" }}>
              <Text condensedBold largeRegularPlus style={styles.noThanksTitle}>
                Our “no thanks” list :
              </Text>
              <Text regular style={styles.noThanksSubTitle}>
                Here’s what you won’t find in our Grocery or in our food
              </Text>
            </View>
            <View style={{ width: "45%", paddingLeft: 13 }}>
              <Image
                source={aboutUsNoThanks}
                style={styles.noThanks}
                resizeMode={"contain"}
              />
            </View>
          </View>
          <View style={styles.noThanksTable}>
            <View style={{ width: "55%" }}>
              <Text minSmall>
                <Text bold minSmall>
                  NO
                </Text>{" "}
                beef that is not 100% grass-fed{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                factory-farmed poultry or pork{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                fish that is not wild-caught{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                seed or “vegetable” oils {"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                refined sugars{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                artificial flavors or sweeteners{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                additives with INS numbers{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                artificialpreservatives{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                soy lecithin or non-food thickeners
              </Text>
            </View>
            <View style={{ width: "45%", paddingLeft: 13 }}>
              <Text minSmall>
                <Text bold minSmall>
                  NO
                </Text>{" "}
                GMO ingredients{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                MSG{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                corn starch or syrup{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                hydrogenated oils{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                dextrose or maltodextrin{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                conventional dairy{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                sunthetic food colorings{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                conventional wheat flour{"\n"}
                <Text bold minSmall>
                  NO
                </Text>{" "}
                fruit juice concentrates
              </Text>
            </View>
          </View>
          <View style={styles.noThanksFooter}>
            <Pressable
              style={styles.noThanksFooterItem}
              onPress={() => Linking.openURL('https://www.instagram.com/paleorobbie/')}
            >
              <Image
                source={aboutUsInstagram}
                style={styles.noThanksFooterImage}
                resizeMode={"contain"}
              />
              <Text condensedBold small style={styles.noThanksFooterText}>
                Follow along on Instagram
              </Text>
            </Pressable>
            <Pressable style={styles.noThanksFooterItem} onPress={() => chatUs()}>
              <Image
                source={aboutUsLine}
                style={styles.noThanksFooterImage}
                resizeMode={"contain"}
              />
              <Text condensedBold small style={styles.noThanksFooterText}>
                Get on our LINE Official list for weekly deals & new product
                anouncements
              </Text>
            </Pressable>
            <View style={styles.noThanksFooterItem}>
              <Image
                source={aboutUsBlog}
                style={styles.noThanksFooterImage}
                resizeMode={"contain"}
              />
              <Text condensedBold small style={styles.noThanksFooterText}>
                Check out our past newsletters and videos on our blog
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {isOpenAboutUsPopUp && (
        <View style={styles.modalContain}>
          <AboutUsPopup
            index={currentTab}
            showPrivacyModal={isOpenAboutUsPopUp}
            setShowPrivacyModal={() => {
              setIsOpenAboutUsPopUp(false);
              setIsAnyPopupOpened(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default AboutUs;
