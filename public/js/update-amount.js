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
    document.getElementById('modalCustomer').textContent = `${customerEmail}`;
    document.getElementById(
      'modalTerm'
    ).textContent = `${termSelect} - US$${termAmount}`;
    document.getElementById('modalRegion').textContent = `${region}`;
    document.getElementById('modalNiche').textContent = `${niche}`;
    document.getElementById('modalLocality').textContent = `${locality}`;
    document.getElementById('modalSubtotal').textContent = `US$${termAmount}`; // Display the amount

    // Display the modal
    document.getElementById('modal').style.display = 'block';
    // document.getElementById('modal').classList.add('open');
  });

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  // document.getElementById('modal').classList.remove('open');
}

// function confirmSubmission() {
//   // Handle the confirmation of the form submission here
//   closeModal();
//   alert('Email would be sent here');
// }
