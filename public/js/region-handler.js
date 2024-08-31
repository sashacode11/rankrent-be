function updateRegions(countryCode) {
  const regionSelect = document.getElementById('region');
  if (countryCode === 'US') {
    fetch('/regions/us')
      .then(response => response.json())
      .then(regions => {
        regionSelect.innerHTML = '<option value="">Select region</option>';
        regions.forEach(region => {
          regionSelect.innerHTML += `<option value="${region}">${region}</option>`;
        });
      })
      .catch(error => {
        console.error('Error fetching regions:', error);
        regionSelect.innerHTML =
          '<option value="">Error loading regions</option>';
      });
  } else {
    regionSelect.innerHTML = '<option value="">No regions available</option>';
  }
}
