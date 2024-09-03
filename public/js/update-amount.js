document.addEventListener('DOMContentLoaded', function () {
  const termSelect = document.getElementById('termSelect');
  const amountDisplay = document.getElementById('amountDisplay');

  function updateAmount() {
    const selectedTerm = termSelect.value;
    const amount = window.termsToAmounts[selectedTerm];
    amountDisplay.textContent = 'Amount: $' + (amount || '0.00');
  }

  // Attach event listener to the term select dropdown
  termSelect.addEventListener('change', updateAmount);

  // Initialize the display on load in case there's a default selection
  updateAmount();
});
