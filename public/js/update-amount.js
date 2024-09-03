// document.addEventListener('DOMContentLoaded', function () {
//   const termSelect = document.getElementById('termSelect');
//   const amountDisplay = document.getElementById('amountDisplay');

//   function updateAmount() {
//     const selectedTerm = termSelect.value;
//     const amount = window.termsToAmounts[selectedTerm];
//     amountDisplay.textContent = 'Amount: $' + (amount || '0.00');
//   }

//   // Attach event listener to the term select dropdown
//   termSelect.addEventListener('change', updateAmount);

//   // Initialize the display on load in case there's a default selection
//   updateAmount();
// });

// document.addEventListener('DOMContentLoaded', function () {
//   updatePrice(); // Initial price update
// });

// function updatePrice() {
//   const productSelect = document.getElementById('productSelect');
//   const priceDisplay = document.getElementById('priceDisplay');
//   const selectedPrice = productSelect.value;

//   priceDisplay.textContent = `US$${selectedPrice}/mo`;
// }

document
  .getElementById('emailForm')
  .addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Fetch values from the form
    const customerEmail = document.getElementById('customerEmail').value;
    const termElement = document.getElementById('termSelect');
    const termSelect = termElement.value;
    const termAmount =
      termElement.options[termElement.selectedIndex].getAttribute(
        'data-amount'
      );
    const region = document.getElementById('region').value;
    const niche = document.getElementById('niche').value;
    const locality = document.getElementById('locality').value;

    // Update modal contents
    document.getElementById(
      'modalCustomer'
    ).textContent = `Customer Email: ${customerEmail}`;
    document.getElementById(
      'modalTerm'
    ).textContent = `Term Selected: ${termSelect} - US$${termAmount}`;
    document.getElementById('modalRegion').textContent = `Region: ${region}`;
    document.getElementById('modalNiche').textContent = `Niche: ${niche}`;
    document.getElementById(
      'modalLocality'
    ).textContent = `Locality: ${locality}`;
    document.getElementById(
      'modalSubtotal'
    ).textContent = `Subtotal: US$${termAmount}`; // Display the amount

    // Display the modal
    document.getElementById('modal').style.display = 'block';
  });

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function confirmSubmission() {
  // Handle the confirmation of the form submission here
  closeModal();
  alert('Email would be sent here');
}
