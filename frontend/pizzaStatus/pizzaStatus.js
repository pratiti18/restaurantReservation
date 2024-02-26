$(document).ready(function() {
    $('#cartModal').modal('show');
  });
  
  document.addEventListener('DOMContentLoaded', function() {
      // Get the base price and quantity input elements
      var basePrice = document.getElementById('base-price').innerHTML; // Replace this with the actual base price
    // alert(basePrice);
      var qtyInput = document.getElementById('input1');
      var finalPriceElement = document.querySelector('.final-price');
      // Calculate the final price when the page loads
      var qtyValue = parseInt(qtyInput.value); // Parse the quantity value to an integer
      var finalPrice = parseInt(basePrice) * qtyValue;
      // Populate the final price element with the calculated value
      finalPriceElement.textContent = finalPrice.toFixed(2); // Assuming you want to display the final price with two decimal places
  });