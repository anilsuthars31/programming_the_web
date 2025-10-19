// let new_heading = document.getElementsByClassName('heading')[0];
// console.log(new_heading);
// new_heading.innerHTML = "PERFUME<br>TRAVEL";


// let heading_element = new_heading.innerHTML("PERFUME","TRAVEL")[0];
// console.log(heading_element);


let Button = document.getElementsByClassName('button')[0];
Button.addEventListener('click', function() {
    console.log("user clicked");
    alert("Item added to cart!");
})









let applyDiscountButton = document.getElementById('apply-discount');
applyDiscountButton.addEventListener('click', function() {
    let discountInput = document.getElementById('discount');
    let discountPercentage = parseFloat(discountInput.value);
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
        alert("Please enter a valid discount percentage between 0 and 100.");
        return;
    }

    // Get price elements
    let oldPriceElement = document.querySelector('.old-price');
    let newPriceElement = document.querySelector('.new-price');

    if (!oldPriceElement) {
        alert("Original price element not found.");
        return;
    }

    // Extract numeric value (remove $ and other non-numeric chars)
    let oldPriceText = oldPriceElement.textContent.trim().replace(/[^\d.]/g, '');
    let oldPrice = parseFloat(oldPriceText);
    if (isNaN(oldPrice)) {
        alert("Original price is invalid.");
        return;
    }

    // Calculate discounted price
    let discountAmount = (discountPercentage / 100) * oldPrice;
    let discountedPrice = oldPrice - discountAmount;

    // Update the page:
    // - show the original price struck-through (if newPriceElement exists, show discounted price there)
    // - if no new-price element exists, replace the shown price with the discounted price
    oldPriceElement.innerHTML = `<s>$${oldPrice.toFixed(2)}</s>`;

    if (newPriceElement) {
        newPriceElement.textContent = `$${discountedPrice.toFixed(2)}`;
    } else {
        // fallback: overwrite the oldPriceElement with new price
        oldPriceElement.textContent = `$${discountedPrice.toFixed(2)}`;
    }

    // Store the current displayed price as the base for future discounts
    oldPriceElement.dataset.currentPrice = discountedPrice.toFixed(2);

    alert(`Discount of ${discountPercentage}% applied! New price is $${discountedPrice.toFixed(2)}.`);
});






