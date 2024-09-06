function onGooglePayLoaded() {
  console.log('Google Pay is loaded and ready to set up the button.');
  const paymentsClient = new google.payments.api.PaymentsClient({
    environment: 'TEST',
  });
  addGooglePayButton(paymentsClient);
}

function addGooglePayButton(paymentsClient) {
  const button = paymentsClient.createButton({
    onClick: () => {
      onGooglePayButtonClicked();
    },
  });
  document.getElementById('google-pay-button').appendChild(button);
}

function onGooglePayButtonClicked() {
  // Implementation of payment request or processing here
  console.log('Google Pay button clicked.');
}
