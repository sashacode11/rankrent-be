document.addEventListener('DOMContentLoaded', function () {
  const serverDataElement = document.getElementById('serverData');
  const allData = JSON.parse(serverDataElement.getAttribute('data-all-data'));

  $(document).ready(function () {
    $('#region')
      .select2()
      .on('change', function () {
        var selectedRegion = $(this).val();
        var localitySelect = $('#locality');

        // Clear the previous locality options
        localitySelect.empty().append(new Option('Select locality', ''));

        if (selectedRegion && allData[selectedRegion]) {
          allData[selectedRegion].forEach(function (item) {
            localitySelect.append(new Option(item.locality, item.locality));
          });
        }

        // Reinitialize Select2 for the locality select element
        localitySelect.select2({
          width: '100%',
          placeholder: 'Select a locality',
          allowClear: true,
        });
      });

    // Initial Select2 setup for locality, in case it's not dynamically updated at first
    $('#locality').select2({
      width: '100%',
      placeholder: 'Select a locality',
      allowClear: true,
    });
  });
});
