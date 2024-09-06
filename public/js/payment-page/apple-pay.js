// Function to show the Apple Pay button
function showApplePayButton() {
  if (window.ApplePaySession) {
    if (ApplePaySession.canMakePayments()) {
      var applePayBtn = ApplePaySession.createButton({ style: 'black' }); // Choose style as needed
      applePayBtn.addEventListener('click', applePayButtonClicked);
      document.getElementById('apple-pay-button').appendChild(applePayBtn);
    } else {
      console.log('Apple Pay is not available');
    }
  }
}

// Function called when Apple Pay button is clicked
function applePayButtonClicked() {
  // Start Apple Pay Session here
  console.log('Apple Pay button clicked');
  // Add Apple Pay Session handling logic here
}

// Function to load the Apple Pay SDK once
function loadApplePayScript() {
  if (!window.applePayScriptLoaded) {
    var script = document.createElement('script');
    script.onload = function () {
      window.applePayScriptLoaded = true; // Set a flag to indicate the script has been loaded
      showApplePayButton(); // Show the Apple Pay button after loading the script
    };
    script.src = 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js';
    script.async = true;
    document.head.appendChild(script);
  } else {
    showApplePayButton(); // If already loaded, just show the button
  }
}

// Asynchronously load the Apple Pay JS after the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', loadApplePayScript);
