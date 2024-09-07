document.addEventListener('DOMContentLoaded', function () {
  if (window.ApplePaySession) {
    if (ApplePaySession.canMakePayments()) {
      const applePayButton = ApplePaySession.createButton({
        style: 'black',
      });
      applePayButton.addEventListener('click', startApplePaySession);
      document.getElementById('apple-pay-button').appendChild(applePayButton);
    } else {
      console.log('Apple Pay is not available on this device.');
    }
  }
});

function startApplePaySession() {
  const session = new ApplePaySession(3, {
    countryCode: 'US',
    currencyCode: 'USD',
    supportedNetworks: ['visa', 'masterCard', 'amex'],
    merchantCapabilities: ['supports3DS'],
    total: { label: 'Your Shop', amount: '10.00' },
  });

  session.onvalidatemerchant = event => {
    fetch('/validate-merchant', {
      method: 'POST',
      body: JSON.stringify({ validationURL: event.validationURL }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => session.completeMerchantValidation(data))
      .catch(err => console.error('Merchant validation failed:', err));
  };

  session.onpaymentauthorized = event => {
    console.log('Payment authorized by user:', event.payment);
    session.completePayment(ApplePaySession.STATUS_SUCCESS);
    // Here you would send payment data to your server to process and confirm the payment
  };

  session.begin();
}
