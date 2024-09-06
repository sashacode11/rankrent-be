document
  .getElementById('emailForm')
  .addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Fetch values from the form
    const customerEmail = document.getElementById('customerEmail').value;
    const modalCustomerEmail = document.getElementById('modalCustomerEmail');
    const modalCustomer = document.getElementById('modalCustomer');

    // Fetch term selection and multiplier
    const termElement = document.getElementById('termSelect');
    const termSelect = termElement.options[termElement.selectedIndex].text;
    const termMultiplier = parseFloat(
      termElement.options[termElement.selectedIndex].getAttribute(
        'data-multiplier'
      )
    );

    // Fetch niche selection and amount
    const nicheElement = document.getElementById('niche');
    const nicheSelect = nicheElement.options[nicheElement.selectedIndex].text;
    const nicheAmount =
      parseFloat(
        nicheElement.options[nicheElement.selectedIndex]?.getAttribute(
          'data-base-price'
        )
      ) || 0;

    const region = document.getElementById('region').value;
    const locality = document.getElementById('locality').value;

    // Calculate the subtotal
    const subtotal = nicheAmount * termMultiplier;

    // Update modal contents
    document.getElementById('modalTerm').textContent = `${termSelect}`;
    document.getElementById('modalRegion').textContent = `${region}`;
    document.getElementById('modalNiche').textContent = `${nicheSelect}`;
    document.getElementById('modalLocality').textContent = `${locality}`;
    document.getElementById(
      'modalSubtotal'
    ).textContent = `US$${subtotal.toFixed(2)}`;

    // Also update hidden fields for form submission
    // document.getElementById('hiddenTerm').value = termSelect;
    // document.getElementById('hiddenRegion').value = region;
    // document.getElementById('hiddenNiche').value = nicheSelect;
    // document.getElementById('hiddenLocality').value = locality;
    // document.getElementById('hiddenSubtotal').value = subtotal.toFixed(2);
    // document.getElementById('modalCustomerEmail').value = customerEmail;
    // document.getElementById('modalCustomer').textContent = customerEmail;

    document.getElementById('modalTerm').textContent = `${termSelect}`;
    document.getElementById('modalRegion').textContent = `${region}`;
    document.getElementById('modalLocality').textContent = `${locality}`;
    document.getElementById(
      'modalSubtotal'
    ).textContent = `US$${subtotal.toFixed(2)}`;
    document.getElementById('hiddenTerm').value = termSelect;
    document.getElementById('hiddenRegion').value = region;
    document.getElementById('hiddenNiche').value = nicheSelect;
    document.getElementById('hiddenLocality').value = locality;
    document.getElementById('hiddenSubtotal').value = subtotal.toFixed(2);
    document.getElementById('modalCustomerEmail').value = customerEmail;
    document.getElementById('modalCustomer').textContent = customerEmail;

    if (customerEmail) {
      modalCustomerEmail.value = customerEmail;
      modalCustomer.textContent = customerEmail;
    }

    // Display the modal
    document.getElementById('modal').style.display = 'block';
  });

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}
