import React from 'react'
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native'
import styles from './Styles'
import { appImages } from '../../theme'
appImages
const TermsModal = (props) => {
  return (
    <Modal
      visible={props.showTermsModal}
      onRequestClose={() => props.setShowTermsModal()}
      transparent={true}
      animationType={'slide'}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.topView}>
            <Text style={styles.topText}>Terms of Use</Text>
          </View>
          <TouchableOpacity
            style={styles.crossBtn}
            onPress={() => props.setShowTermsModal()}
          >
            <Image
              source={appImages.close}
              style={styles.crossImg}
              resizeMode={'contain'}
            />
          </TouchableOpacity>

          <ScrollView style={styles.scrollView}>
            <Text style={styles.firstText}>
              The following applies to all Paleo Robbie packages, payments and
              voucher codes unless stated otherwise:
            </Text>

            <Text style={styles.content}>
              {`\n`}- Only one voucher code can be used per Fresh Meals or
              Grocery order. {`\n`}
              {`\n`}- Vouchers can only be used a maximum of once per customer,
              unless stated otherwise in the promotion. {`\n`}
              {`\n`}- Friends or family members at the same address cannot use a
              voucher code more than once between them. {`\n`}
              {`\n`}- Voucher codes cannot be combined, broken up, transferred
              or converted for cash value. {`\n`}
              {`\n`}- Voucher codes cannot be used after its expiry date. {`\n`}
              {`\n`}- Voucher codes that state they can only be used by new
              customers cannot be used by customers who have Paleo Robbie
              already. {`\n`}
              {`\n`}- We accept all Visa/MC/Amex credit cards, bank transfers
              and PayPal payments. {`\n`}
              {`\n`}- Refunds are given as in-store credit immediately (within 1
              working day) in the event a product was damaged or incorrectly
              delivered. The customer cannot return the product, but in case of
              a spoiled product or a missing one we give 100% refund as in-store
              credit. {`\n`}
              {`\n`}- What does Cash Refundable for Chieftains mean? Cash
              refunds for unused in-store credit are given to Chieftain members
              for their paid in-store credit upon request (within 10 working
              days) for up to 1 year. Refunds may incur bank fees. In-store
              credit credit does not expire for ten years. We do not give cash
              refunds for unused in-store credit to Savage or Warrior members,
              but credit can be transferred to another customer for a small
              admin fee. In-store credit which wasn't paid for but given as a
              bonus or for a promotion is never cash refundable. {`\n`}
              {`\n`}- We reserve the right to nullify a voucher if we suspect
              wrongful usage. {`\n`}
              {`\n`}
              Any questions? Please reach out to us anytime at
              cx@paleorobbie.com or 083-002-3607 ❤️ {`\n`}
              {`\n`}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default TermsModal
