// function onGooglePayLoaded() {
//   console.log('Google Pay is loaded and ready to set up the button.');
//   const paymentsClient = new google.payments.api.PaymentsClient({
//     environment: 'TEST',
//   });
//   addGooglePayButton(paymentsClient);
// }

// function addGooglePayButton(paymentsClient) {
//   const button = paymentsClient.createButton({
//     onClick: () => {
//       onGooglePayButtonClicked();
//     },
//   });
//   document.getElementById('google-pay-button').appendChild(button);
// }

// function onGooglePayButtonClicked() {
//   // Implementation of payment request or processing here
//   console.log('Google Pay button clicked.');
// }

// Check if Google Pay is available
function onGooglePayLoaded() {
  const paymentsClient = getGooglePaymentsClient();
  paymentsClient
    .isReadyToPay(getGoogleIsReadyToPayRequest())
    .then(function (response) {
      if (response.result) {
        addGooglePayButton();
      }
    })
    .catch(function (err) {
      console.error('Error checking Google Pay availability:', err);
    });
}

// Returns a Google Pay API version, payment methods supported by your site
function getGoogleIsReadyToPayRequest() {
  return {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
        },
      },
    ],
  };
}

// Create a PaymentsClient instance
function getGooglePaymentsClient() {
  return new google.payments.api.PaymentsClient({ environment: 'TEST' }); // Use 'PRODUCTION' when you’re ready to launch
}

// Add the Google Pay button to your site
function addGooglePayButton() {
  const paymentsClient = getGooglePaymentsClient();
  const button = paymentsClient.createButton({
    onClick: onGooglePayButtonClicked,
  });
  document.getElementById('google-pay-button').appendChild(button);
}

// Handle button click
function onGooglePayButtonClicked() {
  const paymentDataRequest = getGooglePaymentDataRequest();
  const paymentsClient = getGooglePaymentsClient();
  paymentsClient
    .loadPaymentData(paymentDataRequest)
    .then(function (paymentData) {
      // Handle successful payment here
      processPayment(paymentData);
    })
    .catch(function (err) {
      console.error('Failed to load payment data:', err);
    });
}

// Payment configuration and transaction details
function getGooglePaymentDataRequest() {
  return {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: '12345678901234567890', //replace with your google merchant id with need to verify your website
      merchantName: 'Demo Merchant',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: '10.00', // Total cost of the transaction
      currencyCode: 'USD',
      countryCode: 'US',
    },
  };
}

// Process payment data returned by the Google Pay API
function processPayment(paymentData) {
  // Extract and process payment token from paymentData
  console.log('Payment was successful:', paymentData);
}
