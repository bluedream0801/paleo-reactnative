import * as RNPayPal from 'react-native-paypal';

const requestOneTimePayment = async (token, options) => {
  options = options || {};

  // For one time payments
  const result = await RNPayPal.requestOneTimePayment(
    token,
    {
      amount: options.amount, // required e.g: '5'
      // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
      currency: options.currency || 'THB',
      // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
      localeCode: options.localeCode || 'th_TH',
      shippingAddressRequired: options.shippingAddressRequired === undefined ? !!options.shippingAddressRequired : false,
      userAction: options.userAction || 'commit', // display 'Pay Now' on the PayPal review page
      // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
      intent: options.intent || 'authorize',
    }
  );

  const {
    nonce,
    payerId,
    email,
    firstName,
    lastName,
    phone
  } = result;

  return result;
}

const requestBillingAgreement = async (token, options) => {
  options = options || {};
  // For vaulting paypal account see: https://developers.braintreepayments.com/guides/paypal/vault
  const result = await RNPayPal.requestBillingAgreement(
    token,
    {
      billingAgreementDescription: options.billingAgreementDescription || 'Billing description goes here', // required
      // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
      currency: options.currency || 'THB',
      // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
      localeCode: options.localeCode || 'th_TH',
    }
  );

  const {
    nonce,
    payerId,
    email,
    firstName,
    lastName,
    phone
  } = result;

  return result;
}

export const PayPal = {
  requestOneTimePayment,
  requestBillingAgreement
}