import React from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./AboutUsPopupStyles";
import { appImages } from "../../theme";
import { Text } from "../../components";

const contents = [
  {
    height: 440,
    headline: "No antibiotics or growth\n hormones in your meats or fish.",
    body:
`We carry (and cook with) only:

● 100% grass-fed beef
● wild-caught fish
● free-range pork & poultry

Guaranteed to be free from hormones or antibiotics.

Why do we do this? Animals that ate their natural diets are healthier for you and for the planet - and the animals live the good life too.

We support regenerative farming & sustainable fishing operations that allow us to eat the way nature intended. Learn more about grass-fed vs grain-fed beef, why we only carry wild-caught fish, and more on our blog.`,
  }, {
    height: 470,
    headline: "No cheap, highly-processed seed \nor “vegetable” oils.",
    body:
`Industrial oils like canola, soybean, or other seed or “vegetable” oils require heavy processing and chemicals to make them edible - not a good sign.

And because these oils are super cheap, you’ll find them hiding in everything from processed foods to street food - so it’s easy for these “bad fats” to add up in a hurry.

We don’t allow ANY seed oils in our products or our Grocery.

Instead, we cook with healthier fats like extra virgin olive oil, coconut oil, grass-fed butter or ghee, or animal fats.

Turns out that these usually taste better too - so your body AND your taste buds will thank you for cutting out industrial oils!
`,
  }, {
    height: 500,
    headline: "Local, certified organic \nproduce as often as possible!",
    body:
`We source our produce from a trusted group of farms and suppliers who are committed to growing the market for pesticide-free produce in Thailand.

Organic certification is usually too costly for small growers, and the best quality often comes from personal relationships - so we visit our suppliers’ farms ourselves and get to know them.

While Thailand produces lots of great fruits & veggies, and we love to support local farms - Thailand doesn’t have the ideal climate for growing everything, so for some items, we work with trusted importers.

Our produce is clearly labeled as either pesticide-free, certified organic, or GAP. If you’re ever unsure - just ask us! We can tell you where the latest produce is in from.
`,
  }, {
    height: 350,
    headline: "No weird stuff, period.",
    body:
`The modern food industry is a lot more concerned with cost, extreme taste, or shelf life than your health.

We believe real, high-quality food delivers amazing flavor AND great nutrients, without the need for weird additives.

If you don’t recognize an ingredient, your body probably doesn’t either!

Want to get specific? Check out our “no thanks” list below, where we share what you’ll never find in our food or our Grocery.
`,
  }
]
const AboutUsPopup = (props) => {
  const { setShowPrivacyModal, contentStyle, index } = props;

  const contentStyles = [styles.content];
  if (contentStyle) {
    contentStyles.push(contentStyle);
  }

  const selectedContent = contents[index - 1];

  return (
    <Modal
      visible={props.showPrivacyModal}
      onRequestClose={() => setShowPrivacyModal()}
      transparent={true}
      animationType={"slide"}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        onPress={() => {
          setShowPrivacyModal();
        }}
      >
        <View style={[styles.container]}>
          <View style={[styles.body, { height: selectedContent.height }]}>
            <View style={styles.topView}>
              <Text style={styles.topText} numberOfLines={2} condensedBold>
                {selectedContent.headline}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.crossBtn}
              onPress={() => setShowPrivacyModal()}
            >
              <Image
                source={appImages.close}
                style={styles.crossImg}
                resizeMode={"contain"}
              />
            </TouchableOpacity>

            <ScrollView style={styles.scrollView}>
              <View style={styles.innserScoll}>
                <Text lineHeight={18}>
                  {selectedContent.body}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AboutUsPopup;
